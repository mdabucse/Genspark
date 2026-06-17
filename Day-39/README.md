# Docker Networking 

## Objective

This lab demonstrates how to connect a .NET Web API container to a PostgreSQL container using Docker Networking.

### Learning Objectives

* Understand Docker Networking
* Create Docker Networks
* Run PostgreSQL Containers
* Run .NET Web API Containers
* Connect API to PostgreSQL using Container Names
* Verify Database Connectivity
* Troubleshoot Networking Issues

---

# What is Docker Networking?

Docker Networking enables communication between:

* Containers
* Containers and the Host Machine
* Containers and External Networks

Docker creates isolated environments while allowing containers to communicate securely through networks.

---

# Architecture

```text
                 Docker Network
              training-network
                     |
      --------------------------------
      |                              |
      |                              |
Customer API                  PostgreSQL
(.NET Web API)               Database
      |                              |
      ---------> postgres-db ---------
                 Port 5432
```

---

# Docker Network Types

## Bridge Network

The default network driver used by Docker.

Features:

* Containers can communicate with each other.
* Each container receives its own IP address.
* Most commonly used network type.

## Host Network

The container shares the host machine's network.

Features:

* No network isolation.
* Better performance.
* Primarily used on Linux.

## None Network

Disables networking completely.

Features:

* No inbound or outbound communication.
* Useful for isolated workloads.

## Overlay Network

Used in Docker Swarm.

Features:

* Enables communication between containers across multiple hosts.

---

# Step 1 - Create Docker Network

Create a user-defined bridge network.

```bash
docker network create training-network
```

Verify:

```bash
docker network ls
```

---

# Step 2 - Run PostgreSQL Container

```bash
docker run -d \
--name postgres-db \
--network training-network \
-e POSTGRES_USER=postgres \
-e POSTGRES_PASSWORD=postgres \
-e POSTGRES_DB=customerdb \
postgres:16
```

### Command Breakdown

| Option            | Description                           |
| ----------------- | ------------------------------------- |
| -d                | Run container in detached mode        |
| --name            | Assign a container name               |
| --network         | Connect container to a Docker network |
| POSTGRES_USER     | PostgreSQL username                   |
| POSTGRES_PASSWORD | PostgreSQL password                   |
| POSTGRES_DB       | Database name                         |

---

# Step 3 - Create .NET Web API

```bash
dotnet new webapi -n CustomerApi
```

Move into project folder:

```bash
cd CustomerApi
```

---

# Step 4 - Install PostgreSQL Driver

```bash
dotnet add package Npgsql
```

## What is Npgsql?

Npgsql is the official PostgreSQL driver for .NET applications.

It allows:

* Connecting to PostgreSQL
* Executing SQL queries
* Reading data
* Writing data

---

# Step 5 - Configure Connection String

```text
Host=postgres-db;
Port=5432;
Database=customerdb;
Username=postgres;
Password=postgres
```

## Important Concept

Inside Docker:

```text
localhost
```

refers to the current container itself.

To connect to another container, use:

```text
postgres-db
```

because Docker provides internal DNS resolution.

---

# Step 6 - Build Docker Image

```bash
docker build -t customer-api:1.0 .
```

### Command Breakdown

| Option           | Description            |
| ---------------- | ---------------------- |
| docker build     | Builds an image        |
| -t               | Assigns a tag          |
| customer-api:1.0 | Image name and version |

---

# Step 7 - Run API Container

```bash
docker run -d \
--name customer-api \
--network training-network \
-p 8080:8080 \
customer-api:1.0
```

### Command Breakdown

| Option    | Description    |
| --------- | -------------- |
| -d        | Detached mode  |
| --name    | Container name |
| --network | Docker network |
| -p        | Port mapping   |

---

# Step 8 - Verify Network

Inspect the network:

```bash
docker network inspect training-network
```

Expected Output:

```text
Containers:
    postgres-db
    customer-api
```

Both containers should be connected to the same network.

---

# Database Connectivity Test

Create Table:

```sql
CREATE TABLE customers(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);
```

Insert Data:

```sql
INSERT INTO customers(name)
VALUES ('Abubakkar');
```

Read Data:

```sql
SELECT * FROM customers;
```

Expected Result:

```text
 id |    name
----+------------
  1 | Abubakkar
```

This confirms that the application is communicating successfully with PostgreSQL.

---

# Useful Docker Commands

## List Running Containers

```bash
docker ps
```

---

## List Images

```bash
docker images
```

---

## List Networks

```bash
docker network ls
```

---

## Inspect Network

```bash
docker network inspect training-network
```

---

## View Container Logs

```bash
docker logs postgres-db
```

```bash
docker logs customer-api
```

---

## Execute Commands Inside Container

```bash
docker exec -it customer-api bash
```

---

## Access PostgreSQL

```bash
docker exec -it postgres-db psql -U postgres -d customerdb
```

---

## Stop Container

```bash
docker stop customer-api
```

---

## Remove Container

```bash
docker rm -f customer-api
```

---

## Remove Network

```bash
docker network rm training-network
```

---

# Key Concepts Learned

## Docker Network

A virtual network that allows containers to communicate securely.

## Bridge Network

A network driver that enables communication between containers on the same host.

## Container Name Resolution

Docker automatically resolves container names to IP addresses.

Example:

```text
postgres-db
```

instead of:

```text
172.18.0.5
```

## Port Mapping

Syntax:

```bash
-p HOST_PORT:CONTAINER_PORT
```

Example:

```bash
-p 8080:8080
```

Allows services running inside containers to be accessed from the host machine.

## Docker DNS

Docker provides built-in DNS for containers connected to the same network.

Example:

```text
customer-api
      |
      |
postgres-db
```

No need to use IP addresses manually.

---

# Golden Rule

Inside Docker, do not use:

```text
localhost
```

to connect to another container.

Always use:

```text
Container Name
```

Example:

```text
postgres-db
```

This is the standard approach for container-to-container communication.

---

# Conclusion

In this lab, we:

* Created a Docker Network
* Deployed PostgreSQL in Docker
* Built a .NET Web API
* Connected the API to PostgreSQL
* Used Docker DNS for container communication
* Verified database connectivity
* Learned essential Docker networking concepts

This setup forms the foundation for building containerized microservices and production-ready applications using Docker.
