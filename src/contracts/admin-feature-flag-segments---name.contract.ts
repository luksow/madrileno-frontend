import { z } from "zod";
import { oc } from "@orpc/contract";
import { errorSchemab24e, segmentDtoSchema, updateSegmentRequestSchema } from "./schemas";

export const adminFeatureFlagSegmentsNameContract = {
  delete: oc
    .route({
      method: 'DELETE',
      path: '/admin/feature-flag-segments/{name}',
      summary: 'Delete a segment',
      description: 'Delete a segment. Rules still referencing it stop matching (missing segment never matches).',
      tags: ['Admin'],
      successStatus: 204,
      inputStructure: 'detailed'
    })
    .input(z.object({
      params: z.object({name: z.string()})
    }))
    .output(z.void())
    .errors({
      'result:segment-not-found': {
        status: 404,
        data: errorSchemab24e
      }
    }),
  put: oc
    .route({
      method: 'PUT',
      path: '/admin/feature-flag-segments/{name}',
      summary: 'Update a segment',
      description: 'Replace a segment\'s description and conditions. Name, id and createdAt are preserved.',
      tags: ['Admin'],
      successStatus: 200,
      inputStructure: 'detailed'
    })
    .input(z.object({
      params: z.object({name: z.string()}),
      body: updateSegmentRequestSchema
    }))
    .output(segmentDtoSchema)
    .errors({
      'result:segment-not-found': {
        status: 404,
        data: errorSchemab24e
      }
    })
};
