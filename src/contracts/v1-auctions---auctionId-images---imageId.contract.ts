import { z } from "zod";
import { oc } from "@orpc/contract";
import { errorSchema1b1f, errorSchema4c2a } from "./schemas";

export const v1AuctionsAuctionIdImagesImageIdContract = {
  delete: oc
    .route({
      method: 'DELETE',
      path: '/v1/auctions/{auctionId}/images/{imageId}',
      summary: 'Seller-only: detaches an image from the auction',
      description: 'Soft-delete an image and remove it from object storage',
      tags: ['Auction images'],
      successStatus: 204,
      inputStructure: 'detailed'
    })
    .input(z.object({
      params: z.object({auctionId: z.uuid(), imageId: z.uuid()})
    }))
    .output(z.void())
    .errors({
      'result:image-not-found': {
        status: 404,
        data: errorSchema1b1f
      },
      'result:not-owner': {
        status: 403,
        data: errorSchema4c2a
      }
    })
};
