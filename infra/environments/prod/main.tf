# Production Environment Configuration
# This configuration deploys the CI/CD Dashboard to AWS Production environment

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.4"
    }
  }

  # Uncomment and configure for remote state storage
  # backend "s3" {
  #   bucket         = "your-terraform-state-bucket-prod"
  #   key            = "cicd-dashboard/prod/terraform.tfstate"
  #   region         = "us-east-1"
  #   encrypt        = true
  #   dynamodb_table = "terraform-state-lock-prod"
  # }
}

# Configure AWS Provider
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = local.common_tags
  }
}

# Local values for consistent resource naming and tagging
locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
    Owner       = var.owner
    Purpose     = "CI/CD Pipeline Health Dashboard"
    CostCenter  = "Production"
    Compliance  = "Required"
    Backup      = "Daily"
  }
}

# VPC Module
module "vpc" {
  source = "../../modules/vpc"

  project_name           = var.project_name
  environment           = var.environment
  vpc_cidr              = var.vpc_cidr
  public_subnet_cidrs   = var.public_subnet_cidrs
  private_subnet_cidrs  = var.private_subnet_cidrs
  allowed_ssh_cidrs     = var.allowed_ssh_cidrs
  app_port              = var.app_port
  common_tags           = local.common_tags
}

# RDS Module
module "rds" {
  source = "../../modules/rds"

  project_name                = var.project_name
  environment                = var.environment
  private_subnet_ids         = module.vpc.private_subnet_ids
  security_group_id          = module.vpc.rds_security_group_id
  database_name              = var.database_name
  master_username            = var.master_username
  postgres_version           = var.postgres_version
  instance_class             = var.db_instance_class
  allocated_storage          = var.db_allocated_storage
  max_allocated_storage      = var.db_max_allocated_storage
  storage_encrypted          = var.db_storage_encrypted
  backup_retention_period    = var.db_backup_retention_period
  multi_az                   = var.db_multi_az
  deletion_protection        = var.db_deletion_protection
  skip_final_snapshot        = var.db_skip_final_snapshot
  monitoring_interval        = var.db_monitoring_interval
  performance_insights_enabled = var.db_performance_insights_enabled
  create_read_replica        = var.create_read_replica
  read_replica_instance_class = var.read_replica_instance_class
  common_tags                = local.common_tags
}

# EC2 Module
module "ec2" {
  source = "../../modules/ec2"

  project_name              = var.project_name
  environment              = var.environment
  instance_type            = var.instance_type
  public_key               = var.public_key
  vpc_id                   = module.vpc.vpc_id
  subnet_ids               = module.vpc.private_subnet_ids
  public_subnet_ids        = module.vpc.public_subnet_ids
  security_group_id        = module.vpc.ec2_security_group_id
  alb_security_group_id    = module.vpc.alb_security_group_id
  min_size                 = var.min_size
  max_size                 = var.max_size
  desired_capacity         = var.desired_capacity
  app_port                 = var.app_port
  app_version              = var.app_version
  
  # Database connection parameters
  db_host                  = module.rds.db_instance_endpoint
  db_port                  = tostring(module.rds.db_instance_port)
  db_name                  = module.rds.db_instance_name
  db_user                  = module.rds.db_instance_username
  db_password              = module.rds.db_instance_password
  
  common_tags              = local.common_tags

  depends_on = [module.vpc, module.rds]
}
