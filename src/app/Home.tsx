// Unrouted while the demo exists; init-project wires it to '/' at the router's home-anchor.
export function Home() {
  return (
    <section className="flex flex-col gap-4">
      <title>madrileno</title>
      <h1 className="text-2xl font-semibold">It works</h1>
      <p className="text-muted-foreground">
        This is the post-init shell: typed API client, auth, routing, tests, SSR opt-in. Add your
        first feature under{' '}
        <code className="rounded bg-muted px-1 py-0.5 text-sm">src/features/</code> and route it in{' '}
        <code className="rounded bg-muted px-1 py-0.5 text-sm">src/app/router.tsx</code>.
      </p>
    </section>
  )
}
