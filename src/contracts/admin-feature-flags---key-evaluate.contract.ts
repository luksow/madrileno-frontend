import { z } from "zod";
import { oc } from "@orpc/contract";
import { errorSchemab1f1, evaluateFlagRequestSchema } from "./schemas";

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
      body: evaluateFlagRequestSchema
    }))
    .output(z.object({
        "reason": z.enum(["Default","Disabled","Error","Split","TargetingMatch"]),
        "value": z.object({})}))
    .errors({
      'result:flag-not-found': {
        status: 404,
        data: errorSchemab1f1
      }
    })
};
