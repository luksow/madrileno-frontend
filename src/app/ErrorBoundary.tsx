import { Component, type ReactNode } from 'react'
import { m } from '@/paraglide/messages'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  override render(): ReactNode {
    if (this.state.error !== null) {
      return (
        <main className="mx-auto flex max-w-4xl flex-col items-start gap-4 px-4 py-8">
          <h1 className="text-2xl font-semibold">{m.error_heading()}</h1>
          <p className="text-destructive">{this.state.error.message}</p>
          <Button onClick={() => window.location.assign('/')}>{m.error_back()}</Button>
        </main>
      )
    }
    return this.props.children
  }
}
