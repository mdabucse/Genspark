# Docker & Linux cgroups Notes

## Overview

This repository contains notes and commands for learning Docker and Linux cgroups.

---

# Docker Basics

## What is Docker?

Docker is a containerization platform that allows applications to run in isolated environments called **containers**.

### Benefits

* Consistent environment across development and production
* Lightweight compared to Virtual Machines
* Easy deployment and scaling
* Dependency isolation

---

## Important Docker Concepts

| Concept    | Description                         |
| ---------- | ----------------------------------- |
| Image      | Blueprint used to create containers |
| Container  | Running instance of an image        |
| Dockerfile | Instructions to build an image      |
| Volume     | Persistent storage                  |
| Network    | Communication between containers    |
| Registry   | Stores Docker images                |

---

# Docker Commands

## Pull an Image

```bash
docker pull nginx
```

## List Images

```bash
docker images
```

## Run a Container

```bash
docker run nginx
```

## Run in Detached Mode

```bash
docker run -d nginx
```

## List Running Containers

```bash
docker ps
```

## List All Containers

```bash
docker ps -a
```

## Stop a Container

```bash
docker stop <container_id>
```

## Remove a Container

```bash
docker rm <container_id>
```

## Remove an Image

```bash
docker rmi <image_id>
```

---

# PostgreSQL Container Example

```bash
docker run -d \
--name pg \
-e POSTGRES_PASSWORD=Training123 \
-e POSTGRES_USER=postgres \
-e POSTGRES_DB=traindb \
-p 5432:5432 \
postgres:16
```

---

## Command Breakdown

### Run in Background

```bash
-d
```

Runs the container in detached mode.

---

### Container Name

```bash
--name pg
```

Assigns the container name `pg`.

---

### Environment Variables

```bash
-e POSTGRES_PASSWORD=Training123
-e POSTGRES_USER=postgres
-e POSTGRES_DB=traindb
```

The `-e` flag sets environment variables inside the container.

| Variable          | Purpose                                |
| ----------------- | -------------------------------------- |
| POSTGRES_PASSWORD | Password for PostgreSQL user           |
| POSTGRES_USER     | Database username                      |
| POSTGRES_DB       | Database created during initialization |

---

### Port Mapping

```bash
-p 5432:5432
```

Maps:

```text
Host Port      -> Container Port
5432           -> 5432
```

Allows local applications to connect to PostgreSQL.

---

# Docker Environment Variables

## Example

```bash
docker run -e APP_ENV=production myapp
```

Inside the container:

```bash
echo $APP_ENV
```

Output:

```text
production
```

---

## View Environment Variables

```bash
docker exec -it pg env
```

or

```bash
docker exec -it pg printenv
```

---

# Linux cgroups

## What are cgroups?

cgroups (Control Groups) are a Linux kernel feature used to:

* Limit resource usage
* Monitor resource consumption
* Isolate groups of processes

---

## Resources Controlled

* CPU
* Memory
* Disk I/O
* Network
* Process Count

---

## Why cgroups?

Without cgroups:

```text
One process can consume all CPU and Memory
```

With cgroups:

```text
Resource limits can be enforced
```

---

# cgroups and Containers

Containers use:

## Namespaces

Provide isolation.

Examples:

* PID namespace
* Network namespace
* Mount namespace
* User namespace

### Think

```text
Namespaces = What a process can see
```

---

## cgroups

Provide resource control.

Examples:

* CPU limits
* Memory limits
* Process limits

### Think

```text
cgroups = How much a process can use
```

---

# cgroup v1 vs cgroup v2

## cgroup v1

* Separate hierarchy for each resource
* Older architecture
* More complex

## cgroup v2

* Unified hierarchy
* Simpler management
* Better resource control

---

## Check cgroup Version

```bash
stat -fc %T /sys/fs/cgroup
```

Output:

```text
cgroup2fs
```

means:

```text
cgroup v2
```

---

# View cgroup Files

```bash
ls /sys/fs/cgroup
```

Common files:

```text
cpu.max
memory.max
memory.current
io.max
pids.max
cgroup.procs
```

---

# Create a cgroup

```bash
sudo mkdir /sys/fs/cgroup/mygroup
```

---

# Set Memory Limit

```bash
echo 500M | sudo tee /sys/fs/cgroup/mygroup/memory.max
```

Limits memory to:

```text
500 MB
```

---

# Move Process into cgroup

```bash
echo <PID> | sudo tee /sys/fs/cgroup/mygroup/cgroup.procs
```

---

# Set CPU Limit

```bash
echo "50000 100000" | sudo tee /sys/fs/cgroup/mygroup/cpu.max
```

Meaning:

```text
quota  = 50000 microseconds
period = 100000 microseconds
```

CPU Usage:

```text
50%
```

---

# Important cgroup Files

| File           | Description                  |
| -------------- | ---------------------------- |
| cpu.max        | CPU limit                    |
| memory.max     | Memory limit                 |
| memory.current | Current memory usage         |
| io.max         | Disk I/O limit               |
| pids.max       | Maximum number of processes  |
| cgroup.procs   | Processes assigned to cgroup |

---

# Docker + Linux Kernel Technologies

Docker containers are built primarily using:

## Namespaces

Isolation

```text
Processes
Network
Users
Filesystems
```

## cgroups

Resource Management

```text
CPU
Memory
Disk I/O
Process Count
```

Together:

```text
Namespaces + cgroups = Containers
```

---

# Quick Revision

## Docker

```text
Image      -> Blueprint
Container  -> Running Image
Dockerfile -> Build Instructions
Volume     -> Persistent Storage
```

## Linux

```text
Namespaces -> Isolation
cgroups    -> Resource Control
```

## Docker Run Example

```bash
docker run -d \
--name pg \
-e POSTGRES_PASSWORD=Training123 \
-e POSTGRES_USER=postgres \
-e POSTGRES_DB=traindb \
-p 5432:5432 \
postgres:16
```

## Important

```text
-e  -> Environment Variable
-p  -> Port Mapping
-d  -> Detached Mode
```
