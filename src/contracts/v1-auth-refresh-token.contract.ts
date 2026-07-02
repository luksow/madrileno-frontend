import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const v1AuthRefreshTokenContract = initContract().router({
  post: {
    summary: 'Exchange refresh token for a new JWT and refresh token',
    description: 'Authenticate with a refresh token',
    method: 'POST',
    path: '/v1/auth/refresh-token',
    body: z.object({
        "refreshToken": z.string().uuid()}),
    responses: {
      200: z.object({
        "jwt": z.string(),
        "refreshToken": z.string().uuid(),
        "userCreated": z.boolean()}),
      401: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
    }
  }
});
