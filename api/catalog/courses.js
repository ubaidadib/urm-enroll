import { withSecurity } from "../../middleware/security.js";
import { listCourses } from "../../lib/nexus-sync/mirror-repository.js";

function normalizeCourseRow(row) {
  return {
    id: row.source_id,
    universityId: row.university_source_id,
    universityName: row.university_name,
    title: row.title,
    degreeLevel: row.degree_level,
    field: row.field,
    duration: row.duration,
    language: row.language,
    tuitionAmount: row.tuition_amount,
    tuitionCurrency: row.tuition_currency,
    description: row.description,
    payload: row.payload_json,
    sourceUpdatedAt: row.source_updated_at,
    syncedAt: row.synced_at,
  };
}

async function handler(request, response) {
  const page = Math.max(1, Number.parseInt(String(request.query?.page || "1"), 10));
  const pageSize = Math.min(500, Math.max(1, Number.parseInt(String(request.query?.pageSize || "100"), 10)));

  const filters = {
    search: String(request.query?.search || ""),
    universitySourceId: String(request.query?.universitySourceId || ""),
    degreeLevel: String(request.query?.degreeLevel || ""),
    field: String(request.query?.field || ""),
    page,
    pageSize,
  };

  const result = await listCourses(filters);

  response.status(200).json({
    data: result.rows.map(normalizeCourseRow),
    page: result.page,
    pageSize: result.pageSize,
    total: result.total,
    status: "ok",
  });
}

export default withSecurity(handler, {
  methods: ["GET"],
  requireJson: false,
  requireCsrf: false,
  requireOrigin: false,
  blockBots: false,
  maxBodyBytes: 1024,
  rateLimit: { key: "catalog-courses", windowMs: 60 * 1000, max: 120 },
});
