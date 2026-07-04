import { z } from "zod";
import { oc } from "@orpc/contract";

export const adminFeatureFlagsKeyEvaluateContract = {
  post: oc
    .route({
      method: 'POST',
      path: '/admin/feature-flags/{key}/evaluate',
      summary: 'Evaluate a flag for a given context',
      description: 'Dry-run a flag against an arbitrary evaluation context, bypassing caches. For debugging targeting rules.',
      tags: ['Admin'],
      successStatus: 200,
      inputStructure: 'detailed'
    })
    .input(z.object({
      params: z.object({key: z.string()}),
      body: z.object({
        "attributes": z.record(z.string(), z.string()),
        "targetingKey": z.string()})
    }))
    .output(z.object({
        "reason": z.enum(["Default","Disabled","Error","Split","TargetingMatch"]),
        "value": z.object({})}))
    .errors({
      'result:flag-not-found': {
        status: 404,
        data: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
      }
    })
};
