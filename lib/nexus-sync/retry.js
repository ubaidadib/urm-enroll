const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function withRetry(task, options = {}) {
  const {
    retries = 3,
    minDelayMs = 200,
    maxDelayMs = 3000,
    factor = 2,
    shouldRetry = () => true,
    onRetry,
  } = options;

  let attempt = 0;

  while (attempt <= retries) {
    try {
      return await task({ attempt });
    } catch (error) {
      if (attempt >= retries || !shouldRetry(error, attempt)) {
        throw error;
      }

      const delay = Math.min(maxDelayMs, minDelayMs * factor ** attempt);
      if (typeof onRetry === "function") {
        onRetry({ attempt: attempt + 1, delay, error });
      }
      await sleep(delay);
      attempt += 1;
    }
  }

  throw new Error("Retry exhausted");
}
