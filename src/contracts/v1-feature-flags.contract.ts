import { z } from "zod";
import { oc } from "@orpc/contract";
import { errorSchema } from "./schemas";

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
        data: errorSchema
      }
    })
};
