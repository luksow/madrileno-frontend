import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const v1HealthCheckContract = initContract().router({
  get: {
    summary: 'Returns app metadata',
    description: 'Liveness probe — does not touch dependencies',
    method: 'GET',
    path: '/v1/health-check',
    responses: {
      200: z.object({
        "apiVersion": z.string(),
        "environment": z.enum(["Dev","Prod","Staging","Test"]),
        "name": z.string(),
        "version": z.string()})
    }
  }
});
