#!/usr/bin/env bash

set -u

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

STAGING_URL="${1:-}"
DOMAIN="${2:-}"
EXIT_CODE=0

run_check() {
  local title="$1"
  shift

  echo ""
  echo "=== ${title} ==="

  if "$@"; then
    echo "[PASS] ${title}"
  else
    echo "[FAIL] ${title}"
    EXIT_CODE=1
  fi
}

run_optional_check() {
  local title="$1"
  shift

  echo ""
  echo "=== ${title} ==="

  if "$@"; then
    echo "[PASS] ${title}"
  else
    echo "[WARN] ${title} (non-blocking)"
  fi
}

run_check "Dependency audit" npm audit --audit-level=moderate
run_check "Type check" npm run typecheck

if command -v gitleaks >/dev/null 2>&1; then
  run_check "Secrets scan (gitleaks)" gitleaks detect --source . --verbose
elif command -v docker >/dev/null 2>&1; then
  run_optional_check "Secrets scan (gitleaks via docker)" \
    docker run --rm -v "$ROOT_DIR:/repo" zricethezav/gitleaks:latest detect --source /repo --verbose
else
  echo "[WARN] Secrets scan skipped: install gitleaks or docker"
fi

if [[ -n "$STAGING_URL" ]]; then
  if command -v docker >/dev/null 2>&1; then
    run_optional_check "OWASP ZAP baseline" docker run -t owasp/zap2docker-stable zap-baseline.py -t "$STAGING_URL"
  else
    echo "[WARN] OWASP ZAP skipped: docker not installed"
  fi

  run_optional_check "Lighthouse best-practices" npx --yes lighthouse "$STAGING_URL" --only-categories=best-practices --quiet --chrome-flags="--headless --no-sandbox"
else
  echo "[WARN] Lighthouse and ZAP skipped: no staging URL provided"
fi

if [[ -n "$DOMAIN" ]]; then
  run_optional_check "SSL/TLS check" npx --yes ssl-checker "$DOMAIN"
else
  echo "[WARN] SSL checker skipped: no domain provided"
fi

echo ""
if [[ "$EXIT_CODE" -eq 0 ]]; then
  echo "Security audit completed successfully."
else
  echo "Security audit found blocking issues."
fi

exit "$EXIT_CODE"
