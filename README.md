Knovator DevOps Technical Task
This repository contains the complete solution for the DevOps technical task, which is divided into three main parts:

Dockerizing a Node.js and React.js application.

Creating an automated GitLab CI/CD pipeline for deployment.

Planning a distributed Laravel architecture on Azure.

🚀 Step 1: Dockerize Node.js & React.js Application
This step involves containerizing a full-stack application using Docker and orchestrating it with docker-compose.

Project Structure
The application is structured into three main services:

/backend: A simple Node.js with Express API server.

/frontend: A standard React.js application created with create-react-app.

/proxy: An Nginx reverse proxy to manage and route traffic to the other services.

Dockerization Strategy
To ensure the final images are lightweight and secure, multi-stage builds were used for both the backend and frontend Dockerfiles.

Backend (backend/Dockerfile):

Build Stage: Uses a full node:22 image to install dependencies from package.json.

Final Stage: Uses a minimal node:22-alpine image. Only the necessary source code and production node_modules are copied from the build stage, resulting in a smaller and more secure final image.

Frontend (frontend/Dockerfile):

Build Stage: Uses a full node:18 image to run npm install and npm run build, which compiles the React app into static HTML, CSS, and JS files.

Final Stage: Uses a highly-optimized nginx:stable-alpine image to serve the static files generated in the build stage. This is extremely efficient as it doesn't require a Node.js runtime.

Orchestration with Docker Compose
The docker-compose.yml file defines the three services and how they interact:

backend service: Builds the Node.js image. It does not expose any ports to the host machine, as all traffic is routed through the proxy.

frontend service: Builds the React image. It is also not exposed publicly.

proxy service: Uses a standard nginx:stable-alpine image and mounts a custom nginx.conf file.

It is the only service exposed to the host machine, mapping port 80 of the host to port 80 of the container.

The nginx.conf is configured to act as a reverse proxy:

Requests to /api are forwarded to the backend service on its internal port 5000.

All other requests are forwarded to the frontend service on its internal port 80.

⚙️ Step 2: GitLab CI/CD Pipeline
This step automates the deployment of the Dockerized application using a GitLab CI/CD pipeline and a self-hosted runner on a VM.

Self-Hosted Runner
A virtual machine was provisioned on Microsoft Azure (Ubuntu 20.04) to act as both the deployment server and the self-hosted GitLab Runner. The runner was configured with the shell executor, allowing it to run deployment commands directly on the server.

Pipeline Configuration (.gitlab-ci.yml)
The pipeline is defined in the .gitlab-ci.yml file and consists of two stages:

build Stage:

This job runs on GitLab's shared, cloud-based runners.

It logs into GitLab's built-in Container Registry.

It builds the backend and frontend Docker images, tagging them with the unique commit SHA for versioning.

Finally, it pushes these images to the project's private Container Registry.

deploy Stage:

This job is configured with the tag deploy-vm, ensuring it only runs on our self-hosted runner on the Azure VM.

It navigates to the project directory on the server.

It logs into the GitLab Container Registry to gain access to the newly built images.

It creates a .env file containing the new image tags.

It runs docker-compose pull to download the new images.

It runs docker-compose up -d to restart the services gracefully with the new images.

This setup creates a full CI/CD loop: a git push to the main branch automatically triggers a new deployment, making the changes live within minutes.

☁️ Step 3: Distributed Laravel Architecture on Azure
This step involved planning a secure, scalable, and cost-effective architecture for a distributed Laravel application on Microsoft Azure.

Architecture Overview
The design follows a multi-tiered approach, separating components into isolated subnets within a single Virtual Network (VNet) for maximum security.

Networking (laravel-vnet): A Virtual Network with separate private subnets for the web tier, application tier, data services, and the public-facing load balancer.

Load Balancing:

Azure Application Gateway: A public-facing L7 load balancer that serves as the single entry point for all user traffic. It handles SSL termination and includes a Web Application Firewall (WAF) for security.

Internal Load Balancer: A private L4 load balancer used for secure communication between the Nginx web servers and the PHP-FPM application servers.

Compute (Web & Application Tiers):

Two separate Virtual Machine Scale Sets (VMSS) are used: one for the Nginx web servers and another for the PHP-FPM application servers.

This design allows for independent autoscaling. If the application is CPU-bound, more PHP-FPM instances can be added without scaling the Nginx tier, which is highly cost-effective.

Data Services (Managed & Secure):

Database (MySQL): Azure Database for MySQL (Flexible Server) is used, deployed in a private subnet with VNet integration. This is a fully managed service that handles backups, patching, and scaling.

Cache (Redis): Azure Cache for Redis is used for caching and queuing. It is connected to the VNet via a Private Endpoint for maximum security.

Search (Elasticsearch): The plan is to use the official Elastic Cloud (Elasticsearch) service from the Azure Marketplace, also connected securely via a Private Link.

Outbound Connectivity: An Azure NAT Gateway is used to provide secure outbound internet access for the private VMs, allowing them to download software updates without being exposed to inbound connections.

This architecture is:

Secure: Backend services have no public IP addresses and are protected by Network Security Groups (NSGs).

Scalable: VMSS allows the compute tiers to scale automatically based on demand.

Cost-Effective: Autoscaling and the use of managed PaaS services reduce both compute and operational costs.
