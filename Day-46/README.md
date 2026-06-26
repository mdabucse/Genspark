# Kubernetes: Deployment, Service, ConfigMap & DaemonSet

## Overview
I learned how Kubernetes manages applications using Deployments, Services, ConfigMaps, and DaemonSets. I explored how Deployments create and maintain Pods, how Services expose applications, how ConfigMaps inject configuration into containers, and how DaemonSets ensure a Pod runs on every node.

---

## Concepts Covered

### 1. Deployment
- What is a Deployment
- Deployment architecture
- ReplicaSet relationship
- Pod template
- Rolling Update strategy
- Scaling applications
- Self-healing capability
- Updating container images

### 2. ReplicaSet
- Purpose of ReplicaSet
- Maintaining desired replicas
- Automatic Pod recreation
- Relationship with Deployment

### 3. Service
- Purpose of Services
- ClusterIP
- NodePort
- Service selectors
- Service ports
- TargetPort
- NodePort
- Service Endpoints

### 4. NodePort
- Exposing applications outside the cluster
- NodePort range (30000–32767)
- Traffic flow:
  Client → NodePort → Service → Pod
- Difference between `port`, `targetPort`, and `nodePort`

### 5. ConfigMap
- Creating ConfigMaps
- Injecting environment variables
- Using `envFrom`
- Verifying ConfigMap values inside Pods

### 6. DaemonSet
- Purpose of DaemonSet
- One Pod per Node
- Automatic scheduling on new nodes
- Common use cases:
  - Log collection
  - Monitoring
  - Networking
  - Security agents

### 7. Kubernetes Networking
- Pod IPs
- Service IPs
- Endpoints
- Label selectors
- Service discovery

### 8. Debugging Kubernetes Applications
- Inspecting Pods
- Checking logs
- Viewing endpoints
- Port forwarding
- Executing commands inside containers

---

# YAML Resources Created

- Deployment
- NodePort Service
- ConfigMap
- DaemonSet

---

# Commands Practiced

## Deployment

Create Deployment

```bash
kubectl apply -f deployment.yaml
```

View Deployments

```bash
kubectl get deployments
```

Describe Deployment

```bash
kubectl describe deployment <deployment-name>
```

Scale Deployment

```bash
kubectl scale deployment <deployment-name> --replicas=5
```

Delete Deployment

```bash
kubectl delete deployment <deployment-name>
```

---

## ReplicaSet

View ReplicaSets

```bash
kubectl get replicasets
```

Describe ReplicaSet

```bash
kubectl describe replicaset <replicaset-name>
```

Delete ReplicaSet

```bash
kubectl delete replicaset <replicaset-name>
```

---

## Pods

View Pods

```bash
kubectl get pods
```

View Pods with Node Information

```bash
kubectl get pods -o wide
```

Describe Pod

```bash
kubectl describe pod <pod-name>
```

Delete Pod

```bash
kubectl delete pod <pod-name>
```

View Pod Logs

```bash
kubectl logs <pod-name>
```

Execute Commands Inside Pod

```bash
kubectl exec -it <pod-name> -- sh
```

View Environment Variables

```bash
kubectl exec -it <pod-name> -- printenv
```

View Specific Environment Variable

```bash
kubectl exec -it <pod-name> -- printenv <VARIABLE_NAME>
```

---

## Services

Create Service

```bash
kubectl apply -f service.yaml
```

View Services

```bash
kubectl get svc
```

Describe Service

```bash
kubectl describe svc <service-name>
```

Delete Service

```bash
kubectl delete svc <service-name>
```

View Endpoints

```bash
kubectl get endpoints
```

---

## Port Forwarding

Forward Service Port

```bash
kubectl port-forward service/<service-name> 8080:80
```

Forward Pod Port

```bash
kubectl port-forward pod/<pod-name> 8080:1090
```

---

## ConfigMap

Create ConfigMap

```bash
kubectl apply -f configmap.yaml
```

View ConfigMaps

```bash
kubectl get configmaps
```

Describe ConfigMap

```bash
kubectl describe configmap <configmap-name>
```

View ConfigMap YAML

```bash
kubectl get configmap <configmap-name> -o yaml
```

Delete ConfigMap

```bash
kubectl delete configmap <configmap-name>
```

---

## DaemonSet

Create DaemonSet

```bash
kubectl apply -f daemonset.yaml
```

View DaemonSets

```bash
kubectl get daemonsets
```

Describe DaemonSet

```bash
kubectl describe daemonset <daemonset-name>
```

Delete DaemonSet

```bash
kubectl delete daemonset <daemonset-name>
```

---

## General Cluster Commands

View All Resources

```bash
kubectl get all
```

View Nodes

```bash
kubectl get nodes
```

Describe Node

```bash
kubectl describe node <node-name>
```

Delete All Resources

```bash
kubectl delete all --all
```

---

# Key Learnings

- Understood how Deployments manage ReplicaSets and Pods.
- Learned the self-healing and auto-scaling behavior of Deployments.
- Explored NodePort Services and Kubernetes networking.
- Learned the difference between `port`, `targetPort`, and `nodePort`.
- Used ConfigMaps to inject environment variables into containers.
- Verified environment variables inside running Pods.
- Understood how DaemonSets ensure one Pod runs on every node.
- Practiced debugging applications using logs, endpoints, port forwarding, and `kubectl exec`.
- Learned how Services route traffic to Pods using label selectors.

---

# Folder Structure

```
Day-46/
│── 01-postgres.yaml
│── 02-pod.yaml
│── 03-replicaset.yaml
│── 04-deployment.yaml
│── 05-configmap.yaml
│── 06-daemonset.yaml
└── README.md
```