import { defineConfig, loadEnv, type Plugin } from 'vite'
import crypto from 'node:crypto'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { loadLocalEnvFiles } from './scripts/load-env.mjs'

loadLocalEnvFiles()

function json(res: any, status: number, payload: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

function parsePositiveInt(value: string | null, fallback: number, max: number) {
  const parsed = Number.parseInt(String(value ?? ''), 10)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(max, Math.max(1, parsed))
}

function timingSafeEqualStr(left: string, right: string) {
  const a = Buffer.from(String(left || ''))
  const b = Buffer.from(String(right || ''))
  if (a.length === 0 || b.length === 0 || a.length !== b.length) {
    return false
  }
  return crypto.timingSafeEqual(a, b)
}

const IMAGE_PROXY_PATH = '/api/media/image'
const PRIVATE_HOST_RE = /(^localhost$)|(^127\.)|(^10\.)|(^192\.168\.)|(^169\.254\.)|(^172\.(1[6-9]|2\d|3[0-1])\.)|(^::1$)/i

function firstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value !== 'string') continue
    const trimmed = value.trim()
    if (trimmed.length > 0) return trimmed
  }
  return ''
}

function inferUniversityType(rawType: unknown, payload: Record<string, any>, programs: any[]) {
  const candidate = firstString(
    payload?.type,
    payload?.universityType,
    payload?.ownership,
    payload?.institutionType,
    rawType,
  ).toLowerCase()

  if (candidate.includes('international')) return 'international'
  if (candidate.includes('private')) return 'private'
  if (candidate.includes('public') || candidate === 'state') return 'private'
  return programs.some((program) => Number(program?.tuitionPerYear || 0) > 0) ? 'private' : 'private'
}

