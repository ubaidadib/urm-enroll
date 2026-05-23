export class NexusClientError extends Error {
  constructor(message, statusCode, body) {
    super(message);
    this.name = "NexusClientError";
    this.statusCode = statusCode;
    this.body = body;
  }
}

function withTimeout(timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeout };
}

export class NexusIntegrationClient {
  constructor({ baseUrl, apiKey, timeoutMs = 10000 }) {
    this.baseUrl = String(baseUrl).replace(/\/+$/, "");
    this.apiKey = apiKey;
    this.timeoutMs = timeoutMs;
  }

  async fetchEntityPage(entityName, options = {}) {
    const {
      page = 1,
      limit = 100,
      updatedSince,
      requestId,
      syncRunId,
    } = options;

    const url = new URL(`/api/integration/v1/${entityName}`, this.baseUrl);
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));
    if (updatedSince) {
      url.searchParams.set("updated_since", updatedSince);
    }

    const { controller, timeout } = withTimeout(this.timeoutMs);
    const startedAt = Date.now();

    try {
      const response = await fetch(url, {
        method: "GET",
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          "x-api-key": this.apiKey,
          "x-request-id": requestId || "",
          "x-sync-run-id": syncRunId || "",
        },
      });

      const latencyMs = Date.now() - startedAt;

      if (response.status === 304) {
        return {
          statusCode: 304,
          notModified: true,
          records: [],
          hasMore: false,
          latencyMs,
        };
      }

      if (!response.ok) {
        let body;
        try {
          body = await response.json();
        } catch {
          body = { message: await response.text() };
        }

        throw new NexusClientError(
          `Nexus ${entityName} request failed with status ${response.status}`,
          response.status,
          body,
        );
      }

      const payload = await response.json();
      const records = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.items)
          ? payload.items
          : [];

      const hasMore =
        typeof payload?.has_more === "boolean"
          ? payload.has_more
          : typeof payload?.next_page === "number"
            ? true
            : records.length >= limit;

      return {
        statusCode: response.status,
        notModified: false,
        records,
        hasMore,
        latencyMs,
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}
