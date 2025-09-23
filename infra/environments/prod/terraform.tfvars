# Production Environment Configuration
# This file contains environment-specific variable values for the production environment

# Basic Configuration
aws_region   = "us-east-1"
project_name = "cicd-dashboard"
environment  = "prod"
owner        = "DevOps Team"

# Application Configuration
app_port    = 3000
app_version = "1.0.0"

# VPC Configuration (Different CIDR to avoid conflicts with dev)
vpc_cidr = "10.1.0.0/16"
public_subnet_cidrs = [
  "10.1.1.0/24",  # us-east-1a
  "10.1.2.0/24",  # us-east-1b
  "10.1.3.0/24"   # us-east-1c
]
private_subnet_cidrs = [
  "10.1.10.0/24", # us-east-1a
  "10.1.20.0/24", # us-east-1b
  "10.1.30.0/24"  # us-east-1c
]

# Security Configuration (Restricted for production)
# IMPORTANT: Replace with your actual IP range or VPN CIDR
allowed_ssh_cidrs = ["10.1.0.0/16"] # Only from within VPC

# EC2 Configuration (Production-grade)
instance_type    = "t3.medium"    # More resources
min_size         = 2              # Minimum for HA
max_size         = 6              # Scale up capability
desired_capacity = 3              # Start with 3 instances

# IMPORTANT: Add your production public key here
# Generate with: ssh-keygen -t rsa -b 4096 -f ~/.ssh/cicd-dashboard-prod
# Then: cat ~/.ssh/cicd-dashboard-prod.pub
public_key = ""

# Database Configuration (Production-grade with HA and monitoring)
database_name                   = "cicd_dashboard_prod"
master_username                 = "dbadmin"
postgres_version               = "15.4"
db_instance_class              = "db.t3.medium"      # More resources
db_allocated_storage           = 100                 # Larger storage
db_max_allocated_storage       = 1000               # Auto-scaling limit
db_storage_encrypted           = true                # Always encrypt
db_backup_retention_period     = 30                 # 30 days backup
db_multi_az                    = true                # High availability
db_deletion_protection         = true                # Prevent deletion
db_skip_final_snapshot         = false               # Always snapshot
db_monitoring_interval         = 60                 # Enhanced monitoring
db_performance_insights_enabled = true              # Performance monitoring
create_read_replica            = true                # Read replica
read_replica_instance_class    = "db.t3.medium"     # Same as primary
