"use client"

import { Clock, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

const UpcomingAuctions = () => {
  const navigate = useNavigate()

  // Mock data for upcoming auctions
  const auctions = [
    {
      id: "a1",
      portfolioName: "TechCorp Solutions",
      totalValue: "$250,000",
      currentBid: "$210,000",
      endsIn: "3 days",
      debtors: 150,
      industry: "Technology Services",
    },
    {
      id: "a2",
      portfolioName: "Retail Chain Invoices",
      totalValue: "$125,000",
      currentBid: "$95,000",
      endsIn: "1 day",
      debtors: 75,
      industry: "Retail",
    },
    {
      id: "a3",
      portfolioName: "Healthcare Services",
      totalValue: "$320,000",
      currentBid: "$280,000",
      endsIn: "5 days",
      debtors: 210,
      industry: "Healthcare",
    },
    {
      id: "a4",
      portfolioName: "Manufacturing Group",
      totalValue: "$180,000",
      currentBid: "$150,000",
      endsIn: "2 days",
      debtors: 90,
      industry: "Manufacturing",
    },
  ]

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Portfolio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Industry
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Total Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Current Bid
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Debtors
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Ends In
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {auctions.map((auction) => (
              <tr key={auction.id} className="hover:bg-zinc/5">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-zinc">{auction.portfolioName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{auction.industry}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{auction.totalValue}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-green-600">{auction.currentBid}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{auction.debtors}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-orange">
                    <Clock className="h-4 w-4 mr-1" />
                    {auction.endsIn}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => navigate(`/auctions/${auction.id}`)}
                    className="text-zinc hover:text-orange transition-colors"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-right">
        <button onClick={() => navigate("/auctions")} className="flex items-center ml-auto text-zinc hover:underline">
          View all auctions <ArrowRight className="ml-1 h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default UpcomingAuctions

