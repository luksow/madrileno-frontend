import { z } from "zod";
import { oc } from "@orpc/contract";
import { authWithRefreshTokenRequestSchema, authenticatedResponseSchema, errorSchemafbd6 } from "./schemas";

export const v1AuthRefreshTokenContract = {
  post: oc
    .route({
      method: 'POST',
      path: '/v1/auth/refresh-token',
      summary: 'Exchange refresh token for a new JWT and refresh token',
      description: 'Authenticate with a refresh token',
      tags: ['Auth'],
      successStatus: 200,
      inputStructure: 'detailed'
    })
    .input(z.object({
      body: authWithRefreshTokenRequestSchema
    }))
    .output(authenticatedResponseSchema)
    .errors({
      'result:invalid-token': {
        status: 401,
        data: errorSchemafbd6
      }
    })
};
