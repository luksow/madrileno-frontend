import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const v1UsersMeContract = initContract().router({
  get: {
    summary: 'Returns the current user (id, fullName, emailAddress, emailVerified, avatarUrl)',
    description: 'Get the authenticated user\'s profile',
    method: 'GET',
    path: '/v1/users/me',
    responses: {
      200: z.object({
        "avatarUrl": z.string().nullish(),
        "emailAddress": z.string().nullish(),
        "emailVerified": z.boolean(),
        "fullName": z.string().nullish(),
        "id": z.string().uuid()})
    }
  }
});
