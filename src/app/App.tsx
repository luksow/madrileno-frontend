import { Toaster } from '@/components/ui/sonner'
import { ErrorBoundary } from './ErrorBoundary'
import { Layout } from './Layout'
import { AppRoutes } from './router'

export function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <AppRoutes />
      </Layout>
      <Toaster />
    </ErrorBoundary>
  )
}
