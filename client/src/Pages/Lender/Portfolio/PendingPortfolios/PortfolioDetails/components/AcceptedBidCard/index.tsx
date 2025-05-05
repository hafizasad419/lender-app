import React from "react"
import {
  Check,
  DollarSign,
  Percent,
  User,
  Mail,
  Calendar,
  Building2
} from "lucide-react"
import { calculateCollectorPayout } from "@src/utils"

interface AcceptedBidCardProps {
  acceptedBid: any
  totalPrincipalAmount: number
}

const AcceptedBidCard: React.FC<AcceptedBidCardProps> = ({
  acceptedBid,
  totalPrincipalAmount
}) => {
  if (!acceptedBid) return null

  const collectorShare =
    acceptedBid.type === "percentage"
      ? calculateCollectorPayout(totalPrincipalAmount, acceptedBid.amount)
      : acceptedBid.amount

  const yourShare = totalPrincipalAmount - collectorShare

  return (
    <section className="bg-white border border-green-300 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 max-w-3xl mt-10">
      <div className="flex items-center gap-2 mb-5">
        <Check className="w-6 h-6 text-green-600" />
        <h2 className="text-2xl font-semibold text-zinc-800">
          Deal Sealed, Terms Agreed.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Percent className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Bid Type</p>
              <p className="text-base font-medium text-zinc-800">
                {acceptedBid.type === "fullBid" ? "Full Purchase" : "Percentage Model"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Offered Amount</p>
              <p className="text-base font-medium text-zinc-800">
                {acceptedBid.type === "fullBid"
                  ? `$${acceptedBid.amount}`
                  : `${acceptedBid.amount}%`}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Collector's Share</p>
              <p className="text-base font-medium text-zinc-800">${collectorShare}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Your Share</p>
              <p className="text-base font-medium text-zinc-800">${yourShare}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <User className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Collector</p>
              <p className="text-base font-medium text-zinc-800">
                {acceptedBid?.collectorId?.name}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Mail className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-base font-medium text-zinc-800">
                {acceptedBid?.collectorId?.email}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Building2 className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Organization</p>
              <p className="text-base font-medium text-zinc-800">
                {acceptedBid?.collectorId?.organization}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3">
        <div className="bg-green-100 p-2 rounded-lg">
          <Calendar className="w-5 h-5 text-green-700" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Date of Acceptance</p>
          <p className="text-base font-medium text-zinc-800">
            {new Date(acceptedBid?.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>
        </div>
      </div>

      <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm font-medium">
        This portfolio is now under contract. The collector will reach out soon to
        proceed further.
      </div>
    </section>
  )
}

export default AcceptedBidCard
