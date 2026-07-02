import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const adminLoggersContract = initContract().router({
  get: {
    summary: 'Inspect Logback loggers',
    description: 'List all configured loggers with their effective and configured levels.',
    method: 'GET',
    path: '/admin/loggers',
    responses: {
      200: z.array(z.object({
        "configuredLevel": z.string().nullish(),
        "effectiveLevel": z.string(),
        "name": z.string()})),
      401: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
    }
  }
});
