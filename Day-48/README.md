# Kubernetes Networking, Security & Microsoft Azure Concepts

This repository contains my hands-on learning and notes on **Kubernetes** and **Microsoft Azure** concepts.

---

# Table of Contents

## Kubernetes

1. Ingress
2. NGINX
3. Ingress Controller
4. Role
5. RoleBinding
6. ServiceAccount
7. Taints & Tolerations

## Microsoft Azure

8. Resource Groups
9. Virtual Machines
10. SSH Authentication
11. Azure SQL Database
12. Azure Storage Account
13. Azure Blob Storage
14. Static Website Hosting
15. Network Security Group (NSG)
16. Public Endpoint
17. Storage Redundancy

---

# Kubernetes Concepts

## Ingress

### Definition

Ingress manages external HTTP/HTTPS traffic into Kubernetes Services.

### Features

- Host-based routing
- Path-based routing
- SSL/TLS termination
- Single external IP
- Cost-effective traffic management

### Architecture

```
User
 │
DNS
 │
LoadBalancer
 │
Ingress Controller
 │
Ingress Rules
 │
Service
 │
Pods
```

---

## NGINX

NGINX can act as:

- Web Server
- Reverse Proxy
- Load Balancer
- API Gateway

### Reverse Proxy

```
Client
   │
NGINX
 │ │ │
B1 B2 B3
```

---

## Ingress Controller

The Ingress Controller watches Ingress resources and configures NGINX automatically.

```
Ingress YAML
      │
Ingress Controller
      │
NGINX Configuration
      │
Traffic Routing
```

---

## Role (RBAC)

A Role defines permissions inside a namespace.

Common permissions:

- get
- list
- watch
- create
- update
- patch
- delete

---

## RoleBinding

RoleBinding assigns a Role to:

- User
- Group
- ServiceAccount

```
User
 │
RoleBinding
 │
Role
 │
Permissions
```

---

## ServiceAccount

Provides identity for Pods.

```
Application
 │
Pod
 │
ServiceAccount
 │
API Server
 │
RBAC
 │
Allow / Deny
```

---

## Taints & Tolerations

### Taint

Applied to Nodes.

```
Keep Pods Away
```

### Toleration

Applied to Pods.

```
This Pod can run here.
```

### Scheduler

```
Scheduler
    │
Node has Taint?
   │
No → Schedule
Yes
   │
Matching Toleration?
   │
Yes → Schedule
No → Reject
```

---

# Microsoft Azure Concepts

# Resource Group

A Resource Group is a logical container for Azure resources.

```
Resource Group
│
├── VM
├── SQL Database
├── Storage Account
└── Public IP
```

---

# Azure Virtual Machine

A Virtual Machine is an Infrastructure as a Service (IaaS) resource.

Components

- CPU
- RAM
- Disk
- Network Interface
- Public IP

### VM Workflow

```
Azure Portal
      │
Create VM
      │
Ubuntu
      │
VM Size
      │
SSH Key
      │
Networking
      │
Deploy
```

---

# SSH Authentication

Azure Linux VMs use SSH authentication.

Recommended Key

- Ed25519

Connect

```bash
chmod 600 key.pem

ssh -i key.pem azureuser@<public-ip>
```

### Common Error

```
Permissions 0644 are too open
```

Fix

```bash
chmod 600 key.pem
```

---

# Network Security Group (NSG)

NSG controls inbound and outbound traffic.

Example

```
Inbound Rule

Port : 22

Protocol : TCP

Action : Allow
```

---

# Azure SQL Database

Azure SQL Database is Microsoft's managed SQL service.

Architecture

```
SQL Server
     │
Database
     │
Tables
     │
Queries
```

### SQL Authentication

```
Username

abuadmin

Password

********
```

### Test Query

```sql
SELECT @@VERSION;
```

---

# Azure Storage Account

A Storage Account stores Azure data.

Supports

- Blob
- Queue
- File
- Table

```
Storage Account
│
├── Blob
├── Queue
├── File
└── Table
```

---

# Azure Blob Storage

Blob Storage stores unstructured files.

Examples

- Images
- Videos
- PDFs
- Documents

```
Storage Account
      │
Container
      │
Blob
```

Example

```
Storage Account

abustorage2026

      │

images

      │

photo.jpg
```

---

# Container

A Container is similar to a folder.

Access Levels

- Private
- Blob
- Container

For Labs

```
Private
```

---

# Static Website Hosting

Azure Storage can host HTML websites.

Supported

- HTML
- CSS
- JavaScript
- Images

### Workflow

```
Storage Account
      │
Enable Static Website
      │
$web Container
      │
Upload index.html
      │
Primary Endpoint
      │
Website Live
```

Default File

```
index.html
```

---

# Public Endpoint

Allows Internet access to Azure resources.

```
Browser
     │
Public Endpoint
     │
Azure Resource
```

---

# Storage Redundancy

## LRS

Locally Redundant Storage

- Three copies
- Same datacenter
- Low cost

## GRS

Geo Redundant Storage

- Multiple regions
- Disaster Recovery
- Higher cost

---

# Azure Architecture

```
                     User
                      │
                Azure Portal
                      │
      ----------------------------------
      │              │               │
      ▼              ▼               ▼
 Virtual Machine SQL Database Storage Account
      │              │               │
      │              │         Blob Storage
      │              │               │
 SSH Connection Query Editor Static Website
      │              │               │
      └──────────────┴───────────────┘
                     │
                Azure Cloud
```

---

# Kubernetes vs Azure Mapping

| Kubernetes | Azure |
|------------|-------|
| Pod | Virtual Machine / Container |
| Service | Load Balancer |
| Ingress | Application Gateway / Front Door |
| ConfigMap | App Configuration |
| Secret | Azure Key Vault |
| Persistent Volume | Azure Managed Disk |
| RBAC | Azure RBAC |
| Namespace | Resource Group (logical comparison) |

---

# Commands Cheat Sheet

## SSH

```bash
chmod 600 key.pem

ssh -i key.pem azureuser@<public-ip>
```

## SQL

```sql
SELECT @@VERSION;
```

## Kubernetes

```bash
kubectl get ingress

kubectl get roles

kubectl get rolebindings

kubectl get serviceaccounts

kubectl taint nodes worker-1 gpu=true:NoSchedule
```

---

# Interview Quick Revision

## Kubernetes

- Ingress routes HTTP/HTTPS traffic.
- NGINX works as Reverse Proxy.
- Ingress Controller enforces Ingress rules.
- Role defines permissions.
- RoleBinding assigns permissions.
- ServiceAccount identifies Pods.
- Taints repel Pods.
- Tolerations allow Pods.

## Azure

- Resource Group organizes resources.
- Virtual Machine provides compute.
- SSH enables secure Linux login.
- SQL Database is fully managed.
- Storage Account stores Azure data.
- Blob Storage stores files.
- Static Website hosts HTML pages.
- NSG controls network traffic.
- Public Endpoint exposes services.
- LRS provides low-cost redundancy.

---

# Learning Outcome

After completing these topics, I understand:

## Kubernetes

- Ingress and NGINX
- Ingress Controller
- RBAC
- ServiceAccount
- Taints & Tolerations

## Microsoft Azure

- Resource Groups
- Virtual Machines
- SSH Authentication
- Network Security Groups
- Azure SQL Database
- Blob Storage
- Storage Accounts
- Static Website Hosting
- Public Endpoints
- Storage Redundancy

These concepts provide a solid foundation in Kubernetes administration and Microsoft Azure cloud services.