# Kubernetes : Advanced Deployments, Autoscaling & Storage

This lab focuses on validating persistent storage, setting up Horizontal Pod Autoscaling (HPA), and managing deployment lifecycles through rolling updates and rollbacks.

## Part A: Persistent Storage & Data Survival
- **Concept:** By using Persistent Volume Claims (PVCs), databases can survive pod crashes.
- **Action:** Created a PostgreSQL pod backed by a PVC, created a `proof` table with data, deleted the pod, and verified the data remained intact once the new pod was spun up by the ReplicaSet.

## Part B: Autoscaling Under Load (HPA)
- **Resource Requests are Mandatory:** The Horizontal Pod Autoscaler (HPA) calculates scaling based on a percentage of requested resources. Without `resources.requests.cpu` defined on the deployment, the HPA has no baseline and cannot make scaling decisions.
- **Metrics Server Configuration:** To allow the metrics server to gather data, the `--kubelet-insecure-tls` flag must be added to the `metrics-server` deployment args.
- **Testing Scale:**
  - Deployed an `api-hpa` targeting 50% CPU utilization.
  - Initial metrics might show `<unknown>/50%` as the metrics server requires 1-2 minutes to collect the first batch of metrics.
  - Used a `busybox` load generator pod with a continuous `wget` loop to drive CPU load above the 50% threshold, triggering the HPA to scale the deployment from 1 up to 5 replicas. Once the load stopped, the HPA smoothly scaled back down.

## Part C: Rolling Updates & Rollback
- **Concept:** Deployments manage both the number of replicas and the application version, gradually replacing old pods with new ones (rolling update) to ensure zero downtime.
- **Action:** 
  - Updated the API application code to `version: "2.0"` and built the new image (`myapi:2.0`).
  - Applied the new manifest, prompting a rolling update.
  - Explored rollout history using `kubectl rollout history deployment/api`.
  - Safely and instantly reverted back to the previous version (`myapi:latest`) using `kubectl rollout undo deployment/api` when a rollback was necessary. Validated the rollback via `kubectl rollout status` and checking the image configuration.
