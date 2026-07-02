// The post-init landing page. While the auction demo is present this route is
// shadowed by the demo's '/' route; after scripts/init-project.mjs it becomes
// the home page of the fresh shell.
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
