# ADR-0005: Infrastructure (AWS/Terraform) Design

## Context

We require secure, scalable, cloud-native infrastructure to run the Simplify & Comply SaaS platform, with Kubernetes for API and AI services, managed Postgres, and best-practice network security.

## Decision

- **AWS** for UK/EU data residency, mature managed services (VPC, EKS, RDS).
- **Terraform** for infra-as-code, modular design, reproducibility, and auditability.
- **VPC**: 3 AZs, public/private subnets, NAT, for high availability and security.
- **RDS Postgres**: managed, not public, encrypted, with variable-based secrets.
- **EKS**: Managed Kubernetes 1.28, managed node group, recommended resource limits for cost/security.
- **Security groups**: Least-privilege, outputs restricted to internal consumers.
- **Outputs**: Key IDs, endpoints, subnets, for downstream automation.
- **Testing**: TerraTest integration tests in Go, checking all outputs and basic resource reachability.

## Alternatives Considered

- Manual AWS provisioning (rejected: non-reproducible).
- GCP/Azure (kept for future multi-cloud expansion).
- Serverless-only (rejected: need for long-running AI containers).
- RDS public access (rejected: security risk).

## Consequences

- Secure and HA by default, easy to extend, one-command deploy.
- Supports all future scaling and compliance needs.
- Automated testing via TerraTest.

## References

- [Terraform AWS VPC Module](https://github.com/terraform-aws-modules/terraform-aws-vpc)
- [Terraform AWS EKS Module](https://github.com/terraform-aws-modules/terraform-aws-eks)
- [Terraform AWS RDS Module](https://github.com/terraform-aws-modules/terraform-aws-rds)
- [TerraTest](https://terratest.gruntwork.io/)