function toProxiedImageUrl(value: unknown) {
  const url = firstString(value)
  if (!url) return ''
  if (url.startsWith('/') || !/^https?:\/\//i.test(url)) return url
  return `${IMAGE_PROXY_PATH}?url=${encodeURIComponent(url)}`
}

function toNullableNumber(value: unknown) {
  if (value === null || value === undefined || value === '') return null
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

function toNullableBoolean(value: unknown) {
  if (value === null || value === undefined || value === '') return null
  if (typeof value === 'boolean') return value
  const normalized = String(value).trim().toLowerCase()
  if (['true', '1', 'yes'].includes(normalized)) return true
  if (['false', '0', 'no'].includes(normalized)) return false
  return null
}

function isSafeImageUrl(rawUrl: string) {
  if (!rawUrl) return false
  try {
    const parsed = new URL(rawUrl)
    if (!['http:', 'https:'].includes(parsed.protocol)) return false
    if (PRIVATE_HOST_RE.test(parsed.hostname)) return false
    return true
  } catch {
    return false
  }
}

function createDevApiBridgePlugin(): Plugin {
  return {
    name: 'dev-api-bridge',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const method = String(req.method || 'GET').toUpperCase()
        const url = new URL(req.url || '/', 'http://localhost')

        try {
          if (method === 'GET' && url.pathname === '/api/catalog/courses') {
            const { listCourses } = await import('./lib/nexus-sync/mirror-repository.js')

            const result = await listCourses({
              search: url.searchParams.get('search') || '',
              universitySourceId: url.searchParams.get('universitySourceId') || '',
              degreeLevel: url.searchParams.get('degreeLevel') || '',
              field: url.searchParams.get('field') || '',
              page: parsePositiveInt(url.searchParams.get('page'), 1, 100000),
              pageSize: parsePositiveInt(url.searchParams.get('pageSize'), 100, 500),
            })

            return json(res, 200, {
              data: result.rows.map((row: Record<string, any>) => ({
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
              })),
              page: result.page,
              pageSize: result.pageSize,
              total: result.total,
              status: 'ok',
            })
          }

          if (method === 'GET' && url.pathname === '/api/catalog/universities') {
            const { fetchCatalogFromSupabase } = await import('./lib/supabase-catalog.js')
            const result = await fetchCatalogFromSupabase()
            return json(res, 200, result)
          }

          if (method === 'GET' && url.pathname === '/api/catalog/universities/__REPLACED_DEAD_CODE__') {
            const { listUniversities, listCourses } = await import('./lib/nexus-sync/mirror-repository.js')
            const includePrograms = String(url.searchParams.get('includePrograms') || 'true') !== 'false'
            const result = await listUniversities({
              search: url.searchParams.get('search') || '',
              country: url.searchParams.get('country') || '',
              type: url.searchParams.get('type') || '',
              page: parsePositiveInt(url.searchParams.get('page'), 1, 100000),
              pageSize: parsePositiveInt(url.searchParams.get('pageSize'), 100, 500),
            })

            let coursesByUniversity = new Map()
            let locationByUniversity = new Map()
            if (includePrograms && result.rows.length > 0) {
              const courseResult = await listCourses({ page: 1, pageSize: 5000 })
              coursesByUniversity = courseResult.rows.reduce((map: Map<string, any[]>, row: Record<string, any>) => {
                const list = map.get(row.university_source_id) || []

                // Rich fee extraction from payload_json — same logic as api/catalog/universities.js
                const pFees = row.payload_json?.fees
                const displayValue = Number(pFees?.display?.value)
                const originalValue = Number(pFees?.original?.value)
                const baseValue = Number(pFees?.base)
                const afterSaleValue = Number(pFees?.after_sale)

                const effectiveTuition = (
                  (displayValue > 0 ? displayValue : null)
                  ?? (originalValue > 0 ? originalValue : null)
                  ?? (baseValue > 0 ? baseValue : null)
                  ?? (afterSaleValue > 0 ? afterSaleValue : null)
                  ?? Number(row.tuition_amount || 0)
                )

                const effectiveCurrency = (
                  (displayValue > 0 ? pFees?.display?.currency : null)
                  ?? (originalValue > 0 ? pFees?.original?.currency : null)
                  ?? row.tuition_currency
                  ?? ''
                ) || ''

                // feesText: pFees.raw is an object in Nexus data, not a string — skip it
                const feesText = (
                  typeof row.fees_text === 'string' && row.fees_text.trim()
                    ? row.fees_text.trim()
                    : typeof pFees?.raw === 'string' && pFees.raw.trim()
                      ? pFees.raw.trim()
                      : ''
                )

                // Requirements text lives in row.description (requirements_text column doesn't exist yet)
                const requirementsText = (
                  typeof row.requirements_text === 'string' && row.requirements_text.trim()
                    ? row.requirements_text.trim()
                    : typeof row.description === 'string' && row.description.trim()
                      ? row.description.trim()
                      : ''
                )

                list.push({
                  id: row.source_id,
                  name: row.title,
                  degreeLevel: row.degree_level || 'bachelor',
                  field: row.field || 'general',
                  duration: row.duration || '',
                  language: row.language || '',
                  tuitionPerYear: effectiveTuition,
                  tuitionCurrency: effectiveCurrency,
                  description: requirementsText,
                  requirements: [],
                  feesText,
                  coverPhoto: '',
                  // Rich structured fields from payload_json
                  dates: row.payload_json?.dates ?? null,
                  seasons: row.payload_json?.seasons ?? null,
                  level: row.payload_json?.level ?? null,
                  pathway: row.payload_json?.pathway ?? null,
                  country: row.payload_json?.country ?? null,
                  city: row.payload_json?.city ?? null,
                  has_sale: row.payload_json?.has_sale ?? false,
                  sale_percentage: row.payload_json?.sale_percentage ?? null,
                  is_seasonal: row.payload_json?.is_seasonal ?? false,
                  address: row.payload_json?.address ?? null,
                  toefl_score: row.payload_json?.toefl_score ?? null,
                  fees: row.payload_json?.fees ?? null,
                })
                map.set(row.university_source_id, list)
                return map
              }, new Map())

              locationByUniversity = courseResult.rows.reduce((map: Map<string, any>, row: Record<string, any>) => {
                const universityId = row.university_source_id
                if (!universityId || map.has(universityId)) {
                  return map
                }

                const payload = row.payload_json || {}
                const countryValue = payload?.country
                const cityValue = payload?.city

                const country = typeof countryValue === 'string'
                  ? countryValue
                  : countryValue?.name
                    ? String(countryValue.name)
                    : ''

                const countryCode = countryValue?.iso_code
                  ? String(countryValue.iso_code)
                  : countryValue?.isoCode
                    ? String(countryValue.isoCode)
                    : ''

                const city = typeof cityValue === 'string'
                  ? cityValue
                  : cityValue?.name
                    ? String(cityValue.name)
                    : ''

                map.set(universityId, { country, countryCode, city })
                return map
              }, new Map())
            }

            return json(res, 200, {
              data: result.rows.map((row: Record<string, any>) => {
                const payload = row.payload_json || {}
                const programs = Array.isArray(payload.programs)
                  ? payload.programs
                  : coursesByUniversity.get(row.source_id) || []
                const inferredLocation = locationByUniversity.get(row.source_id) || {}
                const coverPhoto = firstString(
                  payload.image_web,
                  payload.imageWeb,
                  payload.image_mobile,
                  payload.imageMobile,
                  payload.image,
                  payload.university?.image_web,
                  payload.university?.imageWeb,
                  payload.university?.image_mobile,
                  payload.university?.imageMobile,
                  payload.university?.image,
                  payload.coverPhoto,
                  payload.cover_photo,
                  payload.cover,
                  payload.banner,
                  payload.heroImage,
                  payload.imageUrl,
                  row.cover_photo,
                )
                const logo = firstString(
                  row.logo,
                  payload.logo,
                  payload.logoUrl,
                  payload.logo_url,
                  payload.thumbnail,
                  payload.image,
                  payload.imageUrl,
                )
                const positiveTuitions = programs
                  .map((program: Record<string, any>) => Number(program?.tuitionPerYear || 0))
                  .filter((amount: number) => Number.isFinite(amount) && amount > 0)
                const startingTuitionAmount = positiveTuitions.length > 0 ? Math.min(...positiveTuitions) : null
                const startingTuitionCurrency = firstString(
                  programs.find((program: Record<string, any>) => Number(program?.tuitionPerYear || 0) === startingTuitionAmount)?.tuitionCurrency,
                  payload.fees_with_currency,
                  payload.feesWithCurrency,
                  'EUR',
                )
                const levels = [...new Set(
                  programs
                    .map((program: Record<string, any>) => firstString(program?.degreeLevel))
                    .filter(Boolean)
                )]
                const pathways = [...new Set(
                  programs
                    .map((program: Record<string, any>) => firstString(program?.pathway, program?.field))
                    .filter(Boolean)
                )]
                const applicationFees = toNullableNumber(
                  payload.application_fees ?? payload.applicationFees ?? payload.university?.application_fees ?? payload.university?.applicationFees,
                )
                const hasCourses = toNullableBoolean(payload.has_courses ?? payload.hasCourses) ?? programs.length > 0
                const latitude = toNullableNumber(payload.latitude ?? payload.lat)
                const longitude = toNullableNumber(payload.longitude ?? payload.lng)

                return {
                  id: row.source_id,
                  name: row.name,
                  city: row.city || inferredLocation.city || '',
                  country: row.country || inferredLocation.country || '',
                  countryCode: row.country_code || inferredLocation.countryCode || '',
                  type: inferUniversityType(row.type, payload, programs),
                  logo: toProxiedImageUrl(logo),
                  coverPhoto: toProxiedImageUrl(coverPhoto),
                  programsCount: row.programs_count || programs.length,
                  languages: Array.isArray(row.languages) ? row.languages : [],
                  established: row.established || 0,
                  ranking: row.ranking || 9999,
                  description: row.description || '',
                  website: row.website || '',
                  applicationFees,
                  hasCourses,
                  latitude,
                  longitude,
                  startingTuitionAmount,
                  startingTuitionCurrency,
                  levels,
                  pathways,
                  programs,
                  sourceUpdatedAt: row.source_updated_at,
                  syncedAt: row.synced_at,
                }
              }),
              page: result.page,
              pageSize: result.pageSize,
              total: result.total,
              status: 'ok',
            })
          }

          if (method === 'GET' && url.pathname === '/api/media/image') {
            const sourceUrl = String(url.searchParams.get('url') || '')
            if (!isSafeImageUrl(sourceUrl)) {
              return json(res, 400, { error: 'Invalid image URL' })
            }

            const upstream = await fetch(sourceUrl, {
              method: 'GET',
              redirect: 'follow',
              headers: { Accept: 'image/*' },
            })

            if (!upstream.ok) {
              return json(res, upstream.status, { error: 'Upstream image request failed' })
            }

            const contentType = String(upstream.headers.get('content-type') || '').toLowerCase()
            if (!contentType.startsWith('image/')) {
              return json(res, 415, { error: 'Upstream response is not an image' })
            }

            const bytes = Buffer.from(await upstream.arrayBuffer())
            res.statusCode = 200
            res.setHeader('Content-Type', contentType)
            res.setHeader('Cache-Control', String(upstream.headers.get('cache-control') || 'public, max-age=3600, s-maxage=3600'))
            const etag = upstream.headers.get('etag')
            if (etag) res.setHeader('ETag', etag)
            res.end(bytes)
            return
          }

          if (method === 'GET' && url.pathname === '/api/instagram') {
            const { getInstagramMedia, getCacheStatus } = await import('./lib/instagram.js')
            const limit = parsePositiveInt(url.searchParams.get('limit'), 12, 30)

            if (!process.env.INSTAGRAM_ACCESS_TOKEN || !process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID) {
              return json(res, 503, {
                error: 'Instagram integration not configured',
                message: 'INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_BUSINESS_ACCOUNT_ID not set',
                cache: { cached: false },
                retryAfter: 300,
              })
            }

            try {
              const media = await getInstagramMedia(limit)
              return json(res, 200, {
                success: true,
                data: media,
                count: media.length,
                cache: getCacheStatus(),
                refreshedAt: new Date().toISOString(),
              })
            } catch {
              return json(res, 503, {
                error: 'Instagram integration temporarily unavailable',
                cache: getCacheStatus(),
                retryAfter: 60,
              })
            }
          }

          if (method === 'POST' && url.pathname === '/api/application') {
            // Collect request body
            const chunks: Buffer[] = []
            await new Promise<void>((resolve, reject) => {
              req.on('data', (chunk: Buffer) => chunks.push(chunk))
              req.on('end', resolve)
              req.on('error', reject)
            })
            const bodyText = Buffer.concat(chunks).toString('utf8')

            let body: Record<string, unknown> = {}
            try { body = JSON.parse(bodyText || '{}') } catch {
              return json(res, 400, { error: 'Invalid JSON body' })
            }

            const fullName = String(body.fullName ?? '').trim()
            const emailVal = String(body.email ?? '').trim()
            if (!fullName || !emailVal) {
              return json(res, 422, { error: 'fullName and email are required' })
            }

            // Dev: try the real handler (handles SMTP gracefully) or return success
            try {
              const { default: appHandler } = await import('./api/application.js') as { default: (req: any, res: any) => Promise<void> }
              // Build minimal mock to bypass withSecurity in dev
              const mockReq = Object.assign(Object.create(req), {
                method: 'POST',
                headers: {
                  ...req.headers,
                  'content-type': 'application/json',
                  'x-urm-csrf': 'dev-bypass',
                  'x-urm-client': 'web',
                  origin: 'http://localhost:5173',
                },
                body,
              })
              await appHandler(mockReq, res)
            } catch {
              // If real handler fails (e.g. CSRF check), just return success in dev
              console.info(`[dev] Application from ${fullName} <${emailVal}> – returning dev success`)
              return json(res, 200, { success: true, dev: true })
            }
            return
          }

          if (method === 'POST' && url.pathname === '/api/internal/sync') {
            const expectedSecret = String(process.env.ENROLL_SYNC_WORKER_SECRET || '')
            const providedSecret = String(req.headers['x-enroll-sync-secret'] || '')

            if (!timingSafeEqualStr(providedSecret, expectedSecret)) {
              return json(res, 401, { error: 'Unauthorized' })
            }

            const { runMirrorSync } = await import('./lib/nexus-sync/sync-orchestrator.js')
            const dryRun = String(url.searchParams.get('dryRun') || 'false') === 'true'
            const fullBackfill = String(url.searchParams.get('fullBackfill') || 'false') === 'true'

            const result = await runMirrorSync({
              requestId: String(req.headers['x-request-id'] || crypto.randomUUID()),
              syncRunId: crypto.randomUUID(),
              dryRun,
              fullBackfill,
            })

            if (result.status === 'conflict') {
              return json(res, 409, result)
            }

            return json(res, result.status === 'success' ? 200 : 500, result)
          }
        } catch (error: any) {
          return json(res, 500, {
            error: 'Dev API bridge error',
            message: error?.message || 'Unknown error',
          })
        }

        next()
      })
    },
  }
}

