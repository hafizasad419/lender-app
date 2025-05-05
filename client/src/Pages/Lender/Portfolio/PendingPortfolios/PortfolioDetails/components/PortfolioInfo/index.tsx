import { FileText, Calendar, DollarSign, Tag } from "lucide-react"

interface Portfolio {
  _id: string
  name: string
  uploadedVia: string
  createdAt: string
  totalDebts: number
  totalPrincipalAmount: number
  debtType: string
}

interface PortfolioInfoProps {
  portfolio: Portfolio
  formatDebtType: (type: string) => string
}

const PortfolioInfo = ({ portfolio, formatDebtType }: PortfolioInfoProps) => {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center gap-2 mb-5">
        <FileText className="w-6 h-6 text-zinc-700" />
        <h2 className="text-2xl font-semibold text-zinc-800">Portfolio Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-zinc-100 p-2 rounded-lg">
              <Tag className="w-5 h-5 text-zinc-700" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Portfolio Name</p>
              <p className="text-base font-medium text-zinc-800">{portfolio.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-zinc-100 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-zinc-700" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p className="text-base font-medium text-zinc-800">
                {new Date(portfolio.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-zinc-100 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-zinc-700" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Uploaded Via</p>
              <p className="text-base font-medium text-zinc-800">{portfolio.uploadedVia}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-zinc-100 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Principal</p>
              <p className="text-base font-medium text-zinc-800">${portfolio.totalPrincipalAmount.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-zinc-100 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-zinc-700" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Debts</p>
              <p className="text-base font-medium text-zinc-800">{portfolio.totalDebts}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-zinc-100 p-2 rounded-lg">
              <Tag className="w-5 h-5 text-zinc-700" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Debt Type</p>
              <p className="text-base font-medium text-zinc-800">{formatDebtType(portfolio.debtType || "Other")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">Portfolio ID: {portfolio._id}</p>
      </div>
    </section>
  )
}

export default PortfolioInfo
