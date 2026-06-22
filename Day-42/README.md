# Linux Basics and Docker

## Overview

Today, we learned the fundamentals of Linux and Docker. We explored essential Linux commands, containerization concepts, Docker images, and container management.

## Topics Covered

### Linux Basics

* Introduction to Linux Operating System
* Understanding the Linux File System
* Navigating directories using:

  * `pwd`
  * `ls`
  * `cd`
* File and Directory Operations:

  * `mkdir`
  * `touch`
  * `cp`
  * `mv`
  * `rm`
* Viewing File Contents:

  * `cat`
  * `less`
  * `head`
  * `tail`
* File Permissions:

  * `chmod`
  * `chown`
* Environment Variables:

  * `export`
  * `echo`

### Docker Fundamentals

* Introduction to Containerization
* Difference between Virtual Machines and Containers
* Docker Architecture
* Docker Images and Containers

### Docker Commands Practiced

#### Pull an Image

```bash
docker pull ubuntu
```

#### List Images

```bash
docker images
```

#### Run a Container

```bash
docker run -it ubuntu bash
```

#### List Running Containers

```bash
docker ps
```

#### List All Containers

```bash
docker ps -a
```

#### Stop a Container

```bash
docker stop <container_id>
```

#### Remove a Container

```bash
docker rm <container_id>
```

#### Remove a Container Forcefully

```bash
docker rm -f <container_id>
```

#### Build a Docker Image

```bash
docker build -t ubuntu-nginx:v1 .
```

#### Run an Nginx Container

```bash
docker run -d --name ubuntu-nginx-web -p 8081:80 ubuntu-nginx:v1 nginx -g 'daemon off;'
```

### Troubleshooting Learned

* Port allocation conflicts
* Container name conflicts
* Checking container logs
* Removing existing containers before reuse

Example:

```bash
docker rm -f ubuntu-nginx-web
```

## Key Takeaways

* Learned basic Linux commands and file management.
* Understood Docker architecture and containerization.
* Built and executed Docker images.
* Managed Docker containers using CLI commands.
* Resolved common Docker runtime errors.

