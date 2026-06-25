# Day 45 — Kubernetes: 3-Tier Application Deployment & Persistent Storage

## Overview

This day focused on deploying a complete **3-tier application** (Frontend → API → Database) on Kubernetes using **KIND (Kubernetes IN Docker)**, covering core Kubernetes concepts including Deployments, Services, Ingress, ConfigMaps, Secrets, and Persistent Storage.

---

## Key Concepts Learned

### 1. Kubernetes Architecture

Kubernetes is a container orchestration platform that automates deployment, scaling, and management of containerized applications. The core components include:

| Component | Role |
|-----------|------|
| **Pod** | The smallest deployable unit — wraps one or more containers |
| **Deployment** | Manages a ReplicaSet, ensures desired number of Pods are always running |
| **Service** | Provides stable networking (DNS name + ClusterIP) to access Pods |
| **Ingress** | Routes external HTTP traffic to internal Services based on path rules |
| **ConfigMap** | Stores non-sensitive configuration data as key-value pairs |
| **Secret** | Stores sensitive data (passwords, tokens) in a base64-encoded format |
| **PersistentVolumeClaim** | Requests durable storage that survives Pod restarts |

### 2. KIND (Kubernetes IN Docker)

KIND runs a full Kubernetes cluster inside Docker containers on your local machine. Key points:

- Cluster created with `kind create cluster --name demo`
- Images must be loaded into KIND's node: `kind load docker-image <image> --name demo`
- LoadBalancer services stay at `<pending>` — use `kubectl port-forward` to access
- Default StorageClass (`standard`) auto-provisions PersistentVolumes

### 3. Multi-Stage Docker Builds

Both the API and frontend used **multi-stage Docker builds** to produce lean production images:

- **Stage 1 (Build)**: Uses a full SDK/Node image to compile the application
- **Stage 2 (Runtime)**: Copies only the compiled output into a minimal runtime image
- This reduces the final image size dramatically (from GBs to MBs)

### 4. Kubernetes Networking Model

```
Browser → Ingress Controller → Ingress Rules → Service → Pod(s)
```

- **ClusterIP** (default): Internal-only access. Other pods reach it via DNS name (e.g., `postgres`, `api`)
- **Ingress**: Layer 7 HTTP routing — routes `/` to frontend, `/api/*` to the API backend
- **Port-Forward**: For local development, maps `localhost:<port>` to a cluster Service

### 5. ConfigMaps & Secrets

- **ConfigMap**: Injects non-sensitive config (DB host, port, database name) as environment variables using `envFrom`
- **Secret**: Stores the database password separately, referenced via `secretKeyRef` in the Pod spec
- This separation follows the **12-Factor App** methodology — config is external to the code

### 6. Health Probes

Kubernetes uses probes to monitor container health:

| Probe | Purpose |
|-------|---------|
| **Liveness Probe** | Restarts the container if it becomes unresponsive |
| **Readiness Probe** | Removes the Pod from Service endpoints until it's ready to accept traffic |

### 7. PersistentVolume & PersistentVolumeClaim (PV/PVC)

- **PersistentVolume (PV)**: A piece of real storage in the cluster, independent of any Pod's lifecycle
- **PersistentVolumeClaim (PVC)**: A request for storage made by a Pod (e.g., "I need 1Gi")
- Kubernetes **matches claims to volumes** — if the Pod is deleted and recreated, the new Pod binds to the same volume
- `ReadWriteOnce` access mode means the volume can be mounted read-write by a single node at a time
- Setting `PGDATA` to a subfolder (`/var/lib/postgresql/data/pgdata`) avoids conflicts with `lost+found`

---

## Project Structure

```
Day-45/
├── README.md
├── Task-1/                          # Backend API + Database (Lab 2)
│   ├── Docs                         # Lab documentation
│   └── MyApi/
│       ├── Program.cs               # .NET API with /health, /db-check, /config endpoints
│       ├── MyApi.csproj              # Project file with Npgsql dependency
│       ├── Dockerfile               # Multi-stage build (SDK → ASP.NET runtime)
│       └── manifest/
│           ├── 02-secret.yaml       # Kubernetes Secret (DB_PASSWORD)
│           ├── 02-configmap.yaml    # ConfigMap (DB_HOST, DB_PORT, DB_NAME, etc.)
│           ├── 02-postgres.yaml     # PostgreSQL Deployment + Service
│           └── 02-api.yaml          # API Deployment + Service (with probes & resources)
│
└── Task-2/                          # Frontend + Ingress + Persistent Storage (Lab 3)
    └── my-angular-app/
        ├── src/app/app.ts           # Angular component — calls /api/db-check
        ├── Dockerfile               # Multi-stage build (Node → Nginx)
        ├── nginx.conf               # SPA routing with try_files
        ├── 03-frontend.yaml         # Frontend Deployment (2 replicas) + Service
        ├── 03-frontend-ingress.yaml # Ingress: / → frontend:80
        ├── 03-api-ingress.yaml      # Ingress: /api/* → api:8080 (with rewrite)
        ├── 03-postgres-pvc.yaml     # PersistentVolumeClaim (1Gi, ReadWriteOnce)
        └── 03-postgres-with-storage.yaml  # Updated Postgres with volume mounts
```

