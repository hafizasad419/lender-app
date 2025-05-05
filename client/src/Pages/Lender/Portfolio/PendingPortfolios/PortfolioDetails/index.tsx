import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Axios } from "@src/api"
import { ErrorNotification, formatDebtType } from "@src/utils"
import Fallback from "@src/Components/Fallback"
import BackButton from "@src/Components/BackButton"

// Import our new components
import BidList from "./components/BidList"
import PortfolioInfo from "./components/PortfolioInfo"
import DebtEntries from "./components/DebtEntries"

const PortfolioDetails = () => {
  const { portfolioId } = useParams()
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!portfolioId) return
      try {
        const response = await Axios.get(`/portfolio/listings/${portfolioId}`)
        setPortfolioData(response.data?.data)
        // console.log("Fetched:", response.data?.data)
      } catch (error: any) {
        ErrorNotification(error?.response?.data?.error || "Failed to fetch portfolio.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [portfolioId])

  if (loading) return <Fallback />

  if (!portfolioData || !portfolioData.debtEntries?.length) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-zinc-700 mb-2">No Debt Entries Found</h2>
        <p className="text-gray-500">This portfolio currently has no debt entries.</p>
      </div>
    )
  }

  const { portfolio, debtEntries, bids } = portfolioData

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="mb-6">
        <BackButton to="/portfolio" />
      </div>

      {/* All Bids Section - Now at the top */}
      <BidList
      totalPrincipalAmount={portfolio?.totalPrincipalAmount}
      bids={bids} />

      {/* Portfolio Info Section */}
      <PortfolioInfo
        portfolio={portfolio}
        formatDebtType={formatDebtType} />

      {/* Debt Entries Section */}
      <DebtEntries

      debtEntries={debtEntries} />
    </div>
  )
}

export default PortfolioDetails
