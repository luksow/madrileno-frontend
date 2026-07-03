import { z } from "zod";
import { oc } from "@orpc/contract";

export const adminFeatureFlagSegmentsNameContract = {
  delete: oc
    .route({
      method: 'DELETE',
      path: '/admin/feature-flag-segments/{name}',
      summary: 'Delete a segment',
      description: 'Delete a segment. Rules still referencing it stop matching (missing segment never matches).',
      successStatus: 204,
      inputStructure: 'detailed'
    })
    .input(z.object({
      params: z.object({name: z.string()})
    }))
    .output(z.void()),
  put: oc
    .route({
      method: 'PUT',
      path: '/admin/feature-flag-segments/{name}',
      summary: 'Update a segment',
      description: 'Replace a segment\'s description and conditions. Name, id and createdAt are preserved.',
      successStatus: 200,
      inputStructure: 'detailed'
    })
    .input(z.object({
      params: z.object({name: z.string()}),
      body: z.object({
        "conditions": z.array(z.object({})),
        "description": z.string()})
    }))
    .output(z.object({
        "conditions": z.array(z.object({})),
        "createdAt": z.coerce.date(),
        "description": z.string(),
        "id": z.string().uuid(),
        "name": z.string(),
        "updatedAt": z.coerce.date()}))
};

export const adminFeatureFlagSegmentsNameErrors = {
  delete: {
    404: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
  },
  put: {
    404: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
  }
};
