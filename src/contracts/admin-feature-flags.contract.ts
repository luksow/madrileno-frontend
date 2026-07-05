import { z } from "zod";
import { oc } from "@orpc/contract";
import { createFlagRequestSchema, errorSchema, featureFlagDtoSchema4496 } from "./schemas";

export const adminFeatureFlagsContract = {
  get: oc
    .route({
      method: 'GET',
      path: '/admin/feature-flags',
      summary: 'List feature flags',
      description: 'List all feature flags with their rules.',
      tags: ['Admin'],
      successStatus: 200,
      inputStructure: 'detailed'
    })
    .output(z.array(featureFlagDtoSchema4496))
    .errors({
      'rejection:authentication-failed': {
        status: 401,
        data: errorSchema
      }
    }),
  post: oc
    .route({
      method: 'POST',
      path: '/admin/feature-flags',
      summary: 'Create a feature flag',
      description: 'Create a feature flag. The key is immutable; rules are validated against the flag\'s variant type.',
      tags: ['Admin'],
      successStatus: 201,
      inputStructure: 'detailed'
    })
    .input(z.object({
      body: createFlagRequestSchema
    }))
    .output(featureFlagDtoSchema4496)
    .errors({
      'result:flag-invalid': {
        status: 400,
        data: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.enum(["result:flag-invalid"]).describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
      },
      'result:flag-key-exists': {
        status: 409,
        data: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.enum(["result:flag-key-exists"]).describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
      }
    })
};
