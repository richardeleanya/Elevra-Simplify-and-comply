# Architecture Overview: Simplify & Comply Platform

## High-Level Structure

```
[ Web (Next.js) ]   [ Mobile (Expo) ]
         |                |
         v                v
     [ API Gateway / ALB ]
              |
     [ NestJS API (Hexagonal) ]
              |
   [ PostgreSQL | SSM | Sentry | Prometheus ]
              |
      [ AWS ECS (Fargate) + CodeDeploy ]
              |
      [ VPC, EKS, S3, Terraform ]
```

## Module Breakdown

- **API (NestJS):**
  - Hexagonal/DDD: Domain (entities/value objects), Application (use cases/services), Infrastructure (controllers/repos/adapters).
  - Auth, Payroll, Compliance, Pension, RTI, Salary Policy modules.
  - Swagger/OpenAPI at `/docs`.
  - Sentry for error tracking, Prometheus `/metrics` for monitoring.
  - Dynamic secrets via AWS SSM Parameter Store.

- **Web (Next.js 13):**
  - App router, SSR/CSR, Material UI/Tailwind.
  - Cypress E2E, Axe a11y, Sentry for client/server errors.

- **Mobile (Expo):**
  - React Native, SecureStore for tokens, Detox E2E, Sentry for errors.

- **Infra (Terraform):**
  - AWS VPC, EKS/ECS, RDS, ALB, CodeDeploy (blue/green), SSM, Prometheus, Sentry integration.

## Decision Rationale

- **Security:** CodeQL, npm audit, Sentry, blue/green deploys, dynamic secrets.
- **Observability:** Sentry (app error tracking), Prometheus (metrics/alerts).
- **Developer Velocity:** Monorepo, strict typing, CI/CD, E2E, API docs.
- **Compliance:** ADRs for all major decisions (see `api/ADR-*.md`).
- **Accessibility:** WCAG 2.1 AA, CI a11y checks, mobile a11y engine.

## References

- See ADRs in `api/ADR-*` for all major architecture and technology decisions.