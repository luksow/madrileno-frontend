import { z } from "zod";
import { oc } from "@orpc/contract";

export const v1AuctionsAuctionIdStreamContract = {
  get: oc
    .route({
      method: 'GET',
      path: '/v1/auctions/{auctionId}/stream',
      summary: 'Live event stream for one auction (WebSocket)',
      description: 'Live event stream for a single auction over WebSocket — same wire format as `/v1/auctions/stream`,\nbut only `AuctionCreated`/`BidPlaced`/`AuctionCancelled`/`AuctionClosed` events for this `auctionId`.\n\nOpenAPI 3.x does not model WebSockets; this entry exists for discoverability only. A plain GET\n(no `Upgrade` header) returns 426 Upgrade Required with the body `Upgrade required for WebSocket communication.`',
      inputStructure: 'detailed'
    })
    .input(z.object({
      params: z.object({auctionId: z.string().uuid()})
    }))
};

export const v1AuctionsAuctionIdStreamErrors = {
  get: {
    426: z.string()
  }
};
