import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import { problemSchema } from '../api/problem'

// Hand-written, deliberately outside src/contracts/: POST /v1/auth/dev is a
// dev-mode-only endpoint (gated by DEV_AUTH_ENABLED on the backend) and has no
// baklava router spec upstream, so it never appears in the generated contract.
// Shape mirrors the backend's AuthWithEmailRequest / AuthenticatedResponse.
export const devAuthContract = initContract().router({
  post: {
    method: 'POST',
    path: '/v1/auth/dev',
    body: z.object({ email: z.string().email() }),
    responses: {
      200: z.object({
        jwt: z.string(),
        refreshToken: z.string().uuid(),
        userCreated: z.boolean(),
      }),
      401: problemSchema,
      404: problemSchema,
    },
  },
})
