# Azure Blob Storage + Azure Key Vault + ASP.NET Core API

This repository contains my hands-on implementation of securely integrating **Azure Blob Storage**, **Azure Key Vault**, and **ASP.NET Core Web API**. The project demonstrates how to securely store secrets, upload/download files from Azure Blob Storage, and deploy the application to Azure App Service using **Managed Identity**.

---

#  Concepts Learned

## 1. Azure Resource Group
- Creating and managing Azure Resource Groups
- Organizing cloud resources into a single logical container
- Cleaning up resources after deployment

---

## 2. Azure Storage Account
- Creating an Azure Storage Account
- Understanding Storage Account services
- Retrieving the Storage Connection String
- Creating Blob Containers

---

## 3. Azure Blob Storage
- Blob Storage architecture
- Blob Containers
- Uploading files
- Downloading files
- Managing blobs using the Azure SDK

---

## 4. Azure Key Vault
- Creating Azure Key Vault
- Securely storing application secrets
- Secret management
- Retrieving secrets during application startup
- Keeping secrets out of source code

---

## 5. Managed Identity
- System Assigned Managed Identity
- Passwordless authentication
- Secure communication between Azure services
- Eliminating hard-coded credentials

---

## 6. Azure RBAC (Role-Based Access Control)
- Azure RBAC fundamentals
- Key Vault Secrets User Role
- Key Vault Secrets Officer Role
- Principle of Least Privilege

---

## 7. DefaultAzureCredential
- Automatic authentication
- Local authentication using Azure CLI
- Azure authentication using Managed Identity
- Same application code working locally and in Azure

---

## 8. ASP.NET Core Configuration
- appsettings.json
- Environment Variables
- Azure App Settings
- Configuration Providers
- Secure configuration management

---

## 9. Azure Storage SDK
- BlobServiceClient
- BlobContainerClient
- BlobClient
- UploadAsync()
- DownloadContentAsync()
- CreateIfNotExists()

---

## 10. ASP.NET Core Web API
- Controllers
- Dependency Injection
- REST APIs
- File Upload API
- File Download API

---

## 11. Dependency Injection
- Registering services
- Singleton services
- Injecting BlobServiceClient
- Service lifetime

---

## 12. Azure App Service
- Creating App Service Plan
- Creating Azure Web App
- Deploying ASP.NET Core applications
- Configuring Application Settings
- Runtime configuration

---

## 13. Application Deployment
- dotnet publish
- Packaging deployment files
- ZIP deployment
- Azure CLI deployment
- Deployment troubleshooting

---

## 14. Azure CLI
- Resource creation
- Storage management
- Key Vault management
- Web App deployment
- Application configuration
- Resource cleanup

---

## 15. Security Best Practices
- Never store secrets in source code
- Store secrets in Azure Key Vault
- Use Managed Identity
- Follow Least Privilege access
- Secure cloud authentication
- Protect Storage Account keys

---

# Technologies Used

- ASP.NET Core (.NET)
- Azure Blob Storage
- Azure Key Vault
- Azure App Service
- Azure CLI
- Azure Identity
- Azure Storage SDK
- C#

---

# Features

- Secure Secret Management
- File Upload API
- File Download API
- Azure Blob Storage Integration
- Azure Key Vault Integration
- Managed Identity Authentication
- Azure App Service Deployment

---

# Key Takeaways

- Learned secure cloud application development using Azure services.
- Understood how Azure Key Vault protects sensitive information.
- Implemented passwordless authentication using Managed Identity.
- Built REST APIs for uploading and downloading files.
- Deployed an ASP.NET Core application to Azure App Service.
- Gained hands-on experience with Azure CLI and Azure SDKs.
- Followed cloud security best practices by avoiding hard-coded secrets.

---

# Learning Outcomes

After completing this project, I gained practical experience with:

- Azure Resource Management
- Azure Blob Storage
- Azure Key Vault
- Azure RBAC
- Managed Identity
- DefaultAzureCredential
- ASP.NET Core Web API
- Azure SDK for .NET
- Azure App Service Deployment
- Secure Cloud Application Development
