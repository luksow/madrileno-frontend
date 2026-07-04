import { z } from "zod";
import { oc } from "@orpc/contract";

export const v1AuthSessionsSessionIdContract = {
  delete: oc
    .route({
      method: 'DELETE',
      path: '/v1/auth/sessions/{sessionId}',
      summary: 'Revoke a refresh token by its ID',
      description: 'Revoke a specific session',
      tags: ['Auth'],
      successStatus: 204,
      inputStructure: 'detailed'
    })
    .input(z.object({
      params: z.object({sessionId: z.string().uuid()})
    }))
    .output(z.void())
};
