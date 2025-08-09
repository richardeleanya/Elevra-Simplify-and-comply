# ADR-0002: Authentication and RBAC Module Design

## Context

Enterprise-grade security and role-based access control (RBAC) is critical for Simplify & Comply. The system must provide secure authentication, robust password hashing, JWT-based stateless authentication, refresh tokens, and granular permission checks, all in a hexagonal architecture.

## Decision

- **Entities**: User, Role, Permission modeled with TypeORM, UUID PKs, enums for roles/permissions.
- **Value Objects**: Password (hashed, bcrypt), JWTToken (access + refresh).
- **Authentication**: 
  - Registration hashes passwords and checks for duplicates.
  - Login validates credentials, issues JWT and refresh tokens.
  - JWT secret is from environment.
  - Passport strategies: Local (login), JWT (API guards).
  - Refresh endpoint issues new tokens.
- **RBAC**: Roles and permissions modeled as entities; guards/enums for enforcement.
- **DTOs/Validation**: class-validator for strong input validation.
- **Security**: bcrypt password hashing, helmet and csurf globally, JWT expiration, and role-based guards.
- **Testing**: Unit and integration tests for all critical flows.
- **Exception Handling**: Custom exceptions for user exists, invalid credentials, and expired JWTs.
- **Hexagonal separation**: Domain, application, infrastructure layers; only interfaces cross boundaries.
- **Dependency injection**: All services and repos via NestJS DI.

## Alternatives Considered

- Session-based authentication (not chosen for stateless scaling reasons).
- OAuth (future roadmap).
- Using a third-party auth service (e.g. Auth0; kept in backlog for future extensibility).
- No refresh tokens (rejected due to security/usability tradeoffs).

## Consequences

- Enables secure, scalable, and testable authentication and RBAC.
- Strict layering supports maintainability and testability.
- Easily extensible for SSO/OAuth in future.

## References

- [NestJS Auth docs](https://docs.nestjs.com/security/authentication)
- [bcrypt npm](https://www.npmjs.com/package/bcrypt)
- [Passport.js](http://www.passportjs.org/)
- [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)