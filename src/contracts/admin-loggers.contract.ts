import { z } from "zod";
import { oc } from "@orpc/contract";
import { errorSchema, loggerLevelDtoSchema } from "./schemas";

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
    .output(z.array(loggerLevelDtoSchema))
    .errors({
      'rejection:authentication-failed': {
        status: 401,
        data: errorSchema
      }
    })
};
