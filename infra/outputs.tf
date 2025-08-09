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