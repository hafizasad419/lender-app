import { Clock, ArrowUpRight, FileText, DollarSign, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

const RecentActivity = () => {
  // Mock data for recent activities
  const activities = [
    {
      id: 1,
      type: "bid",
      message: "New bid received on TechCorp Solutions",
      amount: "$210,000",
      time: new Date(2024, 2, 17), // March 17, 2024
      icon: <DollarSign className="h-4 w-4 text-green-600" />,
    },
    {
      id: 2,
      type: "document",
      message: "New document uploaded to Healthcare Services",
      time: new Date(2024, 2, 16), // March 16, 2024
      icon: <FileText className="h-4 w-4 text-zinc" />,
    },
    {
      id: 3,
      type: "auction",
      message: "Auction for Retail Chain Invoices is ending soon",
      time: new Date(2024, 2, 15), // March 15, 2024
      icon: <Clock className="h-4 w-4 text-orange" />,
    },
    {
      id: 4,
      type: "alert",
      message: "Portfolio expiring in 7 days: Small Business Group",
      time: new Date(2024, 2, 14), // March 14, 2024
      icon: <AlertCircle className="h-4 w-4 text-orange" />,
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start p-3 border-b border-gray-100 last:border-0">
          <div className="p-2 mr-3 rounded-full bg-gray-100">{activity.icon}</div>
          <div className="flex-1">
            <p className="text-gray-700">{activity.message}</p>
            {activity.amount && <p className="text-zinc font-medium">{activity.amount}</p>}
            <p className="text-xs text-gray-500 mt-1">{formatDistanceToNow(activity.time, { addSuffix: true })}</p>
          </div>
          <button className="p-1 text-zinc hover:bg-zinc/5 rounded">
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

export default RecentActivity

