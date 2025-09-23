# Development Environment Configuration
# This file contains environment-specific variable values for the dev environment

# Basic Configuration
aws_region   = "us-east-1"
project_name = "cicd-dashboard"
environment  = "dev"
owner        = "DevOps Team"

# Application Configuration
app_port    = 3000
app_version = "1.0.0-dev"

# VPC Configuration
vpc_cidr = "10.0.0.0/16"
public_subnet_cidrs = [
  "10.0.1.0/24",  # us-east-1a
  "10.0.2.0/24"   # us-east-1b
]
private_subnet_cidrs = [
  "10.0.10.0/24", # us-east-1a
  "10.0.20.0/24"  # us-east-1b
]

# Security Configuration
# IMPORTANT: Replace with your actual IP range for security
allowed_ssh_cidrs = ["0.0.0.0/0"] # Change this to your IP range

# EC2 Configuration
instance_type    = "t3.small"
min_size         = 1
max_size         = 2
desired_capacity = 1

# IMPORTANT: Add your public key here
# Generate with: ssh-keygen -t rsa -b 4096 -f ~/.ssh/cicd-dashboard-dev
# Then: cat ~/.ssh/cicd-dashboard-dev.pub
public_key = ""

# Database Configuration (Cost-optimized for development)
database_name                   = "cicd_dashboard_dev"
master_username                 = "dbadmin"
postgres_version               = "15.4"
db_instance_class              = "db.t3.micro"  # Free tier eligible
db_allocated_storage           = 20
db_max_allocated_storage       = 50
db_storage_encrypted           = false          # Cost savings
db_backup_retention_period     = 1             # Minimal backup
db_multi_az                    = false          # Single AZ for cost
db_deletion_protection         = false         # Allow deletion
db_skip_final_snapshot         = true          # No snapshot needed
db_monitoring_interval         = 0             # No enhanced monitoring
db_performance_insights_enabled = false        # Cost savings
create_read_replica            = false         # No replica needed
