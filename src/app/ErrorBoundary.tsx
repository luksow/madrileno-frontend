import { Component, type ReactNode } from 'react'

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
        <main className="container">
          <h1>Something went wrong</h1>
          <p className="error">{this.state.error.message}</p>
          <button onClick={() => window.location.assign('/')}>Back to start</button>
        </main>
      )
    }
    return this.props.children
  }
}
