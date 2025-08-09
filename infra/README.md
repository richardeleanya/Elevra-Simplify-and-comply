# Simplify & Comply Infra

## What is provisioned

- AWS VPC (3 AZs, public/private subnets, NAT)
- AWS RDS Postgres (not publicly accessible)
- AWS EKS Cluster (Kubernetes 1.28, managed node group)
- Security groups and subnet groups

## Usage

- Set your AWS credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`).
- Create a `terraform.tfvars` or use `TF_VAR_*` env vars for sensitive values (`db_password`).
- Run:

  ```sh
  terraform init
  terraform apply
  ```

## Outputs

- VPC, Subnets, EKS Cluster, RDS endpoint and port.

## Security

- RDS not publicly accessible, security groups restrict access.
- Nodegroup SSH via provided key only (optional).

## Testing

- See `test/` for TerraTest integration tests.