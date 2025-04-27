import NotFound from '@src/Components/NotFound'
import CollectorDashboard from '@src/Pages/Collector/CollectorDashboard'
import CollectorProfile from '@src/Pages/Collector/CollectorProfile'
import Marketplace from '@src/Pages/Collector/Marketplace'
import PortfolioDetails from '@src/Pages/Collector/Marketplace/PortfolioDetails'
import MyBids from '@src/Pages/Collector/MyBids'
import { Navigate, Route, Routes } from 'react-router-dom'

function CollectorRoutes() {
  return (
    <Routes>
      <Route path="*" element={<Navigate to={"/marketplace"} />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/marketplace/listings/:portfolioId" element={<PortfolioDetails />} />
      <Route path="/dashboard" element={<CollectorDashboard />} />
      <Route path="/bids" element={<MyBids />} />
      <Route path="/profile" element={<CollectorProfile />} />
      {/* <Route path="*" element={<NotFound />} /> */}

    </Routes>
  )
}

export default CollectorRoutes
