import { z } from "zod";
import { oc } from "@orpc/contract";

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
        data: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
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
      'result:flag-not-found': {
        status: 404,
        data: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
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
      body: z.object({
        "clientExposed": z.boolean(),
        "defaultValue": z.object({}),
        "description": z.string(),
        "enabled": z.boolean(),
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
