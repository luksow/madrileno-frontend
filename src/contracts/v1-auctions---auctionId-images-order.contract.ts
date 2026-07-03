import { z } from "zod";
import { oc } from "@orpc/contract";

export const v1AuctionsAuctionIdImagesOrderContract = {
  patch: oc
    .route({
      method: 'PATCH',
      path: '/v1/auctions/{auctionId}/images/order',
      summary: 'Seller-only: bulk position update with mismatched-id guard',
      description: 'Reorder images on an auction (must include every active image id)',
      successStatus: 204,
      inputStructure: 'detailed'
    })
    .input(z.object({
      params: z.object({auctionId: z.string().uuid()}),
      body: z.object({
        "orderedIds": z.array(z.string().uuid())})
    }))
    .output(z.void())
};

export const v1AuctionsAuctionIdImagesOrderErrors = {
  patch: {
    400: z.object({
        "detail": z.string().describe("Human-readable explanation").nullish(),
        "instance": z.string().describe("URI reference identifying the specific occurrence").nullish(),
        "status": z.number().int().describe("HTTP status code"),
        "title": z.string().describe("Short human-readable summary"),
        "type": z.string().describe("A URI reference identifying the problem type")}).describe("RFC 9457 Problem Details error response")
  }
};
