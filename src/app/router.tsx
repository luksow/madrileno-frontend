import { useRoutes, type RouteObject } from 'react-router-dom'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { NotFound } from './NotFound'
// frontend:auction-block-start
import { auctionRoutes } from '@/features/auctions/routes'
// frontend:auction-block-end

const routes: RouteObject[] = [
  // frontend:auction-block-start
  ...auctionRoutes,
  // frontend:auction-block-end
  // frontend:home-anchor — init-project replaces this line with the Home '/' route
  { path: '/login', element: <LoginPage /> },
  { path: '*', element: <NotFound /> },
]

export function AppRoutes() {
  return useRoutes(routes)
}
