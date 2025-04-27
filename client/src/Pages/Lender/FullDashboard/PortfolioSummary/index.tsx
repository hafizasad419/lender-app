import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

const PortfolioSummary = () => {
  const navigate = useNavigate()

  // Mock data for portfolio distribution
  const portfolioData = [
    { name: "Active Auctions", value: 40, color: "#246F78" },
    { name: "Pending Collection", value: 30, color: "#F55800" },
    { name: "Completed", value: 20, color: "#4CAF50" },
    { name: "Expired", value: 10, color: "#9E9E9E" },
  ]

  // Mock data for recent portfolios
  const recentPortfolios = [
    {
      id: "p1",
      name: "TechCorp Solutions",
      totalValue: "$250,000",
      debtors: 150,
      status: "Active Auction",
    },
    {
      id: "p2",
      name: "Retail Chain Invoices",
      totalValue: "$125,000",
      debtors: 75,
      status: "Pending",
    },
    {
      id: "p3",
      name: "Healthcare Services",
      totalValue: "$320,000",
      debtors: 210,
      status: "Completed",
    },
  ]

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-md font-medium text-zinc mb-4">Portfolio Distribution</h3>
          <div style={{ width: "100%", height: 200 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <h3 className="text-md font-medium text-zinc mb-4">Recent Portfolios</h3>
          <div className="space-y-3">
            {recentPortfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                className="p-3 border border-gray-200 rounded-lg hover:bg-zinc/5 cursor-pointer"
                onClick={() => navigate(`/portfolios/${portfolio.id}`)}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-zinc">{portfolio.name}</h4>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      portfolio.status === "Active Auction"
                        ? "bg-zinc/10 text-zinc"
                        : portfolio.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {portfolio.status}
                  </span>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-700">
                  <span>{portfolio.totalValue}</span>
                  <span>{portfolio.debtors} debtors</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button onClick={() => navigate("/portfolios")} className="flex items-center text-zinc hover:underline mt-2">
        View all portfolios <ArrowRight className="ml-1 h-4 w-4" />
      </button>
    </div>
  )
}

export default PortfolioSummary
