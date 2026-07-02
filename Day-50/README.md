# Azure Functions: Timer Trigger, HTTP Trigger & Blob Archiving

## Overview

This project demonstrates how to build a serverless application using Azure Functions to automate blob maintenance in Azure Storage.

The application automatically archives blobs older than a specified number of days from the **uploads** container to the **archive** container.

Two Azure Functions are implemented:

- Timer Trigger – Executes automatically on a schedule.
- HTTP Trigger – Executes on demand through an HTTP request.

---

# Concepts Covered

## 1. Azure Functions

Azure Functions is a serverless compute service that allows developers to execute code without managing servers.

### Features

- Event-driven execution
- Automatic scaling
- Pay-per-execution pricing
- Supports multiple programming languages
- Easy integration with Azure services

---

## 2. Serverless Computing

Serverless computing allows developers to focus on writing business logic while Azure manages:

- Infrastructure
- Scaling
- Availability
- Resource allocation

---

## 3. Function App

A Function App is a container that hosts one or more Azure Functions.

Example:

- NightlyArchive
- ManualArchive

All functions inside the Function App share:

- Runtime
- Configuration
- App Settings
- Managed Identity

---

## 4. Azure Storage Account

Azure Storage Account stores application data.

In this project it contains two Blob Containers:

- uploads
- archive

---

## 5. Azure Blob Storage

Azure Blob Storage is Microsoft's object storage service for storing unstructured data.

Used to store:

- Images
- Videos
- Documents
- Backups
- Log files

---

## 6. Blob Containers

### uploads

Stores newly uploaded files.

### archive

Stores files that have been automatically archived.

---

## 7. Blob Archive Service

A custom service (`BlobArchiveService`) contains the business logic responsible for:

- Reading blobs from uploads
- Checking last modified date
- Moving old blobs to archive
- Deleting original blobs
- Logging archive operations

This keeps the code reusable across multiple Azure Functions.

---

## 8. Timer Trigger

Timer Trigger automatically executes based on a CRON schedule.

Used for:

- Scheduled cleanup
- Backups
- Data synchronization
- Report generation

Example:

```text
0 0 0 * * *
```

Runs every day at midnight (UTC).

---

## 9. HTTP Trigger

HTTP Trigger executes whenever an HTTP request is received.

Used for:

- REST APIs
- Webhooks
- Manual execution
- Testing

Example:

```
POST /api/ManualArchive?days=0
```

---

## 10. CRON Expression

Azure Functions uses CRON expressions for scheduling.

Format:

```
{second} {minute} {hour} {day} {month} {day-of-week}
```

Example:

```
0 0 0 * * *
```

Meaning:

- Second = 0
- Minute = 0
- Hour = 0
- Every day
- Every month
- Every day of week

---

## 11. Dependency Injection

Dependency Injection (DI) allows services to be injected into Azure Functions instead of creating objects manually.

Benefits:

- Loose coupling
- Better code organization
- Easier testing
- Improved maintainability

Example:

- BlobArchiveService

---

## 12. IConfiguration

`IConfiguration` is used to read configuration values from:

- local.settings.json
- Azure App Settings
- Azure Key Vault References

Example:

```
BlobStorageConnectionString
```

---

## 13. Azure Key Vault

Azure Key Vault securely stores:

- Secrets
- Connection Strings
- Passwords
- Certificates
- Keys

Instead of hardcoding sensitive values inside the application.

---

## 14. Key Vault Secret

A secret named:

```
BlobStorageConnectionString
```

stores the Azure Storage connection string securely.

---

## 15. Key Vault Reference

A Key Vault Reference allows Azure App Settings to retrieve secrets directly from Key Vault.

Benefits:

- No hardcoded secrets
- Improved security
- Easier secret rotation
- No code changes when secrets change

---

## 16. Managed Identity

Managed Identity provides an automatically managed identity for Azure resources.

Benefits:

- No credentials stored in code
- Secure authentication
- Integrated with Azure AD

Used by the Function App to access Key Vault.

---

## 17. Azure CLI

Azure CLI was used to create and manage Azure resources.

Resources created:

- Resource Group
- Storage Account
- Blob Containers
- Key Vault
- Function App

---

## 18. Function Deployment

Azure Functions were deployed using:

```
func azure functionapp publish
```

Deployment included:

- Build
- Packaging
- Publishing to Azure

---

## 19. Local Development

Local execution included:

- Building the project
- Running Azure Functions locally
- Testing HTTP endpoints
- Uploading blobs
- Verifying archive operations

---

## 20. Azure Functions Core Tools

Azure Functions Core Tools enables:

- Local execution
- Function creation
- Deployment
- Testing

Common commands:

```
func init
func new
func start
func azure functionapp publish
```

---

## 21. Blob Operations

Implemented operations:

- Read blobs
- Get blob metadata
- Check LastModified date
- Copy blobs
- Delete blobs
- List blobs

---

## 22. Logging

Azure Functions uses `ILogger` for logging.

Logs include:

- Function execution
- Archived file names
- Number of archived files
- Error messages

---

## 23. HTTP Testing

HTTP Trigger was tested using:

```
curl
```

Example:

```
curl -X POST http://localhost:7071/api/ManualArchive?days=0
```

---

## 24. Project Workflow

```
User Uploads File
        │
        ▼
Uploads Container
        │
        ▼
Timer Trigger / HTTP Trigger
        │
        ▼
BlobArchiveService
        │
        ▼
Check LastModified Date
        │
        ▼
Move Blob
        │
        ▼
Archive Container
```

---

# Azure Resources Used

- Azure Resource Group
- Azure Storage Account
- Azure Blob Storage
- Blob Containers
- Azure Key Vault
- Azure Functions
- Managed Identity
- Azure CLI

---

# Skills Learned

- Azure Functions
- Serverless Computing
- Timer Trigger
- HTTP Trigger
- Azure Blob Storage
- Blob Management
- Azure Key Vault
- Managed Identity
- Dependency Injection
- IConfiguration
- Azure CLI
- Function Deployment
- Local Function Testing
- Blob Archiving
- CRON Scheduling
- Logging in Azure Functions

---

# Conclusion

This project demonstrates how to build a secure, serverless blob archiving solution using Azure Functions. It combines scheduled execution through Timer Triggers, manual execution through HTTP Triggers, secure secret management using Azure Key Vault, dependency injection for reusable business logic, and Azure Blob Storage for file management. The project also covers local development, testing, deployment, and monitoring using Azure Functions and Azure CLI.