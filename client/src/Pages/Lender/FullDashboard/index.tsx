import { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@src/redux/store"
import { Briefcase, TrendingUp, Clock, PieChart, Upload } from "lucide-react"
import PortfolioSummary from "./PortfolioSummary"
import RecentActivity from "./RecentActivity"
import UpcomingAuctions from "./UpcomingAuctions"
import PerformanceChart from "./PerformanceChart"
import QuickActions from "./QuickActions"

const FullDashboard = () => {
  const lender  = useSelector((state: RootState) => state.user)
  const [timeframe, setTimeframe] = useState<"week" | "month" | "quarter" | "year">("month")

  // Mock data for dashboard stats
  const stats = [
    {
      title: "Active Portfolios",
      value: "12",
      change: "+2",
      icon: <Briefcase className="h-6 w-6 text-zinc" />,
    },
    {
      title: "Total Debt Value",
      value: "$1.2M",
      change: "+$250K",
      icon: <TrendingUp className="h-6 w-6 text-zinc" />,
    },
    {
      title: "Active Auctions",
      value: "8",
      change: "+3",
      icon: <Clock className="h-6 w-6 text-zinc" />,
    },
    {
      title: "Debt Recovery",
      value: "68%",
      change: "+5%",
      icon: <PieChart className="h-6 w-6 text-zinc" />,
    },
  ]

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc">Welcome back, {lender?.name}</h1>
          <p className="text-gray-700">Here's what's happening with your debt portfolios</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc text-white rounded-md hover:bg-zinc/90 transition-colors">
            <Upload className="h-4 w-4" />
            Upload Portfolio
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-700 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-zinc">{stat.value}</h3>
                <span className="text-sm text-green-600">{stat.change} this month</span>
              </div>
              <div className="p-3 rounded-full bg-zinc/10">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-zinc">Portfolio Performance</h2>
            <div className="flex bg-zinc/5 rounded-md p-1">
              {(["week", "month", "quarter", "year"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    timeframe === t ? "bg-zinc text-white" : "text-gray-700 hover:bg-zinc/10"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <PerformanceChart timeframe={timeframe} />
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc mb-6">Quick Actions</h2>
          <QuickActions />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Summary */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc mb-6">Portfolio Summary</h2>
          <PortfolioSummary />
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc mb-6">Recent Activity</h2>
          <RecentActivity />
        </div>
      </div>

      {/* Upcoming Auctions */}
      <div className="mt-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc mb-6">Upcoming Auctions</h2>
        <UpcomingAuctions />
      </div>
    </div>
  )
}

export default FullDashboard
