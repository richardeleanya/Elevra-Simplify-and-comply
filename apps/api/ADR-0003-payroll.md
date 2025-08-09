# ADR-0003: Payroll Domain and Payslip Calculation

## Context

Payroll and payslip generation is a critical function for Simplify & Comply. It must handle complex pay structures, decimal precision, and be maintainable, testable, and secure.

## Decision

- **Domain Entities**: SalaryPolicy, Payroll, Payslip (all with UUID PKs, financials as decimal/numeric).
- **Value Objects**: DecimalVO for precise, safe decimal handling.
- **Use Cases**: 
  - CalculatePayslip: Computes gross pay, breakdown by shift type.
  - GeneratePayslip: Persists to DB via repository.
  - ListPayslips: Queries by user.
- **Persistence**: TypeORM repositories, PostgreSQL numeric columns.
- **Validation**: DTOs validated with class-validator.
- **Error Handling**: Custom exceptions for invalid data and calculation errors.
- **Testing**: Unit and integration tests for all service and repo flows.
- **Architecture**: Hexagonal, strict DDD, TypeScript strict, SOLID, DI everywhere.

## Alternatives Considered

- Using float/double for financials (rejected due to precision errors).
- Using a third-party payroll API (kept for future extensibility).
- No value object for decimals (rejected for lack of safety).

## Consequences

- Ensures precise, extensible, and secure payroll calculations.
- Strict layering and testing support enterprise maintainability and auditability.
- Ready for future extension (statutory deductions, pension, etc).

## References

- [TypeORM column types](https://typeorm.io/entities#column-types)
- [NestJS best practices](https://docs.nestjs.com/)
- [OWASP: Using decimals for financials](https://cheatsheetseries.owasp.org/cheatsheets/Number_Handling_Cheat_Sheet.html)