import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const v1AuthOidcProviderContract = initContract().router({
  post: {
    summary: 'Exchange an OIDC ID token for an internal JWT and refresh token',
    description: 'Authenticate with an OIDC ID token. The frontend completes the Authorization Code + PKCE flow against the provider; the backend verifies the resulting `id_token` against the provider\'s JWKS and issues an internal JWT + refresh token. The `{provider}` segment is the name configured under `oidc.providers` (or via `OIDC_PROVIDER_NAME`).',
    method: 'POST',
    path: '/v1/auth/oidc/:provider',
    pathParams: z.object({provider: z.string()}),
    body: z.object({
        "idToken": z.string()}),
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
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response"),
      404: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
    }
  }
});
