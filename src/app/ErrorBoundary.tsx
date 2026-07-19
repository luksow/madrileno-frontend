import { Component, type ReactNode } from 'react'
import { useTranslations } from 'use-intl'
import { Button } from '@/components/ui/button'

function ErrorFallback({ message }: { message: string }) {
  const t = useTranslations('error')
  return (
    <main className="mx-auto flex max-w-4xl flex-col items-start gap-4 px-4 py-8">
      <h1 className="text-2xl font-semibold">{t('heading')}</h1>
      <p className="text-destructive">{message}</p>
      <Button onClick={() => window.location.assign('/')}>{t('back')}</Button>
    </main>
  )
}

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
      return <ErrorFallback message={this.state.error.message} />
    }
    return this.props.children
  }
}
