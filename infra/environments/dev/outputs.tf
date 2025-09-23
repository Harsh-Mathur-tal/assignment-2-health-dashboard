# Development Environment Outputs

# Application URLs
output "application_url" {
  description = "URL to access the CI/CD Dashboard application"
  value       = module.ec2.application_url
}

output "api_url" {
  description = "URL to access the API"
  value       = module.ec2.api_url
}

output "health_check_url" {
  description = "URL for health check"
  value       = module.ec2.health_check_url
}

# Load Balancer Information
output "load_balancer_dns_name" {
  description = "DNS name of the load balancer"
  value       = module.ec2.load_balancer_dns_name
}

output "load_balancer_arn" {
  description = "ARN of the load balancer"
  value       = module.ec2.load_balancer_arn
}

# VPC Information
output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = module.vpc.private_subnet_ids
}

# Database Information
output "database_endpoint" {
  description = "RDS instance endpoint"
  value       = module.rds.db_instance_endpoint
}

output "database_port" {
  description = "RDS instance port"
  value       = module.rds.db_instance_port
}

output "database_name" {
  description = "Database name"
  value       = module.rds.db_instance_name
}

output "secrets_manager_secret_name" {
  description = "Name of the Secrets Manager secret containing database credentials"
  value       = module.rds.secrets_manager_secret_name
}

# EC2 Information
output "autoscaling_group_name" {
  description = "Name of the Auto Scaling Group"
  value       = module.ec2.autoscaling_group_name
}

output "key_pair_name" {
  description = "Name of the key pair"
  value       = module.ec2.key_pair_name
}

# Resource Summary
output "resource_summary" {
  description = "Summary of deployed resources"
  value = {
    environment              = var.environment
    project_name            = var.project_name
    region                  = var.aws_region
    vpc_id                  = module.vpc.vpc_id
    application_url         = module.ec2.application_url
    database_endpoint       = module.rds.db_instance_endpoint
    load_balancer_dns       = module.ec2.load_balancer_dns_name
    autoscaling_group       = module.ec2.autoscaling_group_name
  }
}
