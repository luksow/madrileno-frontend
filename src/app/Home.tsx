import { useTranslations } from 'use-intl'

// Unrouted while the demo exists; init-project wires it to '/' at the router's home-anchor.
export function Home() {
  const t = useTranslations('home')
  return (
    <section className="flex flex-col gap-4">
      <title>madrileno</title>
      <h1 className="text-2xl font-semibold">{t('heading')}</h1>
      <p className="text-muted-foreground">
        {t.rich('body', {
          code: (chunks) => <code className="rounded bg-muted px-1 py-0.5 text-sm">{chunks}</code>,
        })}
      </p>
    </section>
  )
}
