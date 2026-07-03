# Azure VM, Kafka & .NET Microservices Lab

> **Day 51 – Azure Infrastructure as Code (IaC) with Bicep, Kafka KRaft, and .NET 8**

---

# Table of Contents

1. Infrastructure as Code (IaC)
2. Azure Resource Manager (ARM)
3. Azure Bicep
4. Azure Resource Group
5. Azure Virtual Machine (VM)
6. Azure Virtual Network (VNet)
7. Subnet
8. Network Security Group (NSG)
9. Public IP Address
10. Network Interface Card (NIC)
11. Azure Custom Script Extension
12. Bash Script (setup.sh)
13. SSH (Secure Shell)
14. Apache Kafka
15. Kafka KRaft Mode
16. Kafka Topics
17. Kafka Producer & Consumer
18. Apache ZooKeeper
19. .NET 8 Web API
20. ASP.NET Core Controllers
21. Models
22. Dependency Injection (DI)
23. Singleton Lifetime
24. Confluent.Kafka
25. JSON Serialization
26. HTTP API
27. Console Application
28. Event-Driven Architecture
29. Overall Architecture
30. Commands Learned
31. Key Learnings

---

# 1. Infrastructure as Code (IaC)

Infrastructure as Code (IaC) is the practice of creating and managing cloud infrastructure using code instead of manually configuring resources through the Azure Portal.

### Benefits

- Automated deployments
- Version controlled infrastructure
- Repeatable deployments
- Less human error
- Faster provisioning
- CI/CD friendly

---

# 2. Azure Resource Manager (ARM)

Azure Resource Manager (ARM) is Azure's deployment engine.

It is responsible for

- Creating Azure resources
- Updating resources
- Managing dependencies
- Tracking deployments

Flow

```
Bicep
    │
    ▼
ARM Engine
    │
    ▼
Azure Resources
```

---

# 3. Azure Bicep

Azure Bicep is Microsoft's Infrastructure as Code language.

Instead of writing large ARM JSON templates, Bicep provides a clean and readable syntax.

### Components

- Parameters
- Variables
- Resources
- Outputs
- Modules

Example

```bicep
param location string
resource vm 'Microsoft.Compute/virtualMachines@2023-07-01' = {
}
```

---

# 4. Azure Resource Group

A Resource Group is a logical container that stores related Azure resources.

Example

```
Resource Group
│
├── VM
├── VNet
├── NSG
├── Public IP
├── NIC
└── Disk
```

Benefits

- Resource organization
- Cost management
- RBAC
- Easy cleanup

---

# 5. Azure Virtual Machine (VM)

A Virtual Machine is a cloud-hosted computer.

In this lab

- Ubuntu 22.04
- Standard_B2ms
- Java 17
- .NET 8
- Kafka 3.7

---

# 6. Azure Virtual Network (VNet)

A Virtual Network provides private communication between Azure resources.

Example

```
10.0.0.0/16
```

---

# 7. Subnet

A subnet divides a Virtual Network into smaller networks.

Example

```
10.0.0.0/24
```

---

# 8. Network Security Group (NSG)

NSG is Azure's virtual firewall.

Used to allow or deny traffic.

Example Rule

| Protocol | Port | Action |
|----------|------|---------|
| TCP | 22 | Allow SSH |

---

# 9. Public IP Address

A Public IP allows external devices to connect to Azure resources.

Used for

- SSH
- Internet access

---

# 10. Network Interface Card (NIC)

NIC connects

- VM
- VNet
- Public IP

Without NIC, the VM cannot communicate over the network.

---

# 11. Azure Custom Script Extension

The Custom Script Extension automatically executes scripts after VM creation.

Used in this lab to run

```
setup.sh
```

It automatically installed

- Java
- .NET SDK
- Kafka

---

# 12. Bash Script (setup.sh)

setup.sh automated the entire VM setup.

Tasks

- Update packages
- Install Java
- Install .NET SDK
- Download Kafka
- Configure Kafka
- Create Kafka Service
- Create Kafka Topic

---

# 13. SSH (Secure Shell)

SSH securely connects to remote Linux servers.

Example

```bash
ssh abubakkar@20.xx.xx.xx
```

Runs on

```
Port 22
```

---

# 14. Apache Kafka

Apache Kafka is a distributed event streaming platform.

Uses

- Event Streaming
- Messaging
- Log Processing
- Real-Time Data

---

# 15. Kafka KRaft Mode

KRaft replaces ZooKeeper.

Benefits

- Simpler Architecture
- No ZooKeeper
- Better Performance
- Easier Deployment

Before Kafka starts

```
kafka-storage.sh format
```

must initialize metadata.

---

# 16. Kafka Topics

A Topic stores messages.

Created Topic

```
payment-events
```

Flow

```
Producer
    │
    ▼
Topic
    │
    ▼
Consumer
```

