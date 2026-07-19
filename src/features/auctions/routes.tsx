import type { RouteObject } from 'react-router-dom'
import { AuctionDetailPage } from './pages/AuctionDetailPage'
import { AuctionsPage } from './pages/AuctionsPage'

export const auctionRoutes: RouteObject[] = [
  { path: '/', element: <AuctionsPage /> },
  { path: '/auctions/:auctionId', element: <AuctionDetailPage /> },
]
