# EC2 Module Outputs

output "load_balancer_dns_name" {
  description = "DNS name of the load balancer"
  value       = aws_lb.app.dns_name
}

output "load_balancer_zone_id" {
  description = "Zone ID of the load balancer"
  value       = aws_lb.app.zone_id
}

output "load_balancer_arn" {
  description = "ARN of the load balancer"
  value       = aws_lb.app.arn
}

output "target_group_arn" {
  description = "ARN of the target group"
  value       = aws_lb_target_group.app.arn
}

output "autoscaling_group_name" {
  description = "Name of the Auto Scaling Group"
  value       = aws_autoscaling_group.app.name
}

output "autoscaling_group_arn" {
  description = "ARN of the Auto Scaling Group"
  value       = aws_autoscaling_group.app.arn
}

output "launch_template_id" {
  description = "ID of the launch template"
  value       = aws_launch_template.app.id
}

output "key_pair_name" {
  description = "Name of the key pair"
  value       = aws_key_pair.main.key_name
}

output "application_url" {
  description = "URL to access the application"
  value       = "http://${aws_lb.app.dns_name}"
}

output "api_url" {
  description = "URL to access the API"
  value       = "http://${aws_lb.app.dns_name}/api"
}

output "health_check_url" {
  description = "URL for health check"
  value       = "http://${aws_lb.app.dns_name}/api/monitoring/health"
}
