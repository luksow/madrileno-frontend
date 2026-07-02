import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const v1AuthSessionsSessionIdContract = initContract().router({
  delete: {
    summary: 'Revoke a refresh token by its ID',
    description: 'Revoke a specific session',
    method: 'DELETE',
    path: '/v1/auth/sessions/:sessionId',
    pathParams: z.object({sessionId: z.string().uuid()}),
    body: z.undefined(),
    responses: {
      204: z.undefined()
    }
  }
});
