# Development Environment Variables

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "cicd-dashboard"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "owner" {
  description = "Owner of the resources"
  type        = string
  default     = "DevOps Team"
}

# VPC Configuration
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.20.0/24"]
}

variable "allowed_ssh_cidrs" {
  description = "CIDR blocks allowed to SSH to EC2 instances"
  type        = list(string)
  default     = ["0.0.0.0/0"] # Restrict this for security
}

# Application Configuration
variable "app_port" {
  description = "Port on which the application runs"
  type        = number
  default     = 3000
}

variable "app_version" {
  description = "Version of the application"
  type        = string
  default     = "1.0.0-dev"
}

# EC2 Configuration
variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.small" # Cost-effective for dev
}

variable "public_key" {
  description = "Public key for EC2 key pair"
  type        = string
  # Generate with: ssh-keygen -t rsa -b 4096 -f ~/.ssh/cicd-dashboard-dev
  default = ""
}

variable "min_size" {
  description = "Minimum size of the Auto Scaling Group"
  type        = number
  default     = 1
}

variable "max_size" {
  description = "Maximum size of the Auto Scaling Group"
  type        = number
  default     = 2
}

variable "desired_capacity" {
  description = "Desired capacity of the Auto Scaling Group"
  type        = number
  default     = 1
}

# Database Configuration
variable "database_name" {
  description = "Name of the database"
  type        = string
  default     = "cicd_dashboard_dev"
}

variable "master_username" {
  description = "Master username for the database"
  type        = string
  default     = "dbadmin"
}

variable "postgres_version" {
  description = "PostgreSQL version"
  type        = string
  default     = "15.4"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro" # Free tier eligible
}

variable "db_allocated_storage" {
  description = "Initial allocated storage in GB"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "Maximum allocated storage for auto-scaling in GB"
  type        = number
  default     = 50
}

variable "db_storage_encrypted" {
  description = "Whether to encrypt storage"
  type        = bool
  default     = false # For cost savings in dev
}

variable "db_backup_retention_period" {
  description = "Backup retention period in days"
  type        = number
  default     = 1 # Minimal for dev
}

variable "db_multi_az" {
  description = "Whether to create a Multi-AZ deployment"
  type        = bool
  default     = false # Single AZ for cost savings in dev
}

variable "db_deletion_protection" {
  description = "Whether to enable deletion protection"
  type        = bool
  default     = false # Allow deletion in dev
}

variable "db_skip_final_snapshot" {
  description = "Whether to skip final snapshot on deletion"
  type        = bool
  default     = true # Skip snapshot in dev
}

variable "db_monitoring_interval" {
  description = "Enhanced monitoring interval (0, 1, 5, 10, 15, 30, 60)"
  type        = number
  default     = 0 # No enhanced monitoring for cost savings
}

variable "db_performance_insights_enabled" {
  description = "Whether to enable Performance Insights"
  type        = bool
  default     = false # Disabled for cost savings in dev
}

variable "create_read_replica" {
  description = "Whether to create a read replica"
  type        = bool
  default     = false # No read replica in dev
}
