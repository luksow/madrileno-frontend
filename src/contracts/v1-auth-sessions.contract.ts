import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const v1AuthSessionsContract = initContract().router({
  delete: {
    summary: 'Revoke all refresh tokens for a given user agent',
    description: 'Revoke sessions by user agent',
    method: 'DELETE',
    path: '/v1/auth/sessions',
    query: z.object({"user-agent": z.string()}),
    body: z.undefined(),
    responses: {
      204: z.undefined()
    }
  },
  get: {
    summary: 'Returns active refresh tokens for the authenticated user',
    description: 'List active sessions. Each entry\'s `createdAt` is when that refresh token was issued — login time, or the timestamp of the last JWT refresh that rotated it (refresh tokens are single-use, so the live one is always the newest in its chain).',
    method: 'GET',
    path: '/v1/auth/sessions',
    responses: {
      200: z.array(z.object({
        "createdAt": z.coerce.date(),
        "expiresAt": z.coerce.date().nullish(),
        "id": z.string().uuid(),
        "ipAddress": z.string(),
        "userAgent": z.string()}))
    }
  }
});
