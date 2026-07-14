import { Link } from 'react-router-dom'
import { m } from '@/paraglide/messages'

export function NotFound() {
  return (
    <section className="flex flex-col gap-4">
      <title>{m.not_found_page_title()}</title>
      <h1 className="text-2xl font-semibold">{m.not_found_heading()}</h1>
      <p className="text-muted-foreground">
        {m.not_found_body()}
        <Link to="/" className="text-primary underline-offset-4 hover:underline">
          {m.not_found_link()}
        </Link>
      </p>
    </section>
  )
}