---

## Task 1 — Backend API + Database on Kubernetes

### What Was Built

A **.NET API** that connects to a **PostgreSQL** database, both running as Kubernetes Deployments.

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /` | Returns API status and version |
| `GET /health` | Health check endpoint |
| `GET /db-check` | Tests the PostgreSQL connection, returns DB version |
| `GET /config` | Shows the current configuration (env vars) |

### Kubernetes Resources Created

```bash
# 1. Create the Secret (stores DB password)
kubectl apply -f manifest/02-secret.yaml

# 2. Create the ConfigMap (stores DB host, port, name, user)
kubectl apply -f manifest/02-configmap.yaml

# 3. Deploy PostgreSQL
kubectl apply -f manifest/02-postgres.yaml

# 4. Build and load the API image into KIND
docker build -t myapi:latest .
kind load docker-image myapi:latest --name demo

# 5. Deploy the API
kubectl apply -f manifest/02-api.yaml
```

### Key Concepts Applied

- **ConfigMap** (`app-config`): Injected via `envFrom` — all keys become environment variables in the API container
- **Secret** (`postgres-secret`): `DB_PASSWORD` referenced via `secretKeyRef` — keeps sensitive data separate
- **Service DNS**: The API reaches PostgreSQL via the service name `postgres` (Kubernetes DNS resolves `postgres` → `10.96.x.x`)
- **Liveness/Readiness Probes**: API has both probes hitting `/` on port 8080
- **Resource Limits**: CPU and memory requests/limits set to prevent resource starvation

---

## Task 2 — Frontend + Ingress + Persistent Storage

### What Was Built

An **Angular frontend** served by Nginx, exposed through Kubernetes **Ingress** alongside the API, with **persistent storage** for PostgreSQL.

### Angular App

The frontend is a simple Kubernetes 3-Tier Demo that:
- Displays a "Check Database Connection" button
- Calls `GET /api/db-check` through the Ingress
- Shows the PostgreSQL connection result

### Multi-Stage Docker Build

```dockerfile
# Stage 1: Build Angular with Node.js
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve static files with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/my-angular-app/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### Nginx Configuration

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;  # SPA fallback routing
    }
}
```

The `try_files` directive is crucial for Angular SPAs — it ensures that all routes (e.g., `/dashboard`, `/settings`) serve `index.html` instead of returning 404, letting Angular's client-side router handle them.

### Kubernetes Resources Created

```bash
# 1. Build and load the frontend image
docker build -t myangularapp:latest .
kind load docker-image myangularapp:latest --name demo

# 2. Deploy frontend (2 replicas) + ClusterIP Service
kubectl apply -f 03-frontend.yaml

# 3. Install NGINX Ingress Controller (for KIND)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

# 4. Create Ingress rules
kubectl apply -f 03-frontend-ingress.yaml    # / → frontend
kubectl apply -f 03-api-ingress.yaml          # /api/* → api (with rewrite)