function createDevSecurityHeadersPlugin(): Plugin {
  return {
    name: 'dev-security-headers',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        res.setHeader(
          'Content-Security-Policy',
          [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com https://assets.calendly.com https://www.instagram.com https://platform.instagram.com https://www.facebook.com https://graph.facebook.com",
            "script-src-elem 'self' 'unsafe-inline' https://challenges.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com https://assets.calendly.com https://www.instagram.com https://platform.instagram.com https://www.facebook.com https://graph.facebook.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://assets.calendly.com",
            "img-src 'self' data: https: https://calendly.com https://assets.calendly.com",
            "font-src 'self' https://fonts.gstatic.com",
            "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://challenges.cloudflare.com https://calendly.com https://assets.calendly.com https://www.instagram.com https://platform.instagram.com https://www.facebook.com https://graph.instagram.com https://graph.facebook.com",
            "frame-src 'self' https://calendly.com https://challenges.cloudflare.com https://www.instagram.com https://platform.instagram.com https://www.facebook.com https://graph.facebook.com",
            "base-uri 'self'",
            "form-action 'self'",
          ].join('; '),
        )
        next()
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      createDevApiBridgePlugin(),
      createDevSecurityHeadersPlugin(),
      tailwindcss(),
      visualizer({
        filename: 'bundle-report.json',
        template: 'raw-data',
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    build: {
      sourcemap: false,
      target: 'es2022',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('motion')) return 'motion'
              if (id.includes('lucide-react')) return 'icons'
              if (id.includes('react-router-dom')) return 'router'
              return 'vendor'
            }
            return undefined
          },
        },
      },
    },

    esbuild: {
      drop: ['console', 'debugger'],
    },

    assetsInclude: ['**/*.svg', '**/*.csv'],

    server: {},
  }
})
