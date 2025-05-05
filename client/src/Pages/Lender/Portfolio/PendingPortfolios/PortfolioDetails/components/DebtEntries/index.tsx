"use client"

import { useState } from "react"
import { UserRound, ChevronDown, ChevronUp, Calendar, DollarSign, Percent, Clock, Users } from "lucide-react"

interface Demographics {
  age: number
  gender: string
  location: string
}

interface DebtEntry {
  _id: string
  debtorName: string
  principalAmount: number
  interest: number
  debtAgeInMonths: number
  lastPaymentDate: string
  expiryDate: string
  collectionAttempts: number
  demographics: Demographics
}

interface DebtEntriesProps {
  debtEntries: DebtEntry[]
}

const DebtEntries = ({ debtEntries }: DebtEntriesProps) => {
  const [showDebts, setShowDebts] = useState(false)

  return (
    <section className="space-y-6">
      <div className="flex justify-center">
        <button
          onClick={() => setShowDebts(!showDebts)}
          className="flex items-center gap-2 btn-outline px-6 py-3 text-zinc-700 hover:bg-zinc-50"
        >
          {showDebts ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          {showDebts ? "Hide Debtors" : "View Debtors"}
        </button>
      </div>

      {showDebts && (
        <div className="animate-drop">
          <div className="flex items-center gap-2 mb-5">
            <Users className="w-6 h-6 text-zinc-700" />
            <h2 className="text-2xl font-semibold text-zinc-800">Debt Entries</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {debtEntries.map((entry) => (
              <div
                key={entry._id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 text-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-zinc-800 flex items-center gap-2">
                    <UserRound className="w-5 h-5 text-zinc-600" />
                    {entry.debtorName}
                  </h3>
                  <div className="bg-zinc-100 text-zinc-700 text-xs font-medium px-2 py-1 rounded-full">
                    {entry.debtAgeInMonths} months
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">Principal</p>
                      <p className="font-medium">${entry.principalAmount}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-amber-500" />
                    <div>
                      <p className="text-xs text-gray-500">Interest</p>
                      <p className="font-medium">{entry.interest}%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-xs text-gray-500">Last Paid</p>
                      <p className="font-medium">{new Date(entry.lastPaymentDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-500" />
                    <div>
                      <p className="text-xs text-gray-500">Expiry</p>
                      <p className="font-medium">{new Date(entry.expiryDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <p className="font-semibold text-zinc-700 mb-2">Demographics</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Age</p>
                      <p>{entry.demographics.age}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Gender</p>
                      <p>{entry.demographics.gender}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p>{entry.demographics.location}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-xs text-gray-500">
                  Collection attempts: <span className="font-medium text-zinc-700">{entry.collectionAttempts}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default DebtEntries
