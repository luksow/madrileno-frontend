import { z } from "zod";
import { oc } from "@orpc/contract";
import { errorSchema1b1f } from "./schemas";

export const v1AuctionsAuctionIdImagesImageIdContentContract = {
  get: oc
    .route({
      method: 'GET',
      path: '/v1/auctions/{auctionId}/images/{imageId}/content',
      summary: 'Public: image content',
      description: 'Stream or redirect to image bytes. The disk / in-memory backend streams; S3 returns 303 SeeOther with a presigned Location.',
      tags: ['Auction images'],
      successStatus: 200,
      inputStructure: 'detailed'
    })
    .input(z.object({
      params: z.object({auctionId: z.uuid(), imageId: z.uuid()})
    }))
    .output(z.string())
    .errors({
      'result:image-not-found': {
        status: 404,
        data: errorSchema1b1f
      }
    })
};
