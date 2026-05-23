export async function* paginate(fetchPage, options = {}) {
  const { startPage = 1, maxPages = 10000 } = options;

  let page = startPage;
  while (page <= maxPages) {
    const result = await fetchPage(page);
    yield { ...result, page };

    if (result.notModified) break;

    const records = Array.isArray(result.records) ? result.records : [];
    const hasMore = typeof result.hasMore === "boolean" ? result.hasMore : records.length > 0;

    if (!hasMore || records.length === 0) {
      break;
    }

    page += 1;
  }
}
