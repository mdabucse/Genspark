# Full-Stack Deployment Inside an Ubuntu Docker Container

This repository contains the source code for a full-stack weather application designed to complete the **Full-Stack Deployment Inside an Ubuntu Docker Container** student lab manual. 

It contains:
1. **C# ASP.NET Core Web API Backend (`weather-api`)**: A .NET 8 Web API which yields realistic weather profiles and forecasts for popular cities, along with a `/api/health` check endpoint.
2. **Angular Frontend Dashboard (`weather-frontend`)**: A standalone Angular SPA styling a glassmorphic dark theme dashboard that calls the API, handles search states, and presents weather condition animations.

---

## 📋 Lab Placeholder Values

Here are the exact values to fill in the **Appendix A: Placeholder Replacement Guide** section of your lab manual:

| Placeholder | Value to Fill | Description |
| :--- | :--- | :--- |
| **`<DOTNET_API_REPO_URL>`** | *Your GitHub Repository URL where `weather-api` is pushed* | GitHub URL to clone the C# backend API. |
| **`<ANGULAR_REPO_URL>`** | *Your GitHub Repository URL where `weather-frontend` is pushed* | GitHub URL to clone the Angular frontend. |
| **`<DOTNET_API_FOLDER_NAME>`** | `weather-api` | Folder name created when cloning the backend. |
| **`<ANGULAR_FOLDER_NAME>`** | `weather-frontend` | Folder name created when cloning the frontend. |
| **`<DOTNET_PROJECT_FILE_NAME>.csproj`**| `WeatherApi.csproj` | File name of the C# API project. |
| **`<ANGULAR_DIST_FOLDER_NAME>`** | `weather-frontend/browser` | Build output path containing `index.html`. |

---

## 🛠️ Step-by-Step Deployment Commands (Ubuntu Container)

Follow these exact steps inside the container shell to deploy the stack:

### 1. Enter the Container
Start the container with port mapping on the host (port `8080` for Nginx, and port `5000` for API test):
```bash
docker run -it --name fullstack-ubuntu -p 8080:80 -p 5000:5000 ubuntu:24.04 bash
```

### 2. Update and Install Core Dependencies
```bash
apt update
apt install -y git curl wget nano ca-certificates gnupg lsb-release software-properties-common
```

### 3. Install .NET 8 SDK & Runtime
```bash
wget https://packages.microsoft.com/config/ubuntu/24.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
dpkg -i packages-microsoft-prod.deb
apt update
apt install -y dotnet-sdk-8.0 aspnetcore-runtime-8.0
```

### 4. Install Node.js v20 & Angular CLI
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g @angular/cli
```

### 5. Install Nginx
```bash
apt install -y nginx
```

### 6. Create Workspace and Clone Code
```bash
mkdir -p /workspace
cd /workspace
# Replace these URLs with your actual repository links:
git clone <YOUR_DOTNET_API_GITHUB_REPO_URL> weather-api
git clone <YOUR_ANGULAR_GITHUB_REPO_URL> weather-frontend
```

### 7. Build and Run the .NET API
```bash
cd /workspace/weather-api
dotnet restore
dotnet build
dotnet publish -c Release -o /app/api

# Run the API in the background:
cd /app/api
ASPNETCORE_URLS=http://127.0.0.1:5000 nohup dotnet WeatherApi.dll > /var/log/dotnet-api.log 2>&1 &

# Confirm it's running (should see dotnet process and port 5000 listener):
ps -ef | grep dotnet
```

### 8. Build the Angular App
```bash
cd /workspace/weather-frontend
npm install
ng build --configuration production
```

### 9. Deploy to Nginx Web Root
```bash
rm -rf /var/www/html/*
mkdir -p /var/www/html/angular
cp -r /workspace/weather-frontend/dist/weather-frontend/browser/* /var/www/html/angular/
```

### 10. Configure Nginx Reverse Proxy
Overwrite the Nginx site configuration so Nginx serves Angular and forwards `/api` endpoints:
```bash
cat > /etc/nginx/sites-available/default <<'EOF'
server {
    listen 80;
    server_name _;

    root /var/www/html/angular;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Test syntax and start Nginx
nginx -t
nginx
```

### 11. Verify Inside Container and on Host
Inside Container:
```bash
curl http://localhost
curl http://localhost/api/health
```
On Host Browser:
- Open `http://localhost:8080` to interact with the dashboard.
- Open `http://localhost:8080/api/health` to test the reverse proxied health check.

---

## 🧠 Knowledge Check Answers

Here are the complete answers to write down in your lab sheet:

1. **Why do we map host port 8080 to container port 80?**
   * **Answer:** Nginx inside the container listens for HTTP requests on port 80 by default. Mapping host port 8080 to container port 80 exposes Nginx's HTTP port to the host system, allowing us to load the Angular application in the host's web browser using `http://localhost:8080`.

2. **What is the purpose of Git in this lab?**
   * **Answer:** Git is used inside the container to retrieve (clone) the project source code for both the C# backend API and Angular frontend applications from their GitHub repositories directly into the container's workspace environment for compilation and deployment.

3. **Why do we install .NET SDK instead of only .NET runtime?**
   * **Answer:** The .NET SDK contains build-time tools, package management commands (`dotnet restore`), compilers, and code compilation targets required to build source code. The .NET runtime only contains execution utilities, which are insufficient to compile raw C# source code.

4. **What does npm install do?**
   * **Answer:** It reads the dependencies declared in the project's `package.json` file and downloads the matching library packages from the public npm registry into the local `node_modules` directory, making them available for the Angular build compiler.

5. **What does ng build --configuration production create?**
   * **Answer:** It compiles the Angular TypeScript code, parses templates, and minifies stylesheet outputs into optimized, lightweight, browser-runnable static assets (HTML, CSS, JS) configured for high performance in production.

6. **Why does Angular need Nginx after build?**
   * **Answer:** Since Angular is a client-side Single Page Application (SPA), the build output is just static client files. It requires a web server like Nginx to serve these static files to web clients over the network when they hit the root URL.

7. **What is the role of proxy_pass in Nginx?**
   * **Answer:** `proxy_pass` configures Nginx as a reverse proxy. When Nginx receives a request matching `/api/`, it forwards that request to the local backend service listening on port 5000 (`http://127.0.0.1:5000/`) and returns the API's response back to the client transparently.

8. **Why do we use /api as the backend path?**
   * **Answer:** Using a relative `/api/` path routing through Nginx means both frontend and backend are accessed on the same domain and port (8080). This eliminates Cross-Origin Resource Sharing (CORS) request blockage and consolidates external traffic under a single entrypoint.

9. **What is the purpose of nohup when running the .NET API?**
   * **Answer:** `nohup` (no hangup) detaches the dotnet API process from the current terminal shell session, allowing it to continue running in the background even if the terminal shell is closed or exited. The trailing `&` pushes the process to the background.

10. **Why is Dockerfile preferred over docker commit in real projects?**
    * **Answer:** A Dockerfile is a written, version-controlled, and automated recipe for constructing container images. It is reproducible, documented, and lightweight. In contrast, `docker commit` generates opaque, non-repeatable manual snapshots of running containers, making debugging, updates, and orchestration difficult.
