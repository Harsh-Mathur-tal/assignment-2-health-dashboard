# 🚀 CI/CD Dashboard - Infrastructure Deployment Guide

This guide provides comprehensive instructions for deploying the CI/CD Pipeline Health Dashboard to AWS using Terraform Infrastructure-as-Code (IaC).

## 📋 **Table of Contents**

1. [Prerequisites](#-prerequisites)
2. [Architecture Overview](#-architecture-overview)
3. [Quick Start](#-quick-start)
4. [Environment Setup](#-environment-setup)
5. [Deployment Steps](#-deployment-steps)
6. [Accessing the Application](#-accessing-the-application)
7. [Monitoring & Maintenance](#-monitoring--maintenance)
8. [Troubleshooting](#-troubleshooting)
9. [Cleanup](#-cleanup)
10. [AI-Native Workflow](#-ai-native-workflow)

---

## 🔧 **Prerequisites**

### Required Tools
```bash
# Terraform (>= 1.0)
terraform --version

# AWS CLI (>= 2.0)
aws --version

# SSH Key Generation
ssh-keygen --help

# jq for JSON processing (optional but recommended)
jq --version
```

### AWS Account Setup
1. **AWS Account** with appropriate permissions
2. **AWS CLI configured** with credentials
3. **IAM permissions** for EC2, VPC, RDS, IAM, Secrets Manager

### Minimum IAM Permissions
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:*",
        "rds:*",
        "iam:*",
        "secretsmanager:*",
        "elasticloadbalancing:*",
        "autoscaling:*",
        "cloudwatch:*"
      ],
      "Resource": "*"
    }
  ]
}
```

---

## 🏗️ **Architecture Overview**

### Infrastructure Components

```
┌─────────────────────────────────────────────────────────┐
│                     AWS Cloud                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │                VPC (10.0.0.0/16)               │   │
│  │                                                 │   │
│  │  ┌──────────────┐  ┌──────────────┐            │   │
│  │  │ Public       │  │ Public       │            │   │
│  │  │ Subnet       │  │ Subnet       │            │   │
│  │  │ AZ-1a        │  │ AZ-1b        │            │   │
│  │  │              │  │              │            │   │
│  │  │    ┌─────┐   │  │    ┌─────┐   │            │   │
│  │  │    │ ALB │◄──┼──┼────┤ ALB │   │            │   │
│  │  │    └─────┘   │  │    └─────┘   │            │   │
│  │  └──────────────┘  └──────────────┘            │   │
│  │           │                │                   │   │
│  │  ┌──────────────┐  ┌──────────────┐            │   │
│  │  │ Private      │  │ Private      │            │   │
│  │  │ Subnet       │  │ Subnet       │            │   │
│  │  │ AZ-1a        │  │ AZ-1b        │            │   │
│  │  │              │  │              │            │   │
│  │  │ ┌──────────┐ │  │ ┌──────────┐ │            │   │
│  │  │ │EC2 Inst. │ │  │ │EC2 Inst. │ │            │   │
│  │  │ │Dashboard │ │  │ │Dashboard │ │            │   │
│  │  │ └──────────┘ │  │ └──────────┘ │            │   │
│  │  │      │       │  │      │       │            │   │
│  │  │ ┌──────────┐ │  │ ┌──────────┐ │            │   │
│  │  │ │    RDS   │ │  │ │   RDS    │ │            │   │
│  │  │ │ Primary  │ │  │ │ Replica  │ │            │   │
│  │  │ └──────────┘ │  │ └──────────┘ │            │   │
│  │  └──────────────┘  └──────────────┘            │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Module Structure
- **VPC Module**: Networking infrastructure (VPC, subnets, gateways)
- **EC2 Module**: Auto Scaling Group, Load Balancer, application deployment
- **RDS Module**: PostgreSQL database with backups and monitoring

---

## ⚡ **Quick Start**

### 1. Clone and Setup
```bash
# Navigate to infrastructure directory
cd infra

# Choose your environment
cd environments/dev  # or environments/prod
```

### 2. Generate SSH Key Pair
```bash
# For development
ssh-keygen -t rsa -b 4096 -f ~/.ssh/cicd-dashboard-dev -C \"cicd-dashboard-dev\"

# For production
ssh-keygen -t rsa -b 4096 -f ~/.ssh/cicd-dashboard-prod -C \"cicd-dashboard-prod\"

# Get public key
cat ~/.ssh/cicd-dashboard-dev.pub  # Copy this value
```

### 3. Configure Variables
```bash
# Edit terraform.tfvars
vim terraform.tfvars

# Add your public key to the public_key variable
public_key = \"ssh-rsa AAAAB3NzaC1yc2EAAAADAQA... your-key-here\"
```

### 4. Deploy
```bash
# Initialize Terraform
terraform init

# Plan deployment
terraform plan

# Apply changes
terraform apply
```

### 5. Access Application
```bash
# Get application URL
terraform output application_url

# Example: http://cicd-dashboard-dev-alb-123456789.us-east-1.elb.amazonaws.com
```

---

## 🌍 **Environment Setup**

### Development Environment
**Optimized for cost and development speed**

```bash
cd infra/environments/dev
```

**Configuration:**
- **Instance Type**: t3.small
- **RDS**: db.t3.micro (Free Tier eligible)
- **High Availability**: Single AZ
- **Backup Retention**: 1 day
- **Encryption**: Disabled (cost savings)
- **Monitoring**: Basic only

### Production Environment
**Optimized for reliability and performance**

```bash
cd infra/environments/prod
```

**Configuration:**
- **Instance Type**: t3.medium
- **RDS**: db.t3.medium with Multi-AZ
- **High Availability**: Multi-AZ deployment
- **Backup Retention**: 30 days
- **Encryption**: Enabled
- **Monitoring**: Enhanced monitoring + Performance Insights
- **Read Replica**: Enabled

---

## 🚀 **Deployment Steps**

### Step 1: AWS Authentication
```bash
# Configure AWS CLI
aws configure

# Verify authentication
aws sts get-caller-identity
```

### Step 2: Choose Environment
```bash
# Development
cd infra/environments/dev

# Production
cd infra/environments/prod
```

### Step 3: Configure Variables
```bash
# Edit terraform.tfvars
vim terraform.tfvars

# Required variables to set:
public_key = \"your-ssh-public-key-here\"
allowed_ssh_cidrs = [\"your-ip-range/32\"]  # For security
```

### Step 4: Initialize Terraform
```bash
terraform init
```

### Step 5: Plan Deployment
```bash
# Review planned changes
terraform plan

# Save plan for review
terraform plan -out=tfplan
```

### Step 6: Apply Configuration
```bash
# Apply the plan
terraform apply tfplan

# Or apply directly
terraform apply -auto-approve
```

### Step 7: Verify Deployment
```bash
# Get outputs
terraform output

# Test application
curl $(terraform output -raw application_url)

# Test API
curl $(terraform output -raw health_check_url)
```

---

## 🌐 **Accessing the Application**

### Application URLs
```bash
# Frontend Dashboard
terraform output application_url
# Example: http://cicd-dashboard-dev-alb-123456789.us-east-1.elb.amazonaws.com

# API Endpoint
terraform output api_url
# Example: http://cicd-dashboard-dev-alb-123456789.us-east-1.elb.amazonaws.com/api

# Health Check
terraform output health_check_url
# Example: http://cicd-dashboard-dev-alb-123456789.us-east-1.elb.amazonaws.com/api/monitoring/health
```

### SSH Access to Instances
```bash
# Get Auto Scaling Group instances
aws ec2 describe-instances --filters \"Name=tag:aws:autoscaling:groupName,Values=$(terraform output -raw autoscaling_group_name)\" --query \"Reservations[].Instances[].PublicIpAddress\" --output text

# SSH to instance (if public access configured)
ssh -i ~/.ssh/cicd-dashboard-dev ec2-user@<instance-ip>

# Check application status
sudo docker ps
sudo docker logs cicd-dashboard-frontend
```

### Database Access
```bash
# Get database endpoint
terraform output database_endpoint

# Get credentials from Secrets Manager
aws secretsmanager get-secret-value --secret-id $(terraform output -raw secrets_manager_secret_name) --query SecretString --output text | jq -r .password

# Connect via psql (from within VPC)
psql -h $(terraform output -raw database_endpoint) -U dbadmin -d $(terraform output -raw database_name)
```

---

## 📊 **Monitoring & Maintenance**

### CloudWatch Monitoring
```bash
# View EC2 metrics
aws cloudwatch get-metric-statistics --namespace AWS/EC2 --metric-name CPUUtilization --dimensions Name=AutoScalingGroupName,Value=$(terraform output -raw autoscaling_group_name) --start-time 2024-01-01T00:00:00Z --end-time $(date -u +%Y-%m-%dT%H:%M:%SZ) --period 3600 --statistics Average

# View RDS metrics
aws cloudwatch get-metric-statistics --namespace AWS/RDS --metric-name CPUUtilization --dimensions Name=DBInstanceIdentifier,Value=$(terraform output database_endpoint | cut -d. -f1) --start-time 2024-01-01T00:00:00Z --end-time $(date -u +%Y-%m-%dT%H:%M:%SZ) --period 3600 --statistics Average
```

### Auto Scaling Events
```bash
# View scaling activities
aws autoscaling describe-scaling-activities --auto-scaling-group-name $(terraform output -raw autoscaling_group_name)
```

### Application Health
```bash
# Health check endpoint
curl -s $(terraform output -raw health_check_url) | jq .

# System metrics
curl -s $(terraform output -raw api_url)/monitoring/system | jq .
```

### Log Analysis
```bash
# SSH to instance and check logs
ssh -i ~/.ssh/cicd-dashboard-dev ec2-user@<instance-ip>

# Check deployment logs
sudo cat /var/log/user-data.log

# Check application logs
sudo docker logs cicd-dashboard-backend
sudo docker logs cicd-dashboard-frontend
```

---

## 🔧 **Troubleshooting**

### Common Issues

#### 1. Application Not Loading
```bash
# Check load balancer targets
aws elbv2 describe-target-health --target-group-arn $(terraform output -raw target_group_arn)

# Check instance health
curl -s http://<instance-ip>:3000

# Check user data execution
ssh -i ~/.ssh/cicd-dashboard-dev ec2-user@<instance-ip>
sudo tail -f /var/log/user-data.log
```

#### 2. Database Connection Issues
```bash
# Test database connectivity from EC2
telnet $(terraform output -raw database_endpoint) 5432

# Check security group rules
aws ec2 describe-security-groups --group-ids <rds-security-group-id>
```

#### 3. Auto Scaling Issues
```bash
# Check Auto Scaling Group status
aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names $(terraform output -raw autoscaling_group_name)

# View scaling policies
aws autoscaling describe-policies --auto-scaling-group-name $(terraform output -raw autoscaling_group_name)
```

#### 4. Terraform State Issues
```bash
# Refresh state
terraform refresh

# Import existing resources (if needed)
terraform import aws_instance.example i-1234567890abcdef0

# View current state
terraform show
```

### Performance Optimization
```bash
# Enable detailed monitoring
aws ec2 monitor-instances --instance-ids <instance-id>

# Optimize database performance
# - Enable Performance Insights (production)
# - Adjust parameter group settings
# - Monitor slow query logs
```

---

## 🧹 **Cleanup**

### Destroy Infrastructure
```bash
# Plan destruction
terraform plan -destroy

# Destroy all resources
terraform destroy -auto-approve

# Verify cleanup
aws ec2 describe-instances --filters \"Name=tag:Project,Values=cicd-dashboard\"
aws rds describe-db-instances --query 'DBInstances[?contains(DBInstanceIdentifier, `cicd-dashboard`)]'
```

### Manual Cleanup (if needed)
```bash
# Remove any remaining resources
# - EC2 instances
# - Load balancers
# - RDS instances
# - VPC components
# - IAM roles/policies
# - Secrets Manager secrets
```

---

## 🤖 **AI-Native Workflow**

This infrastructure was developed using AI-native tools and practices:

### AI Tools Used
1. **Claude/ChatGPT**: Architecture design and code generation
2. **GitHub Copilot**: Code completion and optimization
3. **Cursor AI**: Real-time code suggestions

### AI-Generated Components
- **Terraform Modules**: VPC, EC2, RDS modules
- **User Data Scripts**: Application deployment automation
- **Security Groups**: Network security configuration
- **Auto Scaling Policies**: Dynamic scaling rules
- **CloudWatch Alarms**: Monitoring and alerting

### Prompts Used
See [`prompts.md`](./prompts.md) for detailed AI prompts and interactions used to build this infrastructure.

---

## 📞 **Support & Resources**

### Documentation
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [AWS RDS Documentation](https://docs.aws.amazon.com/rds/)

### Monitoring
- **CloudWatch Dashboard**: Monitor all resources
- **AWS Systems Manager**: Instance management
- **AWS Secrets Manager**: Credential management

### Security Best Practices
- Regular security updates
- Monitor access logs
- Rotate database credentials
- Review security groups regularly

---

## 📊 **Cost Optimization**

### Development Environment
- **Estimated Monthly Cost**: $50-100 USD
- **Cost Factors**: t3.small instances, db.t3.micro, single AZ

### Production Environment  
- **Estimated Monthly Cost**: $200-400 USD
- **Cost Factors**: t3.medium instances, Multi-AZ RDS, enhanced monitoring

### Cost Monitoring
```bash
# Enable cost allocation tags
aws ce get-rightsizing-recommendation --service EC2-Instance

# Set up billing alerts
aws budgets create-budget --account-id <account-id> --budget '{\"BudgetName\":\"cicd-dashboard\",\"BudgetLimit\":{\"Amount\":\"200\",\"Unit\":\"USD\"},\"TimeUnit\":\"MONTHLY\",\"BudgetType\":\"COST\"}'
```

---
