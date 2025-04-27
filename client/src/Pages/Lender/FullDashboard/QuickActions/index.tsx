import { Upload, Plus, FileText, BarChart2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

const QuickActions = () => {
  const navigate = useNavigate()

  const actions = [
    {
      title: "Upload Portfolio",
      description: "Upload a new debt portfolio",
      icon: <Upload className="h-5 w-5 text-zinc" />,
      action: () => navigate("/upload"),
    },
    {
      title: "Create Auction",
      description: "Start a new auction for your debt",
      icon: <Plus className="h-5 w-5 text-zinc" />,
      action: () => navigate("/portfolios/create-auction"),
    },
    {
      title: "Upload Documents",
      description: "Add documents to your portfolios",
      icon: <FileText className="h-5 w-5 text-zinc" />,
      action: () => navigate("/documents/upload"),
    },
    {
      title: "View Analytics",
      description: "See detailed performance metrics",
      icon: <BarChart2 className="h-5 w-5 text-zinc" />,
      action: () => navigate("/analytics"),
    },
  ]

  return (

    // <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

    // {/* Quick Actions */}
    // <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
    //   <h2 className="text-lg font-semibold text-zinc mb-6">Quick Actions</h2>
    //   <QuickActions />
    // </div>
    // </div>


    <div className="space-y-4">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.action}
          className="w-full flex items-center p-3 rounded-lg hover:bg-zinc/5 transition-colors text-left"
        >
          <div className="p-2 mr-4 rounded-full bg-zinc/10">{action.icon}</div>
          <div>
            <h3 className="font-medium text-zinc">{action.title}</h3>
            <p className="text-sm text-gray-700">{action.description}</p>
          </div>
        </button>
      ))}
    </div>




  )
}

export default QuickActions


