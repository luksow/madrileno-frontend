import { adminConfigContract } from "./admin-config.contract";
import { adminFeatureFlagSegmentsContract } from "./admin-feature-flag-segments.contract";
import { adminFeatureFlagSegmentsNameContract } from "./admin-feature-flag-segments---name.contract";
import { adminFeatureFlagsContract } from "./admin-feature-flags.contract";
import { adminFeatureFlagsKeyContract } from "./admin-feature-flags---key.contract";
import { adminFeatureFlagsKeyAuditContract } from "./admin-feature-flags---key-audit.contract";
import { adminFeatureFlagsKeyEvaluateContract } from "./admin-feature-flags---key-evaluate.contract";
import { adminFeatureFlagsKeyToggleContract } from "./admin-feature-flags---key-toggle.contract";
import { adminHealthCheckContract } from "./admin-health-check.contract";
import { adminHeapdumpContract } from "./admin-heapdump.contract";
import { adminLoggersContract } from "./admin-loggers.contract";
import { adminLoggersNameContract } from "./admin-loggers---name.contract";
import { adminThreaddumpContract } from "./admin-threaddump.contract";
import { v1AuctionsContract } from "./v1-auctions.contract";
import { v1AuctionsAuctionIdContract } from "./v1-auctions---auctionId.contract";
import { v1AuctionsAuctionIdBidsContract } from "./v1-auctions---auctionId-bids.contract";
import { v1AuctionsAuctionIdImagesContract } from "./v1-auctions---auctionId-images.contract";
import { v1AuctionsAuctionIdImagesImageIdContract } from "./v1-auctions---auctionId-images---imageId.contract";
import { v1AuctionsAuctionIdImagesImageIdContentContract } from "./v1-auctions---auctionId-images---imageId-content.contract";
import { v1AuctionsAuctionIdImagesOrderContract } from "./v1-auctions---auctionId-images-order.contract";
import { v1AuctionsAuctionIdStreamContract } from "./v1-auctions---auctionId-stream.contract";
import { v1AuctionsStreamContract } from "./v1-auctions-stream.contract";
import { v1AuthDevContract } from "./v1-auth-dev.contract";
import { v1AuthFirebaseContract } from "./v1-auth-firebase.contract";
import { v1AuthOidcProviderContract } from "./v1-auth-oidc---provider.contract";
import { v1AuthRefreshTokenContract } from "./v1-auth-refresh-token.contract";
import { v1AuthSessionsContract } from "./v1-auth-sessions.contract";
import { v1AuthSessionsSessionIdContract } from "./v1-auth-sessions---sessionId.contract";
import { v1FeatureFlagsContract } from "./v1-feature-flags.contract";
import { v1HealthCheckContract } from "./v1-health-check.contract";
import { v1UsersMeContract } from "./v1-users-me.contract";

export const contracts: {
  "admin-config": typeof adminConfigContract;
  "admin-feature-flag-segments": typeof adminFeatureFlagSegmentsContract;
  "admin-feature-flag-segments---name": typeof adminFeatureFlagSegmentsNameContract;
  "admin-feature-flags": typeof adminFeatureFlagsContract;
  "admin-feature-flags---key": typeof adminFeatureFlagsKeyContract;
  "admin-feature-flags---key-audit": typeof adminFeatureFlagsKeyAuditContract;
  "admin-feature-flags---key-evaluate": typeof adminFeatureFlagsKeyEvaluateContract;
  "admin-feature-flags---key-toggle": typeof adminFeatureFlagsKeyToggleContract;
  "admin-health-check": typeof adminHealthCheckContract;
  "admin-heapdump": typeof adminHeapdumpContract;
  "admin-loggers": typeof adminLoggersContract;
  "admin-loggers---name": typeof adminLoggersNameContract;
  "admin-threaddump": typeof adminThreaddumpContract;
  "v1-auctions": typeof v1AuctionsContract;
  "v1-auctions---auctionId": typeof v1AuctionsAuctionIdContract;
  "v1-auctions---auctionId-bids": typeof v1AuctionsAuctionIdBidsContract;
  "v1-auctions---auctionId-images": typeof v1AuctionsAuctionIdImagesContract;
  "v1-auctions---auctionId-images---imageId": typeof v1AuctionsAuctionIdImagesImageIdContract;
  "v1-auctions---auctionId-images---imageId-content": typeof v1AuctionsAuctionIdImagesImageIdContentContract;
  "v1-auctions---auctionId-images-order": typeof v1AuctionsAuctionIdImagesOrderContract;
  "v1-auctions---auctionId-stream": typeof v1AuctionsAuctionIdStreamContract;
  "v1-auctions-stream": typeof v1AuctionsStreamContract;
  "v1-auth-dev": typeof v1AuthDevContract;
  "v1-auth-firebase": typeof v1AuthFirebaseContract;
  "v1-auth-oidc---provider": typeof v1AuthOidcProviderContract;
  "v1-auth-refresh-token": typeof v1AuthRefreshTokenContract;
  "v1-auth-sessions": typeof v1AuthSessionsContract;
  "v1-auth-sessions---sessionId": typeof v1AuthSessionsSessionIdContract;
  "v1-feature-flags": typeof v1FeatureFlagsContract;
  "v1-health-check": typeof v1HealthCheckContract;
  "v1-users-me": typeof v1UsersMeContract
} = {
  "admin-config": adminConfigContract,
  "admin-feature-flag-segments": adminFeatureFlagSegmentsContract,
  "admin-feature-flag-segments---name": adminFeatureFlagSegmentsNameContract,
  "admin-feature-flags": adminFeatureFlagsContract,
  "admin-feature-flags---key": adminFeatureFlagsKeyContract,
  "admin-feature-flags---key-audit": adminFeatureFlagsKeyAuditContract,
  "admin-feature-flags---key-evaluate": adminFeatureFlagsKeyEvaluateContract,
  "admin-feature-flags---key-toggle": adminFeatureFlagsKeyToggleContract,
  "admin-health-check": adminHealthCheckContract,
  "admin-heapdump": adminHeapdumpContract,
  "admin-loggers": adminLoggersContract,
  "admin-loggers---name": adminLoggersNameContract,
  "admin-threaddump": adminThreaddumpContract,
  "v1-auctions": v1AuctionsContract,
  "v1-auctions---auctionId": v1AuctionsAuctionIdContract,
  "v1-auctions---auctionId-bids": v1AuctionsAuctionIdBidsContract,
  "v1-auctions---auctionId-images": v1AuctionsAuctionIdImagesContract,
  "v1-auctions---auctionId-images---imageId": v1AuctionsAuctionIdImagesImageIdContract,
  "v1-auctions---auctionId-images---imageId-content": v1AuctionsAuctionIdImagesImageIdContentContract,
  "v1-auctions---auctionId-images-order": v1AuctionsAuctionIdImagesOrderContract,
  "v1-auctions---auctionId-stream": v1AuctionsAuctionIdStreamContract,
  "v1-auctions-stream": v1AuctionsStreamContract,
  "v1-auth-dev": v1AuthDevContract,
  "v1-auth-firebase": v1AuthFirebaseContract,
  "v1-auth-oidc---provider": v1AuthOidcProviderContract,
  "v1-auth-refresh-token": v1AuthRefreshTokenContract,
  "v1-auth-sessions": v1AuthSessionsContract,
  "v1-auth-sessions---sessionId": v1AuthSessionsSessionIdContract,
  "v1-feature-flags": v1FeatureFlagsContract,
  "v1-health-check": v1HealthCheckContract,
  "v1-users-me": v1UsersMeContract
};

