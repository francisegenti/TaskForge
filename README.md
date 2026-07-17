# TaskForge

### DevOps-Driven Task Management Platform

TaskForge is a task management web application built to demonstrate a complete, production-style DevOps workflow: containerization, CI/CD, orchestration, package management, infrastructure as code, and monitoring, wrapped around a lightweight static frontend.

The frontend itself (HTML, CSS, JavaScript) is intentionally simple. The focus of this project is the deployment pipeline and cloud infrastructure around it.

---

## Project Overview

TaskForge allows users to:

- Create tasks
- Manage daily activities
- Organize workflow
- Improve productivity
- Access a clean and responsive interface

---

## Architecture

```text
Developer -> GitHub -> GitHub Actions (CI/CD)
                 |
        Docker image build and push (GHCR)
                 |
         Kubernetes deployment (EKS)
                 |
              Helm chart
                 |
     Monitoring and observability (Prometheus + Grafana)
```

Infrastructure (VPC and EKS cluster) is provisioned with Terraform. The application is packaged as a Docker image, deployed to Kubernetes via a Helm chart, and served through an Nginx ingress.

---

## Tech Stack

**Frontend**
- HTML5
- CSS3
- JavaScript

**Web server / container**
- Nginx (Alpine base image)
- Docker

**Orchestration**
- Kubernetes
- Helm

**CI/CD**
- GitHub Actions
- GitHub Container Registry (GHCR)

**Infrastructure as Code**
- Terraform
- AWS (VPC, EKS)

**Monitoring**
- Prometheus
- Grafana

---

## Project Structure

```text
TaskForge/
├── .github/workflows/         # GitHub Actions CI/CD pipeline (deploy.yaml)
├── helm/
│   ├── taskforge/              # Helm chart (Chart.yaml, values.yaml, templates/)
│   └── monitoring-values.yaml  # Values for the monitoring stack
├── terraform/                  # AWS infrastructure (VPC, EKS) as code
├── Dockerfile                  # Container build definition
├── nginx.conf                  # Nginx server configuration
├── index.html                  # Main HTML page
├── style.css                   # Styling
├── script.js                   # Frontend logic
└── README.md
```

---

## Prerequisites

Depending on which part of the stack you want to run, you will need:

**To run the app locally (static files only)**
- A modern web browser
- Optionally, any static file server (e.g. `python3 -m http.server`)

**To build and run the container**
- Docker (20.x or later)

**To deploy to Kubernetes**
- A running Kubernetes cluster (local, e.g. Minikube/Kind, or remote, e.g. EKS)
- `kubectl` configured to point at that cluster
- Helm 3.x
- An Nginx ingress controller installed on the cluster (the Helm chart's ingress uses `className: nginx`)

**To provision the cloud infrastructure**
- An AWS account with credentials configured (e.g. via `aws configure`)
- Terraform (1.0 or later)
- Sufficient AWS IAM permissions to create a VPC, subnets, and an EKS cluster

**To use the CI/CD pipeline**
- A GitHub repository with Actions enabled
- No extra secrets are required beyond the default `GITHUB_TOKEN`, which is used to push images to GHCR

**For monitoring**
- Prometheus and Grafana installed on the cluster (e.g. via the kube-prometheus-stack Helm chart), since the app's `ServiceMonitor` expects a Prometheus Operator to already be present

---

## Running Locally (static files)

Open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

---

## Docker

### Build the image

```bash
docker build -t taskforge .
```

### Run the container

The image serves the app with Nginx on port 80:

```bash
docker run -p 8080:80 taskforge
```

Then visit `http://localhost:8080`. A health check endpoint is available at `/health`.

---

## Kubernetes and Helm

The application is deployed via the Helm chart under `helm/taskforge`.

### Install

```bash
helm install taskforge ./helm/taskforge
```

### Upgrade

```bash
helm upgrade taskforge ./helm/taskforge
```

### Key values (`helm/taskforge/values.yaml`)

- `replicaCount`: number of pod replicas (default: 2)
- `image.repository`: container image to deploy (default: `ghcr.io/francisegenti/taskforge`)
- `service.port`: service port (default: 80)
- `ingress.host`: hostname the ingress should route (update this to your own domain)
- `serviceMonitor.enabled`: whether to create a Prometheus `ServiceMonitor` (requires the Prometheus Operator CRDs to be installed on the cluster)

---

## Terraform (AWS Infrastructure)

Terraform provisions a VPC and an EKS cluster in AWS.

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

Default configuration (see `variables.tf`):

- Region: `eu-west-2`
- Cluster name: `taskforge`
- Node group: 1-2 `t3.small` instances

Override these with `-var` flags or a `terraform.tfvars` file as needed.

---

## CI/CD Pipeline

Defined in `.github/workflows/deploy.yaml`. On every push or pull request to `main`, the workflow:

1. Checks out the code
2. Logs in to the GitHub Container Registry (GHCR)
3. Builds the Docker image
4. Pushes the image to GHCR, tagged as `latest` and with the commit SHA (push to `main` only; pull requests build but do not push)

---

## Monitoring

The Helm chart can create a `ServiceMonitor` for the app, intended to be scraped by a Prometheus Operator installed separately on the cluster (see `helm/monitoring-values.yaml` for related configuration). Grafana can then be pointed at that Prometheus instance to visualize metrics.

---

## What This Project Demonstrates

- Docker containerization of a static web app
- Kubernetes orchestration with Helm packaging
- CI/CD automation with GitHub Actions
- Infrastructure as Code with Terraform on AWS
- Monitoring and observability with Prometheus and Grafana
- End-to-end deployment workflow from commit to running cluster

---

## Author

**Francis Egenti**

- GitHub: https://github.com/francisegenti
- LinkedIn: https://www.linkedin.com/in/francis-egenti-1537442a7
