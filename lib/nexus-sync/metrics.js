import { serverLogger } from "../pino.js";

export function emitMetric(name, value, tags = {}) {
  serverLogger.info({
    event: "sync.metric",
    metric_name: name,
    metric_value: value,
    tags,
  });
}
