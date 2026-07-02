import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const adminConfigContract = initContract().router({
  get: {
    summary: 'Inspect merged configuration',
    description: 'Returns the merged application configuration (HOCON resolved against env vars) as a JSON tree. Leaf values whose key name contains `password`, `passphrase`, `secret`, `credential`, `access-key`, `api-key`, `private-key`, or `token` are replaced with `"[REDACTED]"`. Project-specific secrets can be added via `admin.config.redacted-paths`.',
    method: 'GET',
    path: '/admin/config',
    responses: {
      200: z.object({}),
      401: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
    }
  }
});
