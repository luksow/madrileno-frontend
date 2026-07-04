import { z } from "zod";
import { oc } from "@orpc/contract";

export const v1FeatureFlagsContract = {
  get: oc
    .route({
      method: 'GET',
      path: '/v1/feature-flags',
      summary: 'Evaluate all client-exposed flags for the current user',
      description: 'Bootstrap payload for clients: every client-exposed flag evaluated against the authenticated user (targeting key = user id). Flags not marked client-exposed are never present in the response.',
      tags: ['Feature flags'],
      successStatus: 200,
      inputStructure: 'detailed'
    })
    .output(z.object({
        "flags": z.record(z.string(), z.object({}))}))
    .errors({
      'rejection:authentication-failed': {
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
