import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const v1AuctionsAuctionIdBidsContract = initContract().router({
  get: {
    summary: 'Unauthenticated: bids newest-first; bidder identity is a per-auction pseudonym (bidderRef)',
    description: 'List the bid history for an auction, newest-first, cursor-paginated by bid id.',
    method: 'GET',
    path: '/v1/auctions/:auctionId/bids',
    pathParams: z.object({auctionId: z.string().uuid()}),
    query: z.object({limit: z.number().int().nullish(), "after-id": z.string().uuid().nullish()}),
    responses: {
      200: z.object({
        "hasMore": z.boolean(),
        "items": z.array(z.object({
        "amount": z.number(),
        "bidderRef": z.string(),
        "createdAt": z.coerce.date(),
        "currency": z.string(),
        "id": z.string().uuid()}))}),
      404: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
    }
  },
  post: {
    summary: 'Authenticated: places a bid above the current highest',
    description: 'Place a bid on an auction',
    method: 'POST',
    path: '/v1/auctions/:auctionId/bids',
    pathParams: z.object({auctionId: z.string().uuid()}),
    body: z.object({
        "amount": z.number()}),
    responses: {
      201: z.object({
        "amount": z.number(),
        "auctionId": z.string().uuid(),
        "bidderId": z.string().uuid(),
        "createdAt": z.coerce.date(),
        "id": z.string().uuid()}),
      403: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response"),
      404: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response"),
      409: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
    }
  }
});
