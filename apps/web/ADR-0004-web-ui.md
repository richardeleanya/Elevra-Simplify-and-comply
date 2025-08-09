# ADR-0004: Web UI Authentication and Dashboard Scaffolding

## Context

The web UI must provide secure, accessible, and responsive login and dashboard experiences for enterprise users. Tech stack must ensure seamless integration with the backend API, strong accessibility, and enterprise security.

## Decision

- **Next.js 13** (app directory, TypeScript, React 18) for modern, maintainable SPA/SSR.
- **Material-UI** + **Tailwind CSS** for rapid, accessible, and responsive design.
- **/login** page: form with client-side validation, ARIA, WCAG 2.1 AA, calls `/api/auth/login`.
- **/dashboard** page: protected with Next.js middleware that checks JWT cookie; responsive layout; placeholder for Compliance Health Score; navigation for payroll/compliance.
- **API proxy**: `/pages/api/auth/login` and `/pages/api/auth/profile` proxy to backend API workspace; `/next.config.js` rewrites enable seamless API calls.
- **Accessibility**: ARIA labels, semantic HTML, color contrast, form focus states.
- **Testing**: Unit tests for form validation (Jest + Testing Library).
- **Security**: JWT tokens stored in HttpOnly, Secure, SameSite cookies; CSRF prevention via backend; Next.js middleware guards; explicit error handling.

## Alternatives Considered

- Storing JWT in localStorage (rejected: XSS risk).
- Using only Tailwind or only Material-UI (chosen: both for flexibility).
- Disabling SSR (kept SSR for SEO and performance).

## Consequences

- The solution is secure, accessible, and follows enterprise UI best practices.
- Easily extensible for additional protected routes and features.
- Accessible and performant by default.

## References

- [Next.js 13 App Directory Docs](https://nextjs.org/docs/app)
- [Material-UI](https://mui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/)
- [Next.js Middleware Auth](https://nextjs.org/docs/app/building-your-application/routing/middleware)