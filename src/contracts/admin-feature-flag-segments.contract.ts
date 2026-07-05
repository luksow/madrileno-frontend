import { z } from "zod";
import { oc } from "@orpc/contract";
import { createSegmentRequestSchema, segmentDtoSchema } from "./schemas";

export const adminFeatureFlagSegmentsContract = {
  get: oc
    .route({
      method: 'GET',
      path: '/admin/feature-flag-segments',
      summary: 'List segments',
      description: 'List all segments.',
      tags: ['Admin'],
      successStatus: 200,
      inputStructure: 'detailed'
    })
    .output(z.array(segmentDtoSchema)),
  post: oc
    .route({
      method: 'POST',
      path: '/admin/feature-flag-segments',
      summary: 'Create a segment',
      description: 'Create a reusable segment referenced from rules via SegmentMatch.',
      tags: ['Admin'],
      successStatus: 201,
      inputStructure: 'detailed'
    })
    .input(z.object({
      body: createSegmentRequestSchema
    }))
    .output(segmentDtoSchema)
    .errors({
      'result:segment-name-exists': {
        status: 409,
        data: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.enum(["result:segment-name-exists"]).describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
      }
    })
};
