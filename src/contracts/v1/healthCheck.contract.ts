import { z } from "zod";
import { oc } from "@orpc/contract";

export const v1HealthCheck = {
  get: oc
    .route({
      method: 'GET',
      path: '/v1/health-check',
      summary: 'Returns app metadata',
      description: 'Liveness probe — does not touch dependencies',
      tags: ['Health Check'],
      successStatus: 200,
      inputStructure: 'detailed'
    })
    .output(z.object({
        "apiVersion": z.string(),
        "environment": z.enum(["Dev","Prod","Staging","Test"]),
        "name": z.string(),
        "version": z.string()}))
};
