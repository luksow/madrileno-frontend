import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const v1FeatureFlagsContract = initContract().router({
  get: {
    summary: 'Evaluate all client-exposed flags for the current user',
    description: 'Bootstrap payload for clients: every client-exposed flag evaluated against the authenticated user (targeting key = user id). Flags not marked client-exposed are never present in the response.',
    method: 'GET',
    path: '/v1/feature-flags',
    responses: {
      200: z.object({
        "flags": z.record(z.string(), z.object({}))}),
      401: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
    }
  }
});
