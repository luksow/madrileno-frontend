import { z } from "zod";
import { oc } from "@orpc/contract";

export const adminLoggersContract = {
  get: oc
    .route({
      method: 'GET',
      path: '/admin/loggers',
      summary: 'Inspect Logback loggers',
      description: 'List all configured loggers with their effective and configured levels.',
      tags: ['Admin'],
      successStatus: 200,
      inputStructure: 'detailed'
    })
    .output(z.array(z.object({
        "configuredLevel": z.string().nullish(),
        "effectiveLevel": z.string(),
        "name": z.string()})))
    .errors({
      'rejection:authentication-failed': {
        status: 401,
        data: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
      }
    })
};
