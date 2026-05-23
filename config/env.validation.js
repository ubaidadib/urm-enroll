const validatedScopes = new Set();

const isMissing = (value) =>
  value === undefined || value === null || String(value).trim().length === 0;

export const validateEnv = (requiredKeys = [], context = "application") => {
  const missing = requiredKeys.filter((key) => isMissing(process.env[key]));

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s) for ${context}: ${missing.join(", ")}`,
    );
  }
};

export const validateEnvOnce = (scope, requiredKeys = [], context = scope) => {
  if (validatedScopes.has(scope)) {
    return;
  }

  validateEnv(requiredKeys, context);
  validatedScopes.add(scope);
};
