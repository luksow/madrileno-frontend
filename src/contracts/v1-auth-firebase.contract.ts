import { z } from "zod";
import { oc } from "@orpc/contract";
import { authWithFirebaseRequestSchema, authenticatedResponseSchema, errorSchemafbd6 } from "./schemas";

export const v1AuthFirebaseContract = {
  post: oc
    .route({
      method: 'POST',
      path: '/v1/auth/firebase',
      summary: 'Exchange Firebase token for internal JWT and refresh token',
      description: 'Authenticate with Firebase JWT token',
      tags: ['Auth'],
      successStatus: 200,
      inputStructure: 'detailed'
    })
    .input(z.object({
      body: authWithFirebaseRequestSchema
    }))
    .output(authenticatedResponseSchema)
    .errors({
      'result:invalid-token': {
        status: 401,
        data: errorSchemafbd6
      },
      'result:user-blocked': {
        status: 423,
        data: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.enum(["result:user-blocked"]).describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
      }
    })
};
