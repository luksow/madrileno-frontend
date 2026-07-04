import { z } from "zod";
import { oc } from "@orpc/contract";

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
      body: z.object({
        "refreshToken": z.string().uuid()})
    }))
    .output(z.object({
        "jwt": z.string(),
        "refreshToken": z.string().uuid(),
        "userCreated": z.boolean()}))
    .errors({
      'result:invalid-token': {
        status: 401,
        data: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
      }
    })
};
