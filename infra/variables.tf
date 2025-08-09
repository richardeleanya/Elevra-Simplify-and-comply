variable "project" {
  description = "Project name"
  type        = string
  default     = "simplify-comply"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-2"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "azs" {
  description = "Availability Zones"
  type        = list(string)
  default     = ["eu-west-2a", "eu-west-2b", "eu-west-2c"]
}

variable "public_subnets" {
  description = "Public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "private_subnets" {
  description = "Private subnets"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
}

variable "db_name" {
  description = "DB name"
  type        = string
  default     = "simplifycomply"
}

variable "db_username" {
  description = "DB username"
  type        = string
  default     = "admin"
}

variable "db_password" {
  description = "DB password"
  type        = string
  sensitive   = true
}

variable "ssh_key_name" {
  description = "SSH key name for EKS nodes"
  type        = string
  default     = ""
}