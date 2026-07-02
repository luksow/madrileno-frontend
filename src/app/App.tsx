import { tsr } from '../api/tsr'
import { ErrorBoundary } from './ErrorBoundary'
import { Layout } from './Layout'
import { AppRoutes } from './router'

export function App() {
  return (
    <ErrorBoundary>
      <tsr.ReactQueryProvider>
        <Layout>
          <AppRoutes />
        </Layout>
      </tsr.ReactQueryProvider>
    </ErrorBoundary>
  )
}
