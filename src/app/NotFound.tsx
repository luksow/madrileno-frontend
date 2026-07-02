import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <section>
      <title>Not found — madrileno</title>
      <h1>Page not found</h1>
      <p>
        Nothing lives at this address. <Link to="/">Back to the start.</Link>
      </p>
    </section>
  )
}
