import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const adminFeatureFlagsKeyContract = initContract().router({
  delete: {
    summary: 'Delete a feature flag',
    description: 'Delete a flag and its rules. Audit entries survive with the flag reference detached.',
    method: 'DELETE',
    path: '/admin/feature-flags/:key',
    pathParams: z.object({key: z.string()}),
    body: z.undefined(),
    responses: {
      204: z.undefined(),
      404: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
    }
  },
  get: {
    summary: 'Get a feature flag',
    description: 'Fetch one feature flag by key.',
    method: 'GET',
    path: '/admin/feature-flags/:key',
    pathParams: z.object({key: z.string()}),
    responses: {
      200: z.object({
        "clientExposed": z.boolean(),
        "createdAt": z.coerce.date(),
        "defaultValue": z.object({}),
        "description": z.string(),
        "enabled": z.boolean(),
        "id": z.string().uuid(),
        "key": z.string(),
        "rules": z.array(z.object({
        "conditions": z.array(z.object({})),
        "createdAt": z.coerce.date(),
        "description": z.string(),
        "id": z.string().uuid(),
        "outcome": z.object({}),
        "position": z.number().int()})),
        "updatedAt": z.coerce.date()}),
      404: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
    }
  },
  put: {
    summary: 'Update a feature flag',
    description: 'Replace a flag\'s mutable fields (description, enabled, default value, client exposure, rules). Key, id and createdAt are preserved.',
    method: 'PUT',
    path: '/admin/feature-flags/:key',
    pathParams: z.object({key: z.string()}),
    body: z.object({
        "clientExposed": z.boolean(),
        "defaultValue": z.object({}),
        "description": z.string(),
        "enabled": z.boolean(),
        "rules": z.array(z.object({
        "conditions": z.array(z.object({})),
        "description": z.string(),
        "outcome": z.object({}),
        "position": z.number().int()}))}),
    responses: {
      200: z.object({
        "clientExposed": z.boolean(),
        "createdAt": z.coerce.date(),
        "defaultValue": z.object({}),
        "description": z.string(),
        "enabled": z.boolean(),
        "id": z.string().uuid(),
        "key": z.string(),
        "rules": z.array(z.object({
        "conditions": z.array(z.object({})),
        "createdAt": z.coerce.date(),
        "description": z.string(),
        "id": z.string().uuid(),
        "outcome": z.object({}),
        "position": z.number().int()})),
        "updatedAt": z.coerce.date()}),
      404: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
    }
  }
});
