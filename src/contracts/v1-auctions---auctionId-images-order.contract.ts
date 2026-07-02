import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const v1AuctionsAuctionIdImagesOrderContract = initContract().router({
  patch: {
    summary: 'Seller-only: bulk position update with mismatched-id guard',
    description: 'Reorder images on an auction (must include every active image id)',
    method: 'PATCH',
    path: '/v1/auctions/:auctionId/images/order',
    pathParams: z.object({auctionId: z.string().uuid()}),
    body: z.object({
        "orderedIds": z.array(z.string().uuid())}),
    responses: {
      204: z.undefined(),
      400: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
    }
  }
});
