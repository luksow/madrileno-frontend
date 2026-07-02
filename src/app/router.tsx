import { useRoutes, type RouteObject } from 'react-router-dom'
import { LoginPage } from '../auth/LoginPage'
import { Home } from './Home'
import { NotFound } from './NotFound'
// frontend:auction-block-start
import { auctionRoutes } from '../features/auctions/routes'
// frontend:auction-block-end

// While the auction demo is present its '/' route comes first and wins the tie
// against Home (matchRoutes keeps definition order among equal-score matches);
// after init-project strips the demo, Home takes over.
const routes: RouteObject[] = [
  // frontend:auction-block-start
  ...auctionRoutes,
  // frontend:auction-block-end
  { path: '/', element: <Home /> },
  { path: '/login', element: <LoginPage /> },
  { path: '*', element: <NotFound /> },
]

export function AppRoutes() {
  return useRoutes(routes)
}
