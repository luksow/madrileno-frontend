// The post-init landing page. Not routed while the auction demo is present —
// scripts/init-project.mjs wires it to '/' (at the router's home-anchor) when
// it strips the demo.
export function Home() {
  return (
    <section>
      <title>madrileno</title>
      <h1>It works</h1>
      <p>
        This is the post-init shell: typed API client, auth, routing, tests, SSR opt-in. Add your
        first feature under <code>src/features/</code> and route it in{' '}
        <code>src/app/router.tsx</code>.
      </p>
    </section>
  )
}
