import { z } from "zod";
import { oc } from "@orpc/contract";

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
    .output(z.array(z.object({
        "clientExposed": z.boolean(),
        "createdAt": z.string().datetime({ offset: true }),
        "defaultValue": z.object({}),
        "description": z.string(),
        "enabled": z.boolean(),
        "id": z.string().uuid(),
        "key": z.string(),
        "rules": z.array(z.object({
        "conditions": z.array(z.object({})),
        "createdAt": z.string().datetime({ offset: true }),
        "description": z.string(),
        "id": z.string().uuid(),
        "outcome": z.object({}),
        "position": z.number().int()})),
        "updatedAt": z.string().datetime({ offset: true })})))
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
      body: z.object({
        "clientExposed": z.boolean(),
        "defaultValue": z.object({}),
        "description": z.string(),
        "enabled": z.boolean(),
        "key": z.string(),
        "rules": z.array(z.object({
        "conditions": z.array(z.object({})),
        "description": z.string(),
        "outcome": z.object({}),
        "position": z.number().int()}))})
    }))
    .output(z.object({
        "clientExposed": z.boolean(),
        "createdAt": z.string().datetime({ offset: true }),
        "defaultValue": z.object({}),
        "description": z.string(),
        "enabled": z.boolean(),
        "id": z.string().uuid(),
        "key": z.string(),
        "rules": z.array(z.object({
        "conditions": z.array(z.object({})),
        "createdAt": z.string().datetime({ offset: true }),
        "description": z.string(),
        "id": z.string().uuid(),
        "outcome": z.object({}),
        "position": z.number().int()})),
        "updatedAt": z.string().datetime({ offset: true })}))
    .errors({
      'result:flag-invalid': {
        status: 400,
        data: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
      },
      'result:flag-key-exists': {
        status: 409,
        data: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
      }
    })
};
