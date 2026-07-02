import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const adminFeatureFlagsKeyToggleContract = initContract().router({
  post: {
    summary: 'Toggle a feature flag',
    description: 'Enable or disable a flag without touching its rules.',
    method: 'POST',
    path: '/admin/feature-flags/:key/toggle',
    pathParams: z.object({key: z.string()}),
    body: z.object({
        "enabled": z.boolean()}),
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
