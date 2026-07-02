import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const adminFeatureFlagSegmentsContract = initContract().router({
  get: {
    summary: 'List segments',
    description: 'List all segments.',
    method: 'GET',
    path: '/admin/feature-flag-segments',
    responses: {
      200: z.array(z.object({
        "conditions": z.array(z.object({})),
        "createdAt": z.coerce.date(),
        "description": z.string(),
        "id": z.string().uuid(),
        "name": z.string(),
        "updatedAt": z.coerce.date()}))
    }
  },
  post: {
    summary: 'Create a segment',
    description: 'Create a reusable segment referenced from rules via SegmentMatch.',
    method: 'POST',
    path: '/admin/feature-flag-segments',
    body: z.object({
        "conditions": z.array(z.object({})),
        "description": z.string(),
        "name": z.string()}),
    responses: {
      201: z.object({
        "conditions": z.array(z.object({})),
        "createdAt": z.coerce.date(),
        "description": z.string(),
        "id": z.string().uuid(),
        "name": z.string(),
        "updatedAt": z.coerce.date()}),
      409: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
    }
  }
});
