# Security Policy

## Supported Versions

Security fixes are applied to the latest `main` branch.

## Reporting a Vulnerability

- Do not create public issues for security vulnerabilities.
- Report findings by email to `security-contact@enrollurm.com`.
- Include reproduction steps, affected endpoint/page, impact, and suggested remediation.

Response targets:

- Initial acknowledgement: within 2 business days
- Triage and severity assessment: within 5 business days
- Remediation timeline: based on severity

## Severity Model

- **Critical**: Remote compromise, auth bypass, data exfiltration at scale
- **High**: Stored/reflected XSS, severe injection, sensitive data exposure
- **Medium**: Misconfiguration with constrained exploitability
- **Low**: Hardening or best-practice gaps with limited risk

## Security Controls in This Repository

- Centralized API hardening in `middleware/security.js`
- Centralized error handling and redaction in `middleware/errorHandler.js`
- Environment validation in `config/env.validation.js`
- Strict Vercel response headers in `vercel.json`
- Dependency and secret checks in CI (`.github/workflows/security.yml`)
- Local security verification script (`scripts/security-audit.sh`)

## Responsible Disclosure

- Provide reasonable time for validation and remediation before disclosure.
- Avoid accessing/modifying data beyond proof-of-concept scope.
