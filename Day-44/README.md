# Day 44 - Kubernetes Fundamentals

## Overview

In this session, we explored the core concepts of Kubernetes and gained hands-on experience with creating and managing clusters, Pods, ReplicaSets, Deployments, and Services. We also learned how Kubernetes maintains the desired state of applications through self-healing and scaling mechanisms.

---

## Concepts Covered

### 1. Kubernetes Architecture

Learned the fundamental components of a Kubernetes cluster:

- Control Plane
- Worker Nodes
- API Server
- etcd
- Scheduler
- Controller Manager
- Kubelet
- kube-proxy

### 2. Kubernetes Terminology

Studied the purpose and usage of:

- Cluster
- Node
- Pod
- Container
- Deployment
- ReplicaSet
- Service
- Namespace
- ConfigMap
- Secret
- Ingress
- Volume

### 3. etcd

Understood the role of etcd as Kubernetes' distributed key-value store.

Responsibilities:

- Stores cluster state
- Stores configuration data
- Stores information about Pods, Services, Deployments, and Nodes

### 4. Kind (Kubernetes IN Docker)

Learned how Kind helps create local Kubernetes clusters using Docker containers as nodes.

Topics covered:

- Installing Kind
- Creating clusters
- Managing multiple clusters
- Viewing available clusters
- Switching between clusters

Commands:

```bash
kind create cluster --name demo
kind get clusters
kind delete cluster --name demo
```

---

## Kubernetes Contexts and Cluster Management

Learned how kubectl interacts with clusters through contexts.

Commands used:

```bash
kubectl config get-contexts
kubectl config current-context
kubectl config use-context <context-name>
```

Key Learning:

- The active context determines which cluster receives kubectl commands.
- Resources are created only in the currently selected cluster.

---

## Pods

Created and managed Kubernetes Pods.

Commands used:

```bash
kubectl apply -f pod.yaml
kubectl get pods
kubectl describe pod <pod-name>
kubectl delete pod <pod-name>
```

Topics covered:

- Pod lifecycle
- Pod IP addresses
- Pod deletion and recreation
- Pod status inspection

---

## Self-Healing

Observed Kubernetes self-healing behavior.

Scenario:

- Deleted a Pod manually.
- ReplicaSet automatically recreated a new Pod.
- Kubernetes maintained the desired state without manual intervention.

Key Learning:

Kubernetes continuously compares the desired state with the actual state and takes corrective actions when differences are detected.

---

## ReplicaSets

Learned how ReplicaSets maintain a fixed number of Pod replicas.

Topics covered:

- ReplicaSet architecture
- Desired vs Current replicas
- Label selectors
- MatchLabels
- Pod template configuration

Example:

```yaml
selector:
  matchLabels:
    project: calculator
```

Key Learning:

ReplicaSets ensure that the desired number of identical Pods are always running.

---

## Scaling Applications

Learned how to increase and decrease the number of replicas.

Command used:

```bash
kubectl scale deployment <deployment-name> --replicas=5
```

Concepts covered:

- Horizontal scaling
- Desired state management
- Automatic Pod creation

---

## Deployments

Learned how Deployments manage ReplicaSets and Pods.

Responsibilities:

- Pod management
- ReplicaSet management
- Rolling updates
- Rollbacks
- Self-healing

Commands used:

```bash
kubectl get deployments
kubectl describe deployment <deployment-name>
```

---

## Services

Learned how Services provide stable network access to Pods.

Concepts covered:

- ClusterIP
- TargetPort
- Service selectors
- Pod-to-Service communication

Example:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres
spec:
  selector:
    app: postgres
```

Key Learning:

Services provide a stable endpoint even when Pod IP addresses change.

---

## PostgreSQL Deployment

Created a PostgreSQL Deployment and Service.

Topics covered:

- Environment variables
- Container images
- Port configuration
- Database initialization
- Service exposure

Environment Variables:

```yaml
POSTGRES_DB
POSTGRES_USER
POSTGRES_PASSWORD
```

---

## Troubleshooting Kubernetes

Diagnosed and resolved common Kubernetes issues.

### Context Not Set

Error:

```text
The connection to the server localhost:8080 was refused
```

Resolution:

- Created a Kubernetes cluster.
- Configured kubectl context.

### ReplicaSet Selector Error

Error:

```text
unknown field "spec.selector.project"
```

Resolution:

```yaml
selector:
  matchLabels:
    project: calculator
```

### Image Pull Errors

Errors encountered:

```text
ErrImagePull
ImagePullBackOff
```

Learned how to investigate using:

```bash
kubectl describe pod <pod-name>
```

---

## Useful Commands Practiced

### Cluster Commands

```bash
kind get clusters
kubectl config get-contexts
kubectl config current-context
kubectl config use-context <context-name>
```

### Pod Commands

```bash
kubectl get pods
kubectl get pods -o wide
kubectl describe pod <pod-name>
kubectl delete pod <pod-name>
```

### Deployment Commands

```bash
kubectl get deployments
kubectl describe deployment <deployment-name>
kubectl scale deployment <deployment-name> --replicas=5
```

### ReplicaSet Commands

```bash
kubectl get rs
kubectl describe rs <replicaset-name>
```

### Service Commands

```bash
kubectl get svc
kubectl describe svc <service-name>
```

### General Commands

```bash
kubectl get all
kubectl apply -f <manifest-file>
kubectl delete -f <manifest-file>
```

---

## Key Takeaways

- Kubernetes manages containerized applications through declarative configuration.
- Pods are the smallest deployable units in Kubernetes.
- ReplicaSets ensure the desired number of Pods remain running.
- Deployments provide higher-level management over ReplicaSets and Pods.
- Services provide stable networking for applications.
- Self-healing automatically restores failed workloads.
- Scaling allows applications to handle increased demand.
- Contexts determine which cluster receives kubectl commands.
- Kind provides a lightweight local Kubernetes environment using Docker.
- Troubleshooting often starts with `kubectl describe` and resource inspection commands.

---

## Outcome

By the end of this session, I was able to:

- Create and manage Kubernetes clusters using Kind.
- Switch between multiple Kubernetes clusters.
- Deploy applications using Kubernetes manifests.
- Work with Pods, ReplicaSets, Deployments, and Services.
- Scale applications horizontally.
- Understand Kubernetes self-healing behavior.
- Deploy a PostgreSQL workload.
- Diagnose and resolve common Kubernetes deployment issues.
- Use kubectl effectively for cluster administration and troubleshooting.