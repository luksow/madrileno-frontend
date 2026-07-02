import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const v1AuctionsAuctionIdImagesImageIdContract = initContract().router({
  delete: {
    summary: 'Seller-only: detaches an image from the auction',
    description: 'Soft-delete an image and remove it from object storage',
    method: 'DELETE',
    path: '/v1/auctions/:auctionId/images/:imageId',
    pathParams: z.object({auctionId: z.string().uuid(), imageId: z.string().uuid()}),
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
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
    }
  }
});
