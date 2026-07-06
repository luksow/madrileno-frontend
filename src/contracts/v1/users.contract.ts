import { z } from "zod";
import { oc } from "@orpc/contract";

export const v1Users = {
  me: {
    get: oc
      .route({
        method: 'GET',
        path: '/v1/users/me',
        summary: 'Returns the current user (id, fullName, emailAddress, emailVerified, avatarUrl)',
        description: 'Get the authenticated user\'s profile',
        tags: ['Users'],
        successStatus: 200,
        inputStructure: 'detailed'
      })
      .output(z.object({
          "avatarUrl": z.string().nullish(),
          "emailAddress": z.string().nullish(),
          "emailVerified": z.boolean(),
          "fullName": z.string().nullish(),
          "id": z.uuid()}))
  }
};