---

# 17. Kafka Producer & Consumer

## Producer

Sends messages into Kafka.

Used in

```
PaymentProcessor
```

## Consumer

Reads messages from Kafka.

Used in

```
PaymentSimulator
```

---

# 18. Apache ZooKeeper

ZooKeeper is a coordination service.

Responsibilities

- Leader Election
- Configuration Management
- Distributed Locking

Kafka KRaft removes this dependency.

---

# 19. .NET 8 Web API

Created

```
PaymentProcessor
```

Responsibilities

- Receive payment
- Approve or decline
- Publish to Kafka
- Return JSON response

Runs on

```
http://localhost:5100
```

---

# 20. ASP.NET Core Controllers

Controllers handle HTTP requests.

Created

```
PaymentController
```

Endpoints

```
POST /api/payment/process

GET /api/payment/health
```

---

# 21. Models

Models define data.

### PaymentRequest

```
TransactionId
MerchantName
Amount
CardLastFour
```

### PaymentResult

```
Status
Reason
Timestamp
```

---

# 22. Dependency Injection (DI)

Dependency Injection provides required objects automatically.

Instead of

```
new Producer()
```

ASP.NET injects

```
IProducer
```

Benefits

- Loose Coupling
- Reusability
- Testability

---

# 23. Singleton Lifetime

Registered

```csharp
builder.Services.AddSingleton<IProducer<string,string>>();
```

One producer instance is reused throughout the application.

Advantages

- Better performance
- Thread-safe
- Lower memory usage

---

# 24. Confluent.Kafka

Official Kafka client for .NET.

Provides

- Producer
- Consumer
- Serialization
- Topic Communication

---

# 25. JSON Serialization

Objects converted into JSON.

```csharp
JsonSerializer.Serialize(result)
```

JSON sent to Kafka.

---

# 26. HTTP API

Communication between applications.

Used

```
POST
```

to send payment requests.

---

# 27. Console Application

Created

```
PaymentSimulator
```

Responsibilities

- Generate payments
- Call API
- Read Kafka
- Display output

---

# 28. Event-Driven Architecture

Architecture used

```
PaymentSimulator
        │
        ▼
PaymentProcessor
        │
        ▼
Kafka
        │
        ▼
PaymentSimulator Consumer
```

Benefits

- Loose coupling
- Scalability
- Reliability
- Asynchronous communication

---

# 29. Overall Architecture

```
                     Azure VM
┌───────────────────────────────────────────┐

 PaymentSimulator
        │
        │ HTTP POST
        ▼
 PaymentProcessor (Web API)
        │
        │ Produce
        ▼
 Kafka Topic (payment-events)
        │
        │ Consume
        ▼
 PaymentSimulator Console

└───────────────────────────────────────────┘
```

---

# 30. Commands Learned

## Azure

```bash
az login

az account show

az group create

az deployment group create

az vm show

az group delete
```

---

## Linux

```bash
mkdir

cd

ls

cat

touch

rm

systemctl status kafka

java -version

dotnet --version
```

---

## .NET

```bash
dotnet new webapi

dotnet new console

dotnet add package Confluent.Kafka

dotnet run
```

---

## Kafka

```bash
kafka-topics.sh --list

kafka-topics.sh --create
```

---

## SSH

```bash
ssh username@public-ip
```

---

# 31. Key Learnings

✅ Infrastructure as Code (IaC)

✅ Azure Resource Manager (ARM)

✅ Azure Bicep

✅ Resource Groups

✅ Azure Virtual Machine

✅ Virtual Network

✅ Network Security Group

✅ Public IP

✅ Network Interface

✅ Azure Custom Script Extension

✅ Bash Automation

✅ SSH

✅ Apache Kafka

✅ Kafka KRaft Mode

✅ Kafka Topics

✅ Kafka Producer

✅ Kafka Consumer

✅ ASP.NET Core Web API

✅ Controllers

✅ Models

✅ Dependency Injection

✅ Singleton Pattern

✅ Confluent.Kafka

✅ JSON Serialization

✅ HTTP APIs

✅ Console Applications

✅ Event-Driven Architecture

✅ Real-Time Payment Processing

---

# Conclusion

In this lab, we provisioned an Azure Ubuntu Virtual Machine using **Azure Bicep (Infrastructure as Code)** and automatically configured it with **Java 17**, **.NET 8**, and **Apache Kafka 3.7 (KRaft Mode)** using a **Custom Script Extension**. We then built a **PaymentProcessor ASP.NET Core Web API** that publishes payment events to Kafka and a **PaymentSimulator Console Application** that sends payment requests and consumes Kafka events in real time. This lab provided hands-on experience with Azure infrastructure provisioning, event-driven architecture, Kafka messaging, dependency injection, and .NET microservices, demonstrating how modern cloud-native applications communicate asynchronously using Apache Kafka.