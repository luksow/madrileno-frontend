import { z } from "zod";
import { oc } from "@orpc/contract";
import { featureFlagDtoSchema } from "./schemas";

export const adminFeatureFlagsKeyAuditContract = {
  get: oc
    .route({
      method: 'GET',
      path: '/admin/feature-flags/{key}/audit',
      summary: 'List a flag\'s audit entries',
      description: 'Audit trail for a flag (paginated, newest first by default). Entries survive flag deletion.',
      tags: ['Admin'],
      successStatus: 200,
      inputStructure: 'detailed'
    })
    .input(z.object({
      params: z.object({key: z.string()}),
      query: z.object({"sort-by": z.enum(["CreatedAt"]).nullish(), "sort-dir": z.enum(["Asc","Desc"]).nullish(), limit: z.number().int().nullish(), offset: z.number().int().nullish()}).optional()
    }))
    .output(z.object({
        "items": z.array(z.object({
        "action": z.enum(["Created","Deleted","Toggled","Updated"]),
        "actor": z.string(),
        "after": featureFlagDtoSchema.nullish(),
        "before": featureFlagDtoSchema.nullish(),
        "createdAt": z.iso.datetime({ offset: true }),
        "flagId": z.uuid().nullish(),
        "flagKey": z.string(),
        "id": z.uuid()})),
        "limit": z.number().int(),
        "offset": z.number().int(),
        "total": z.number().int()}))
};
