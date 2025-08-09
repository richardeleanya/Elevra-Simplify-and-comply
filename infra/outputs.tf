output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "public_subnets" {
  description = "Public subnets"
  value       = module.vpc.public_subnets
}

output "private_subnets" {
  description = "Private subnets"
  value       = module.vpc.private_subnets
}

output "eks_cluster_name" {
  value = module.eks.cluster_name
}

output "rds_endpoint" {
  value = module.rds.db_instance_endpoint
}

output "rds_port" {
  value = module.rds.db_instance_port
}

output "api_jwt_secret_ssm_name" {
  value = aws_ssm_parameter.api_jwt_secret.name
}
output "api_db_password_ssm_name" {
  value = aws_ssm_parameter.api_db_password.name
}
output "api_sentry_dsn_ssm_name" {
  value = aws_ssm_parameter.api_sentry_dsn.name
}
output "web_sentry_dsn_ssm_name" {
  value = aws_ssm_parameter.web_sentry_dsn.name
}
output "mobile_sentry_dsn_ssm_name" {
  value = aws_ssm_parameter.mobile_sentry_dsn.name
}