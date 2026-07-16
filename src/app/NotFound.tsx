import { Link } from 'react-router-dom'
import { useTranslations } from 'use-intl'

export function NotFound() {
  const t = useTranslations('notFound')
  return (
    <section className="flex flex-col gap-4">
      <title>{t('pageTitle')}</title>
      <h1 className="text-2xl font-semibold">{t('heading')}</h1>
      <p className="text-muted-foreground">
        {t('body')}
        <Link to="/" className="text-primary underline-offset-4 hover:underline">
          {t('link')}
        </Link>
      </p>
    </section>
  )
}