# 5. Access via port-forward (KIND doesn't support LoadBalancer)
kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8080:80
# Open http://localhost:8080 in browser
```

### Ingress Routing

| Path | Ingress | Backend Service | Port |
|------|---------|-----------------|------|
| `/` | `frontend-ingress` | `frontend` | 80 |
| `/api/*` | `api-ingress` | `api` | 8080 |

The **API Ingress** uses a rewrite annotation:
```yaml
annotations:
  nginx.ingress.kubernetes.io/rewrite-target: /$2
```
This strips the `/api` prefix before forwarding. So `/api/db-check` becomes `/db-check` when it hits the API pod.

---

## 🔧 Part F — Persistent Storage for PostgreSQL

### Problem

Without persistent storage, deleting a PostgreSQL Pod loses all data. The replacement Pod gets a completely empty filesystem.

### Solution

1. **PersistentVolumeClaim** — Requests 1Gi of storage
2. **Updated Deployment** — Mounts the PVC into the container at `/var/lib/postgresql/data`

```bash
# Create PVC
kubectl apply -f 03-postgres-pvc.yaml

# Apply updated deployment with volume mounts
kubectl apply -f 03-postgres-with-storage.yaml

# Verify PVC is Bound
kubectl get pvc
# NAME           STATUS   VOLUME        CAPACITY   ACCESS MODES   AGE
# postgres-pvc   Bound    pvc-99fd...   1Gi        RWO            10s
```

### Data Persistence Proof

```bash
# 1. Connect to PostgreSQL and insert test data
kubectl exec -it <postgres-pod> -- psql -U appuser -d appdb
CREATE TABLE proof (id SERIAL PRIMARY KEY, note TEXT);
INSERT INTO proof (note) VALUES ('data survived a pod restart');
\q

# 2. Delete the pod
kubectl delete pod <postgres-pod>

# 3. Wait for new pod, then verify data still exists
kubectl exec -it <new-postgres-pod> -- psql -U appuser -d appdb -c "SELECT * FROM proof;"
#  id |            note
# ----+-----------------------------
#   1 | data survived a pod restart
# (1 row)
```

✅ **Data survived the pod deletion!** The PVC retained the data and the new Pod mounted the same volume.

### Why PGDATA Points to a Subfolder

```yaml
env:
  - name: PGDATA
    value: /var/lib/postgresql/data/pgdata
```

Some storage drivers create a `lost+found` directory in the volume root. PostgreSQL requires an empty directory to initialize. Pointing `PGDATA` to a subfolder (`pgdata`) inside the mount avoids this conflict.

---

## 📝 Key Commands Reference

| Command | Description |
|---------|-------------|
| `kind create cluster --name demo` | Create a KIND cluster |
| `kind load docker-image <img> --name demo` | Load a local Docker image into KIND |
| `kubectl apply -f <file.yaml>` | Apply a Kubernetes manifest |
| `kubectl get pods` | List all pods |
| `kubectl get svc` | List all services |
| `kubectl get ingress` | List all ingress rules |
| `kubectl get pvc` | List PersistentVolumeClaims |
| `kubectl describe pod <name>` | Detailed info about a pod |
| `kubectl logs <pod-name>` | View pod logs |
| `kubectl exec -it <pod> -- <cmd>` | Execute a command inside a pod |
| `kubectl delete pod <name>` | Delete a pod (Deployment recreates it) |
| `kubectl port-forward svc/<name> <local>:<remote>` | Forward a local port to a cluster service |
| `kubectl get pods --watch` | Watch pods in real-time |

---

## Architecture Diagram

```
                    ┌──────────────────────────────────────┐
                    │         KIND Cluster (demo)           │
                    │                                      │
  localhost:8080    │   ┌──────────────────────────────┐   │
 ───────────────────┼──►│   Ingress Controller (nginx)  │   │
                    │   └──────────┬───────────────────┘   │
                    │              │                        │
                    │    ┌─────────┴──────────┐             │
                    │    │                    │             │
                    │    ▼ path: /            ▼ path: /api  │
                    │  ┌────────────┐   ┌────────────┐     │
                    │  │  frontend  │   │    api      │     │
                    │  │  Service   │   │  Service    │     │
                    │  │  :80       │   │  :8080      │     │
                    │  └─────┬──────┘   └─────┬──────┘     │
                    │        │                │             │
                    │   ┌────┴────┐      ┌────┴────┐       │
                    │   │ Pod (1) │      │  Pod    │       │
                    │   │ Pod (2) │      │ (.NET)  │       │
                    │   │ (nginx) │      └────┬────┘       │
                    │   └─────────┘           │             │
                    │                    ┌────┴────┐        │
                    │                    │postgres │        │
                    │                    │ Service │        │
                    │                    │ :5432   │        │
                    │                    └────┬────┘        │
                    │                    ┌────┴────┐        │
                    │                    │  Pod    │        │
                    │                    │(pg:16)  │        │
                    │                    │ + PVC   │        │
                    │                    └─────────┘        │
                    └──────────────────────────────────────┘
```

---

## Key Takeaways

1. **Pods are ephemeral** — never store important data in a Pod's filesystem without a PVC
2. **Services provide stable DNS** — Pods can communicate using service names (e.g., `postgres`) instead of IP addresses
3. **Ingress consolidates routing** — one entrypoint for both frontend and API, avoiding CORS issues
4. **ConfigMaps and Secrets separate config from code** — following 12-Factor App principles
5. **Multi-stage Docker builds** produce minimal images — only runtime dependencies are included
6. **Health probes enable self-healing** — Kubernetes automatically restarts unhealthy containers
7. **PVCs decouple storage from Pods** — data persists across pod deletions and restarts
8. **KIND requires port-forwarding** — unlike cloud providers, KIND doesn't support LoadBalancer EXTERNAL-IPs natively
