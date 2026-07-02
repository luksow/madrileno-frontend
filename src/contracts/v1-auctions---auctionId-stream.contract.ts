import { z } from "zod";
import { initContract } from "@ts-rest/core";

export const v1AuctionsAuctionIdStreamContract = initContract().router({
  get: {
    summary: 'Live event stream for one auction (WebSocket)',
    description: 'Live event stream for a single auction over WebSocket — same wire format as `/v1/auctions/stream`,\nbut only `AuctionCreated`/`BidPlaced`/`AuctionCancelled`/`AuctionClosed` events for this `auctionId`.\n\nOpenAPI 3.x does not model WebSockets; this entry exists for discoverability only. A plain GET\n(no `Upgrade` header) returns 426 Upgrade Required with the body `Upgrade required for WebSocket communication.`',
    method: 'GET',
    path: '/v1/auctions/:auctionId/stream',
    pathParams: z.object({auctionId: z.string().uuid()}),
    responses: {
      426: z.string()
    }
  }
});
