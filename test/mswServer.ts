import { setupServer } from 'msw/node'

// Shared MSW server with no default handlers: each test file registers its own
// via `server.use(...)`. Keeping this feature-agnostic means init-project can
// delete a feature (and its mocks) without touching test infrastructure.
export const server = setupServer()
