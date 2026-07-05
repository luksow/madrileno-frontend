import { z } from "zod";
import { oc } from "@orpc/contract";
import { depCheckSchema, errorSchema } from "./schemas";

export const adminHealthCheckContract = {
  get: oc
    .route({
      method: 'GET',
      path: '/admin/health-check',
      summary: 'Admin readiness probe',
      description: 'Admin-only deep health check — probes Postgres and SMTP, returns 503 if any dep is down. Gated by Basic Auth.',
      tags: ['Admin'],
      successStatus: 200,
      inputStructure: 'detailed'
    })
    .output(z.object({
        "postgres": depCheckSchema,
        "smtp": depCheckSchema,
        "status": z.enum(["Down","Up"])}))
    .errors({
      'rejection:authentication-failed': {
        status: 401,
        data: errorSchema
      }
    })
};
