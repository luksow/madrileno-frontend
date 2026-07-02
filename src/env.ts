import { z } from 'zod'

// Typed, validated environment — the frontend's counterpart of the backend's
// typed HOCON config. Fail fast at startup instead of at first use.
const schema = z.object({
  VITE_API_BASE_URL: z.string().optional().default(''),
  VITE_OPENOBSERVE_RUM_CLIENT_TOKEN: z.string().optional(),
  VITE_OPENOBSERVE_RUM_SITE: z.string().optional(),
  VITE_OPENOBSERVE_RUM_ORG: z.string().optional(),
  VITE_OPENOBSERVE_RUM_APPLICATION_ID: z.string().optional(),
})

const raw = schema.parse(import.meta.env)

export interface RumConfig {
  clientToken: string
  site: string
  organizationIdentifier: string
  applicationId: string
}

// Empty base URL = same-origin: the Vite dev proxy (and any reverse proxy in
// prod) forwards /v1 to the backend. Tests need an absolute URL because Node's
// fetch rejects relative ones; MSW handlers match on path regardless of host.
const apiBaseUrl =
  raw.VITE_API_BASE_URL !== ''
    ? raw.VITE_API_BASE_URL
    : import.meta.env.MODE === 'test'
      ? 'http://localhost:9000'
      : ''

export const env: { apiBaseUrl: string; rum: RumConfig | null } = {
  apiBaseUrl,
  rum:
    raw.VITE_OPENOBSERVE_RUM_CLIENT_TOKEN !== undefined &&
    raw.VITE_OPENOBSERVE_RUM_SITE !== undefined
      ? {
          clientToken: raw.VITE_OPENOBSERVE_RUM_CLIENT_TOKEN,
          site: raw.VITE_OPENOBSERVE_RUM_SITE,
          organizationIdentifier: raw.VITE_OPENOBSERVE_RUM_ORG ?? 'default',
          applicationId: raw.VITE_OPENOBSERVE_RUM_APPLICATION_ID ?? 'madrileno-frontend',
        }
      : null,
}
