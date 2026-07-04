import { z } from "zod";
import { oc } from "@orpc/contract";

export const adminLoggersNameContract = {
  get: oc
    .route({
      method: 'GET',
      path: '/admin/loggers/{name}',
      summary: 'Inspect one Logback logger',
      description: 'Get one logger\'s configured + effective level. 404 if Logback has never been told about the name.',
      tags: ['Admin'],
      successStatus: 200,
      inputStructure: 'detailed'
    })
    .input(z.object({
      params: z.object({name: z.string()})
    }))
    .output(z.object({
        "configuredLevel": z.string().nullish(),
        "effectiveLevel": z.string(),
        "name": z.string()}))
    .errors({
      'result:logger-not-found': {
        status: 404,
        data: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
      }
    }),
  post: oc
    .route({
      method: 'POST',
      path: '/admin/loggers/{name}',
      summary: 'Set a Logback logger\'s level',
      description: 'Set a logger\'s configured level. Send `{"level":"DEBUG"}` to set; `{"level":null}` (or `{}`) to clear and inherit from parent. 404 if the logger doesn\'t exist — Logback only knows about a logger after something has named it.',
      tags: ['Admin'],
      successStatus: 200,
      inputStructure: 'detailed'
    })
    .input(z.object({
      params: z.object({name: z.string()}),
      body: z.object({
        "level": z.string().nullish()})
    }))
    .output(z.object({
        "configuredLevel": z.string().nullish(),
        "effectiveLevel": z.string(),
        "name": z.string()}))
    .errors({
      'rejection:authentication-failed': {
        status: 401,
        data: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
      },
      'result:invalid-log-level': {
        status: 400,
        data: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
      },
      'result:logger-not-found': {
        status: 404,
        data: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
      }
    })
};
