import { z } from "zod";
import { oc } from "@orpc/contract";
import { errorSchema1bb3, errorSchema7023, placeBidRequestSchema } from "./schemas";

export const v1AuctionsAuctionIdBidsContract = {
  get: oc
    .route({
      method: 'GET',
      path: '/v1/auctions/{auctionId}/bids',
      summary: 'Unauthenticated: bids newest-first; bidder identity is a per-auction pseudonym (bidderRef)',
      description: 'List the bid history for an auction, newest-first, cursor-paginated by bid id.',
      tags: ['Auctions'],
      successStatus: 200,
      inputStructure: 'detailed'
    })
    .input(z.object({
      params: z.object({auctionId: z.uuid()}),
      query: z.object({limit: z.number().int().nullish(), "after-id": z.uuid().nullish()}).optional()
    }))
    .output(z.object({
        "hasMore": z.boolean(),
        "items": z.array(z.object({
        "amount": z.number(),
        "bidderRef": z.string(),
        "createdAt": z.iso.datetime({ offset: true }),
        "currency": z.string(),
        "id": z.uuid()}))}))
    .errors({
      'result:auction-not-found': {
        status: 404,
        data: errorSchema7023
      }
    }),
  post: oc
    .route({
      method: 'POST',
      path: '/v1/auctions/{auctionId}/bids',
      summary: 'Authenticated: places a bid above the current highest',
      description: 'Place a bid on an auction',
      tags: ['Auctions'],
      successStatus: 201,
      inputStructure: 'detailed'
    })
    .input(z.object({
      params: z.object({auctionId: z.uuid()}),
      body: placeBidRequestSchema
    }))
    .output(z.object({
        "amount": z.number(),
        "auctionId": z.uuid(),
        "bidderId": z.uuid(),
        "createdAt": z.iso.datetime({ offset: true }),
        "id": z.uuid()}))
    .errors({
      'result:already-highest-bidder': {
        status: 409,
        data: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.enum(["result:already-highest-bidder"]).describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
      },
      'result:auction-not-found': {
        status: 404,
        data: errorSchema7023
      },
      'result:auction-not-open': {
        status: 409,
        data: errorSchema1bb3
      },
      'result:auction-not-started': {
        status: 409,
        data: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.enum(["result:auction-not-started"]).describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
      },
      'result:bid-too-low': {
        status: 409,
        data: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.enum(["result:bid-too-low"]).describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
      },
      'result:cannot-bid-on-own-auction': {
        status: 403,
        data: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.enum(["result:cannot-bid-on-own-auction"]).describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
      }
    })
};
