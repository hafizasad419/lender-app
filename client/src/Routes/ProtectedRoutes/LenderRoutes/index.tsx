// import NotFound from '@src/Components/NotFound'
import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

// lazy import 
const Dashboard = lazy(() => import('@src/Pages/Lender/Dashboard'))
const UploadDebt = lazy(() => import('@src/Pages/Lender/UploadDebt'))
const PortfolioDetails = lazy(() => import('@src/Pages/Lender/Portfolio/PortfolioDetails'))
const Portfolio = lazy(() => import('@src/Pages/Lender/Portfolio'))
const LenderProfile = lazy(() => import('@src/Pages/Lender/LenderProfile'))

function LenderRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadDebt />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/profile" element={<LenderProfile />} />
            <Route path="/portfolio/:portfolioId" element={<PortfolioDetails />} />
            <Route path="*" element={<Navigate to={"/"} />} />

        </Routes>
    )
}

export default LenderRoutes
