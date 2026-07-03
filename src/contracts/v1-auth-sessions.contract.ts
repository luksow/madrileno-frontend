import { z } from "zod";
import { oc } from "@orpc/contract";

export const v1AuthSessionsContract = {
  delete: oc
    .route({
      method: 'DELETE',
      path: '/v1/auth/sessions',
      summary: 'Revoke all refresh tokens for a given user agent',
      description: 'Revoke sessions by user agent',
      successStatus: 204,
      inputStructure: 'detailed'
    })
    .input(z.object({
      query: z.object({"user-agent": z.string()})
    }))
    .output(z.void()),
  get: oc
    .route({
      method: 'GET',
      path: '/v1/auth/sessions',
      summary: 'Returns active refresh tokens for the authenticated user',
      description: 'List active sessions. Each entry\'s `createdAt` is when that refresh token was issued — login time, or the timestamp of the last JWT refresh that rotated it (refresh tokens are single-use, so the live one is always the newest in its chain).',
      successStatus: 200,
      inputStructure: 'detailed'
    })
    .output(z.array(z.object({
        "createdAt": z.coerce.date(),
        "expiresAt": z.coerce.date().nullish(),
        "id": z.string().uuid(),
        "ipAddress": z.string(),
        "userAgent": z.string()})))
};
