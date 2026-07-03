import { z } from "zod";
import { oc } from "@orpc/contract";

export const adminFeatureFlagSegmentsContract = {
  get: oc
    .route({
      method: 'GET',
      path: '/admin/feature-flag-segments',
      summary: 'List segments',
      description: 'List all segments.',
      successStatus: 200,
      inputStructure: 'detailed'
    })
    .output(z.array(z.object({
        "conditions": z.array(z.object({})),
        "createdAt": z.coerce.date(),
        "description": z.string(),
        "id": z.string().uuid(),
        "name": z.string(),
        "updatedAt": z.coerce.date()}))),
  post: oc
    .route({
      method: 'POST',
      path: '/admin/feature-flag-segments',
      summary: 'Create a segment',
      description: 'Create a reusable segment referenced from rules via SegmentMatch.',
      successStatus: 201,
      inputStructure: 'detailed'
    })
    .input(z.object({
      body: z.object({
        "conditions": z.array(z.object({})),
        "description": z.string(),
        "name": z.string()})
    }))
    .output(z.object({
        "conditions": z.array(z.object({})),
        "createdAt": z.coerce.date(),
        "description": z.string(),
        "id": z.string().uuid(),
        "name": z.string(),
        "updatedAt": z.coerce.date()}))
};

export const adminFeatureFlagSegmentsErrors = {
  post: {
    409: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
  }
};
