# Docker Compose 

## Overview

This project demonstrates how to use Docker Compose to run an ASP.NET Core Web API and a PostgreSQL database as separate containers. Docker Compose simplifies the management of multi-container applications by defining all services in a single configuration file.

## Technologies Used

* Docker
* Docker Compose
* ASP.NET Core Web API
* PostgreSQL 16

## Project Structure

```text
.
├── CustomerApi/
│   ├── Dockerfile
│   └── Source Files
└── docker-compose.yml
```

## Docker Compose Configuration

### PostgreSQL Service

* Uses PostgreSQL 16 image.
* Creates a database named `customerdb`.
* Exposes port `5432`.
* Stores data using a Docker volume.
* Includes a health check to verify database availability.

### API Service

* Builds the ASP.NET Core application using the provided Dockerfile.
* Exposes port `8080`.
* Connects to PostgreSQL using a connection string.
* Starts only after the database becomes healthy.

## Networking

A custom bridge network (`backend-network`) is used to enable communication between the API and PostgreSQL containers.

## Persistent Storage

Docker volumes are used to persist PostgreSQL data even if the container is removed.

```yaml
volumes:
  postgres-data:
```

## Commands

### Validate Compose File

```bash
docker compose config
```

### Build and Start Services

```bash
docker compose up --build
```

### Run in Background

```bash
docker compose up -d
```

### View Running Containers

```bash
docker compose ps
```

### View Logs

```bash
docker compose logs -f
```

### Stop Services

```bash
docker compose down
```

### Remove Services and Volumes

```bash
docker compose down -v
```

## Learning Outcomes

* Understood the fundamentals of Docker Compose.
* Configured multiple services using a single YAML file.
* Implemented persistent storage using Docker volumes.
* Created custom Docker networks for inter-container communication.
* Used health checks and service dependencies for reliable startup order.

## Conclusion

This project demonstrates container orchestration using Docker Compose by integrating an ASP.NET Core API with a PostgreSQL database. It provides a simple and scalable approach for local development and testing of multi-container applications.
