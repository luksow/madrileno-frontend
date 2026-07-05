import { z } from "zod";
import { oc } from "@orpc/contract";
import { authWithEmailRequestSchema, authenticatedResponseSchema, errorSchemafbd6 } from "./schemas";

export const v1AuthDevContract = {
  post: oc
    .route({
      method: 'POST',
      path: '/v1/auth/dev',
      summary: 'Dev-only: authenticate with an email address (no password)',
      description: 'Dev-mode login: exchanges a bare email address for an internal JWT and refresh token, creating the user on first login. Gated by `DEV_AUTH_ENABLED` (`dev-auth.enabled`, off by default) — when disabled the endpoint answers 404. Never enable outside local/dev environments.',
      tags: ['Auth'],
      successStatus: 200,
      inputStructure: 'detailed'
    })
    .input(z.object({
      body: authWithEmailRequestSchema
    }))
    .output(authenticatedResponseSchema)
    .errors({
      'result:invalid-token': {
        status: 401,
        data: errorSchemafbd6
      }
    })
};
