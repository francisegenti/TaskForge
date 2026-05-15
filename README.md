# TaskForge 🚀
### DevOps-Driven Task Management Platform

TaskForge is a modern task management web application built with a strong focus on **DevOps, Cloud Infrastructure, CI/CD automation, containerization, orchestration, monitoring, and scalability**.

This project demonstrates how a simple frontend application can be transformed into a production-style cloud-native deployment pipeline using modern DevOps tools and practices.

---

## 🌐 Live Demo

**Public URL:**  
https://main.d3ijhfwf2p1uke.amplifyapp.com/

---

# 📌 Project Overview

TaskForge allows users to:

- Create tasks
- Manage daily activities
- Organize workflow
- Improve productivity
- Access a clean and responsive interface

While the frontend is lightweight, the main goal of this project was to implement a **complete DevOps workflow and deployment architecture**.

---

# 🏗️ DevOps Architecture

```text
Developer → GitHub → GitHub Actions (CI/CD)
                ↓
         Docker Containerization
                ↓
        Kubernetes Deployment
                ↓
             Helm Charts
                ↓
        Monitoring & Observability
        (Prometheus + Grafana)
                ↓
          AWS Amplify Hosting
```

---

# ⚡ Tech Stack

## Frontend
- HTML5
- CSS3
- JavaScript

## DevOps & Cloud
- Docker
- Kubernetes
- Helm
- GitHub Actions
- Terraform
- AWS Amplify

## Monitoring & Observability
- Prometheus
- Grafana

## Version Control
- Git
- GitHub

---

# 📂 Project Structure

```bash
TaskForge/
│
├── .github/workflows/     # GitHub Actions CI/CD pipelines
├── helm/                  # Helm chart configuration
├── terraform/             # Infrastructure as Code
├── monitoring/            # Prometheus & Grafana configs
├── kubernetes/            # Kubernetes manifests
├── Dockerfile             # Docker container setup
├── index.html             # Main HTML page
├── style.css              # Styling
├── script.js              # Frontend logic
└── README.md
```

---

# 🐳 Docker Containerization

The application was containerized using Docker to ensure:

- Environment consistency
- Easy deployment
- Scalability
- Faster development workflow

### Build Docker Image

```bash
docker build -t taskforge .
```

### Run Container

```bash
docker run -p 3000:3000 taskforge
```

---

# ☸️ Kubernetes Deployment

TaskForge was deployed using Kubernetes to simulate a production-grade orchestration environment.

Features include:

- Pod management
- Replica scaling
- Service exposure
- Declarative deployments

### Apply Kubernetes Resources

```bash
kubectl apply -f kubernetes/
```

---

# 📦 Helm Integration

Helm was used to simplify Kubernetes application deployment and management.

### Install Helm Chart

```bash
helm install taskforge ./helm
```

### Upgrade Deployment

```bash
helm upgrade taskforge ./helm
```

---

# 🏗️ Terraform Infrastructure

Infrastructure provisioning was automated using Terraform.

Terraform was used to:
- Manage cloud resources
- Provision infrastructure consistently
- Enable Infrastructure as Code (IaC)

### Terraform Commands

```bash
terraform init
terraform plan
terraform apply
```

---

# 🔄 CI/CD Pipeline

A complete CI/CD pipeline was implemented using GitHub Actions.

### Pipeline Features

✅ Automated Builds  
✅ Docker Image Creation  
✅ Deployment Automation  
✅ Continuous Integration  
✅ Continuous Delivery  

### CI/CD Workflow

```text
Push Code → GitHub Actions → Build → Test → Deploy
```

---

# 📊 Monitoring & Observability

Monitoring was implemented using:

## Prometheus
Used for:
- Metrics collection
- Application monitoring
- Kubernetes monitoring

## Grafana
Used for:
- Visualization dashboards
- Real-time metrics
- Performance insights

### Monitoring Stack

```text
Application → Prometheus → Grafana Dashboard
```

---

# ☁️ AWS Amplify Deployment

The frontend application was deployed publicly using AWS Amplify.

### Why Amplify?
- Fast deployment
- Easy GitHub integration
- Automatic deployments
- HTTPS enabled
- Scalable hosting

---

# 🚀 Deployment Workflow

```text
Code Changes
     ↓
Push to GitHub
     ↓
GitHub Actions CI/CD
     ↓
Docker Build
     ↓
Kubernetes Deployment
     ↓
Monitoring with Prometheus/Grafana
     ↓
AWS Amplify Public Hosting
```

---

# 🧠 What I Learned

Through this project, I gained hands-on experience with:

- Docker containerization
- Kubernetes orchestration
- Helm package management
- CI/CD automation
- Infrastructure as Code with Terraform
- Monitoring and observability
- AWS cloud deployment
- GitHub Actions workflows
- DevOps best practices

---

# 🔮 Future Improvements

- Add backend integration
- Add authentication system
- Implement database support
- Add user collaboration features
- Configure custom domain
- Improve monitoring dashboards
- Add autoscaling

---

# 👨‍💻 Author

## Francis Egenti

- GitHub: https://github.com/francisegenti
- LinkedIn: https://www.linkedin.com/in/francis-egenti-1537442a7?trk=contact-info

---

# ⭐ Support

If you found this project helpful, feel free to:

- Star the repository
- Fork the project
- Share feedback
- Connect with me

---


