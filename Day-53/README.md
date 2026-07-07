# ASP.NET Core → Docker → Azure Kubernetes Service (AKS) → Azure DevOps CI/CD

## Overview

This project demonstrates the complete deployment lifecycle of an ASP.NET Core Web API using Docker containers, Azure Container Registry (ACR), Azure Kubernetes Service (AKS), and Azure DevOps CI/CD pipelines.

The objective was to build a cloud-native application and automate its deployment to Kubernetes using Azure DevOps.

---

# Technologies Used

- ASP.NET Core Web API (.NET 10)
- Docker
- Azure Container Registry (ACR)
- Azure Kubernetes Service (AKS)
- Kubernetes
- Azure CLI
- kubectl
- Azure DevOps
- Azure Pipelines (CI/CD)
- Git

---

# 📚 Learning Outcomes

## 1. ASP.NET Core Web API

- Created a Minimal ASP.NET Core Web API.
- Built and tested the application locally.
- Learned the project structure of ASP.NET Core applications.
- Verified API endpoints using the browser and curl.

---

## 2. Docker

- Understood Docker containerization.
- Created a multi-stage Dockerfile.
- Used `.dockerignore` to optimize image builds.
- Built Docker images.
- Ran and tested containers locally.
- Exposed container ports.

### Commands Learned

```bash
docker build
docker run
docker ps
docker images
docker stop
docker rm
docker tag
docker push
```

---

## 3. Azure Resource Management

Created Azure cloud infrastructure using Azure CLI.

Resources created:

- Resource Group
- Azure Container Registry (ACR)
- Azure Kubernetes Service (AKS)

### Azure CLI Commands

```bash
az login
az group create
az acr create
az aks create
az aks get-credentials
az acr login
```

---

## 4. Azure Container Registry (ACR)

Learned how to:

- Create a private container registry.
- Authenticate Docker with Azure.
- Push Docker images.
- Manage image repositories.
- Enable Admin User for authentication.

Commands used:

```bash
az acr login
docker tag
docker push
az acr credential show
```

---

## 5. Azure Kubernetes Service (AKS)

Learned how to:

- Create an AKS Cluster.
- Connect kubectl with AKS.
- Verify Kubernetes nodes.
- Deploy workloads.
- Expose services using LoadBalancer.

Commands:

```bash
kubectl get nodes
kubectl apply
kubectl get pods
kubectl get svc
kubectl describe
```

---

## 6. Kubernetes

Created Kubernetes manifests.

### Deployment

Learned:

- Pods
- ReplicaSets
- Deployments
- Labels
- Selectors
- Container specifications
- ImagePullSecrets

### Service

Learned:

- ClusterIP
- LoadBalancer
- Port Mapping
- External IP Exposure

---

## 7. Kubernetes Secrets

Learned how to securely authenticate AKS with Azure Container Registry.

Created:

- Docker Registry Secret
- Image Pull Secret

Command:

```bash
kubectl create secret docker-registry
```

---

## 8. Application Deployment

Successfully deployed the ASP.NET Core application to Azure Kubernetes Service.

Verified:

- Running Pods
- Running Services
- External LoadBalancer
- Public API Endpoint

---

## 9. Azure DevOps

Learned:

- Azure Repos
- Git Integration
- Azure DevOps Project Structure
- Service Connections
- Azure Pipelines

---

## 10. CI/CD Pipeline

Configured Azure DevOps Pipeline to automate deployment.

Pipeline stages:

- Source Code
- Build
- Docker Image Creation
- Push to Azure Container Registry
- Deploy to Azure Kubernetes Service

---

# Project Structure

```text
DevOps/
│
├── Dockerfile
├── .dockerignore
├── Program.cs
├── DevOps.csproj
├── appsettings.json
├── azure-pipelines.yml
│
├── k8s/
│   ├── deployment.yaml
│   └── service.yaml
│
└── Properties/
```

---

#  Key Concepts Learned

- Cloud Native Applications
- Containerization
- Docker Images
- Docker Containers
- Multi-stage Docker Builds
- Azure Resource Groups
- Azure Container Registry
- Azure Kubernetes Service
- Kubernetes Deployments
- Kubernetes Services
- Load Balancer
- Pods
- ReplicaSets
- Image Pull Secrets
- Azure CLI
- kubectl
- Git
- Azure DevOps
- Azure Pipelines
- Continuous Integration
- Continuous Deployment (CI/CD)

---

# Deployment Workflow

```text
ASP.NET Core API
        │
        ▼
Build Docker Image
        │
        ▼
Push Image to Azure Container Registry
        │
        ▼
Create AKS Cluster
        │
        ▼
Deploy using Kubernetes Manifests
        │
        ▼
Expose using LoadBalancer
        │
        ▼
Access API through Public IP
        │
        ▼
Automate using Azure DevOps Pipeline
```

---

# Commands Practiced

### Docker

```bash
docker build
docker run
docker images
docker ps
docker stop
docker rm
docker tag
docker push
```

### Azure CLI

```bash
az login
az account show
az group create
az acr create
az acr login
az acr credential show
az aks create
az aks get-credentials
```

### Kubernetes

```bash
kubectl apply
kubectl get pods
kubectl get svc
kubectl get nodes
kubectl describe pod
kubectl create secret docker-registry
```

### Git

```bash
git init
git add
git commit
git push
git remote
```

---

# Skills Gained

- ASP.NET Core API Development
- Docker Containerization
- Azure Cloud Resource Management
- Kubernetes Orchestration
- Azure Container Registry Management
- AKS Deployment
- Kubernetes Networking
- Secret Management
- Azure DevOps
- CI/CD Pipeline Design
- Infrastructure Deployment
- Cloud Application Deployment

---

#  Outcome

Successfully developed, containerized, and deployed an ASP.NET Core Web API to Azure Kubernetes Service using Docker and Azure Container Registry. Connected the Kubernetes cluster with Azure DevOps to build a complete cloud-native deployment workflow and gained practical experience with containerization, orchestration, and CI/CD automation.