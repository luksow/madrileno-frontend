import { oc } from "@orpc/contract";

export const v1AuctionsStreamContract = {
  get: oc
    .route({
      method: 'GET',
      path: '/v1/auctions/stream',
      summary: 'Live auction event stream (WebSocket)',
      description: 'Live auction event stream over WebSocket — the firehose (every auction).\n\nConnect with a WebSocket client to receive a JSON frame per event. Wire format:\n`{"kind": "...", "data": {...}}` where `kind` is one of `AuctionCreated`, `BidPlaced`,\n`AuctionCancelled`, `AuctionClosed` and `data` is the per-variant flat DTO. See\n`docs/adding-a-module.md` for the wire shapes.\n\nFor a single auction\'s events, connect to `/v1/auctions/{auctionId}/stream` instead.\n\nOpenAPI 3.x does not model WebSockets; this entry exists for discoverability only.\nA WebSocket upgrade request returns 101 Switching Protocols and starts streaming.\nA plain GET (no `Upgrade` header) returns 426 Upgrade Required with the body\n`Upgrade required for WebSocket communication.` — documented below.',
      tags: ['Auctions'],
      inputStructure: 'detailed'
    })
};
