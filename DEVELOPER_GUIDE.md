# Developer Guide: Simplify & Comply

## Project Overview

Simplify & Comply is an enterprise-grade HR, Payroll, and Compliance automation platform for the UK care sector.  
It is built as a polyrepo with API (NestJS), Web (Next.js), Mobile (Expo), and Terraform for AWS infrastructure.

---

## Local Setup

1. **Clone the repo**  
   ```
   git clone <repo-url>
   cd Elevra-Simplify-and-comply
   ```

2. **Install dependencies**  
   - API: `cd api && npm install`
   - Web: `cd apps/web && npm install`
   - Mobile: `cd apps/mobile && npm install`

3. **Setup Environment**  
   - Copy `.env.example` to `.env` in each workspace (API, Web, Mobile) and fill in values (or use AWS SSM Parameter Store in prod).

4. **Run Local Dev**  
   - API: `npm run start:dev` (default: http://localhost:3000)
   - Web: `npm run dev` (default: http://localhost:3001)
   - Mobile: `expo start` (run on device/simulator)

---

## Testing

- **Unit tests (API):** `cd api && npm run test`
- **Integration tests (API):** `cd api && npm run test:integration`
- **Web unit tests:** `cd apps/web && npm run test`
- **Web E2E (Cypress):** `npm run e2e:run`
- **Mobile E2E (Detox):** `npm run e2e:test`

---

## CI/CD Overview

- All pushes/PRs are linted, tested, and scanned (CodeQL, npm audit).
- E2E tests: Cypress (Web), Detox (Mobile) run in CI.
- Sentry and Prometheus integrated for observability.
- On merge to main, Docker images are built and pushed to AWS ECR.
- Blue/green deploys via AWS CodeDeploy and ECS.
- Terraform infra changes are planned/applied via GitHub Actions.

---

## Terraform & Deployment

- Terraform code is in `infra/` (VPC, EKS/ECS, RDS, CodeDeploy, ALB, SSM Parameter Store).
- To deploy:  
  - `cd infra`
  - `terraform init`
  - `terraform plan -out=plan`
  - `terraform apply plan`
- Production pipeline runs Terraform automatically.

---

## Documentation

- API docs: [http://localhost:3000/docs](http://localhost:3000/docs)
- Architecture: see `ARCHITECTURE.md` and ADRs in `api/ADR-*.md`
- For questions, see the README or open an issue.