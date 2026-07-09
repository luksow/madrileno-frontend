import { oc } from "@orpc/contract";
import { userDtoSchema } from "./users.schemas";

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
        inputStructure: 'detailed',
        spec: (current) => ({ ...current, security: [{ bearer: [] }] })
      })
      .output(userDtoSchema)
  }
};
