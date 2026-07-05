import { z } from "zod";
import { oc } from "@orpc/contract";
import { errorSchemab1f1, featureFlagDtoSchema4496, updateFlagRequestSchema } from "./schemas";

export const adminFeatureFlagsKeyContract = {
  delete: oc
    .route({
      method: 'DELETE',
      path: '/admin/feature-flags/{key}',
      summary: 'Delete a feature flag',
      description: 'Delete a flag and its rules. Audit entries survive with the flag reference detached.',
      tags: ['Admin'],
      successStatus: 204,
      inputStructure: 'detailed'
    })
    .input(z.object({
      params: z.object({key: z.string()})
    }))
    .output(z.void())
    .errors({
      'result:flag-not-found': {
        status: 404,
        data: errorSchemab1f1
      }
    }),
  get: oc
    .route({
      method: 'GET',
      path: '/admin/feature-flags/{key}',
      summary: 'Get a feature flag',
      description: 'Fetch one feature flag by key.',
      tags: ['Admin'],
      successStatus: 200,
      inputStructure: 'detailed'
    })
    .input(z.object({
      params: z.object({key: z.string()})
    }))
    .output(featureFlagDtoSchema4496)
    .errors({
      'result:flag-not-found': {
        status: 404,
        data: errorSchemab1f1
      }
    }),
  put: oc
    .route({
      method: 'PUT',
      path: '/admin/feature-flags/{key}',
      summary: 'Update a feature flag',
      description: 'Replace a flag\'s mutable fields (description, enabled, default value, client exposure, rules). Key, id and createdAt are preserved.',
      tags: ['Admin'],
      successStatus: 200,
      inputStructure: 'detailed'
    })
    .input(z.object({
      params: z.object({key: z.string()}),
      body: updateFlagRequestSchema
    }))
    .output(featureFlagDtoSchema4496)
    .errors({
      'result:flag-not-found': {
        status: 404,
        data: errorSchemab1f1
      }
    })
};
