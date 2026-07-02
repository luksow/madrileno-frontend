import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const adminFeatureFlagSegmentsNameContract = initContract().router({
  delete: {
    summary: 'Delete a segment',
    description: 'Delete a segment. Rules still referencing it stop matching (missing segment never matches).',
    method: 'DELETE',
    path: '/admin/feature-flag-segments/:name',
    pathParams: z.object({name: z.string()}),
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
  put: {
    summary: 'Update a segment',
    description: 'Replace a segment\'s description and conditions. Name, id and createdAt are preserved.',
    method: 'PUT',
    path: '/admin/feature-flag-segments/:name',
    pathParams: z.object({name: z.string()}),
    body: z.object({
        "conditions": z.array(z.object({})),
        "description": z.string()}),
    responses: {
      200: z.object({
        "conditions": z.array(z.object({})),
        "createdAt": z.coerce.date(),
        "description": z.string(),
        "id": z.string().uuid(),
        "name": z.string(),
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
