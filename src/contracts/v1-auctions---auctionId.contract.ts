import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const v1AuctionsAuctionIdContract = initContract().router({
  delete: {
    summary: 'Seller-only: cancels an open auction',
    description: 'Cancel an auction',
    method: 'DELETE',
    path: '/v1/auctions/:auctionId',
    pathParams: z.object({auctionId: z.string().uuid()}),
    body: z.undefined(),
    responses: {
      204: z.undefined(),
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
  },
  get: {
    summary: 'Unauthenticated: returns an auction with its current price',
    description: 'Get an auction by id',
    method: 'GET',
    path: '/v1/auctions/:auctionId',
    pathParams: z.object({auctionId: z.string().uuid()}),
    responses: {
      200: z.object({
        "appellation": z.string(),
        "bottleCount": z.number().int(),
        "bottleSize": z.enum(["DoubleMagnum","Half","Jeroboam","Magnum","Other","Standard"]),
        "color": z.enum(["Dessert","Fortified","Orange","Red","Rose","Sparkling","White"]),
        "currency": z.string(),
        "currentPrice": z.number(),
        "description": z.string().nullish(),
        "endsAt": z.coerce.date(),
        "id": z.string().uuid(),
        "producerName": z.string(),
        "rating": z.object({
        "rating": z.number(),
        "ratingsCount": z.number().int()}).nullish(),
        "region": z.string(),
        "sellerId": z.string().uuid(),
        "startingPrice": z.number(),
        "startsAt": z.coerce.date(),
        "status": z.enum(["Cancelled","Closed","Open"]),
        "vintage": z.number().int().nullish(),
        "wineName": z.string()}),
      404: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
    }
  }
});
