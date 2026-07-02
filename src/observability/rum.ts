import { env } from '../env'

// OpenObserve RUM, strictly opt-in: without the VITE_OPENOBSERVE_RUM_* env vars
// this returns immediately and the SDK is never even downloaded (dynamic
// import = separate chunk). Pairs with the backend's OpenObserve instance —
// frontend sessions land next to backend traces.
export async function initRum(): Promise<void> {
  const cfg = env.rum
  if (cfg === null) return
  const [{ openobserveRum }, { openobserveLogs }] = await Promise.all([
    import('@openobserve/browser-rum'),
    import('@openobserve/browser-logs'),
  ])
  const common = {
    clientToken: cfg.clientToken,
    site: cfg.site,
    organizationIdentifier: cfg.organizationIdentifier,
    service: 'madrileno-frontend',
    env: import.meta.env.MODE,
    version: '0.0.0',
    insecureHTTP: cfg.site.startsWith('localhost'),
    apiVersion: 'v1',
  }
  openobserveRum.init({
    applicationId: cfg.applicationId,
    ...common,
    trackResources: true,
    trackLongTasks: true,
    trackUserInteractions: true,
    defaultPrivacyLevel: 'mask-user-input',
  })
  openobserveLogs.init({ ...common, forwardErrorsToLogs: true })
  openobserveRum.startSessionReplayRecording()
}
