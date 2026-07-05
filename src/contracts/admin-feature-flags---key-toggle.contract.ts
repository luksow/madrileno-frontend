import { z } from "zod";
import { oc } from "@orpc/contract";
import { errorSchemab1f1, featureFlagDtoSchema4496, toggleFlagRequestSchema } from "./schemas";

export const adminFeatureFlagsKeyToggleContract = {
  post: oc
    .route({
      method: 'POST',
      path: '/admin/feature-flags/{key}/toggle',
      summary: 'Toggle a feature flag',
      description: 'Enable or disable a flag without touching its rules.',
      tags: ['Admin'],
      successStatus: 200,
      inputStructure: 'detailed'
    })
    .input(z.object({
      params: z.object({key: z.string()}),
      body: toggleFlagRequestSchema
    }))
    .output(featureFlagDtoSchema4496)
    .errors({
      'result:flag-not-found': {
        status: 404,
        data: errorSchemab1f1
      }
    })
};
