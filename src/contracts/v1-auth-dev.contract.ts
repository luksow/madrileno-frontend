import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const v1AuthDevContract = initContract().router({
  post: {
    summary: 'Dev-only: authenticate with an email address (no password)',
    description: 'Dev-mode login: exchanges a bare email address for an internal JWT and refresh token, creating the user on first login. Gated by `DEV_AUTH_ENABLED` (`dev-auth.enabled`, off by default) — when disabled the endpoint answers 404. Never enable outside local/dev environments.',
    method: 'POST',
    path: '/v1/auth/dev',
    body: z.object({
        "email": z.string()}),
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
