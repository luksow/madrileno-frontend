import { z } from 'zod'

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

export const env: { apiBaseUrl: string; rum: RumConfig | null } = {
  // '' = same-origin (proxied /v1). Vitest injects an absolute URL here — see vitest.config.ts.
  apiBaseUrl: raw.VITE_API_BASE_URL,
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
