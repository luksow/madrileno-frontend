import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const adminFeatureFlagsKeyAuditContract = initContract().router({
  get: {
    summary: 'List a flag\'s audit entries',
    description: 'Audit trail for a flag (paginated, newest first by default). Entries survive flag deletion.',
    method: 'GET',
    path: '/admin/feature-flags/:key/audit',
    pathParams: z.object({key: z.string()}),
    query: z.object({"sort-by": z.enum(["CreatedAt"]).nullish(), "sort-dir": z.enum(["Asc","Desc"]).nullish(), limit: z.number().int().nullish(), offset: z.number().int().nullish()}),
    responses: {
      200: z.object({
        "items": z.array(z.object({
        "action": z.enum(["Created","Deleted","Toggled","Updated"]),
        "actor": z.string(),
        "after": z.object({
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
        "updatedAt": z.coerce.date()}).nullish(),
        "before": z.object({
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
        "updatedAt": z.coerce.date()}).nullish(),
        "createdAt": z.coerce.date(),
        "flagId": z.string().uuid().nullish(),
        "flagKey": z.string(),
        "id": z.string().uuid()})),
        "limit": z.number().int(),
        "offset": z.number().int(),
        "total": z.number().int()})
    }
  }
});
