import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const adminHealthCheckContract = initContract().router({
  get: {
    summary: 'Admin readiness probe',
    description: 'Admin-only deep health check — probes Postgres and SMTP, returns 503 if any dep is down. Gated by Basic Auth.',
    method: 'GET',
    path: '/admin/health-check',
    responses: {
      200: z.object({
        "postgres": z.object({
        "error": z.string().nullish(),
        "latencyMs": z.number().int().nullish(),
        "status": z.enum(["Down","Up"])}),
        "smtp": z.object({
        "error": z.string().nullish(),
        "latencyMs": z.number().int().nullish(),
        "status": z.enum(["Down","Up"])}),
        "status": z.enum(["Down","Up"])}),
      401: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
    }
  }
});
