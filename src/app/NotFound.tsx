import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <section className="flex flex-col gap-4">
      <title>Not found — madrileno</title>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground">
        Nothing lives at this address.{' '}
        <Link to="/" className="text-primary underline-offset-4 hover:underline">
          Back to the start.
        </Link>
      </p>
    </section>
  )
}
