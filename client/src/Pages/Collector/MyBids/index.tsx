import { Axios } from "@src/api";
import { RootState } from "@src/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Calendar,
  DollarSign,
  FileText,
  LineChart,
  Tag,
  Percent,
  Ban,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { ErrorNotification, SuccessNotification } from "@src/utils";

function MyBids() {
  const [bids, setBids] = useState([]);
  const collectorId = useSelector((state: RootState) => state.user._id);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const { data } = await Axios.get(`/bids/collector/${collectorId}`);
        setBids(data.bids);
        SuccessNotification(data.message);
      } catch (error: any) {
        const message =
          error.response?.data?.error ||
          error?.message ||
          "Failed to fetch collector profile.";
        ErrorNotification(message);
      }
    };
    if (collectorId) fetchBids();
  }, [collectorId]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return { icon: <Clock className="w-4 h-4 text-yellow-600" />, class: "bg-yellow-100 text-yellow-800" };
      case "accepted":
        return { icon: <CheckCircle className="w-4 h-4 text-green-600" />, class: "bg-green-100 text-green-800" };
      case "rejected":
        return { icon: <XCircle className="w-4 h-4 text-red-600" />, class: "bg-red-100 text-red-800" };
      default:
        return { icon: <Ban className="w-4 h-4 text-gray-500" />, class: "bg-gray-100 text-gray-800" };
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
        <LineChart className="w-6 h-6 text-blue-600" />
        My Bids
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow-md border border-zinc-100">
        <h2 className="text-xl font-semibold text-zinc-800 mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-zinc-700" />
          Your Bid History
        </h2>

        {bids.length === 0 ? (
          <p className="text-zinc-500 text-sm">You haven't placed any bids yet.</p>
        ) : (
          <div className="space-y-5">
            {bids.map((bid: any, idx: number) => {
              const isFullBid = bid?.type === "fullBid";
              const statusInfo = getStatusInfo(bid.status);
              return (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-zinc-50 p-5 rounded-2xl border border-zinc-200 shadow-sm hover:shadow transition-shadow duration-200"
                >
                  {/* Left Column */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Tag className="w-5 h-5 text-zinc-700" />
                      <div>
                        <p className="text-sm text-gray-500">Portfolio Name</p>
                        <p className="text-base font-semibold text-blue-600">
                          {bid?.debtPortfolioId?.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-zinc-700" />
                      <div>
                        <p className="text-sm text-gray-500">Placed On</p>
                        <p className="text-base text-zinc-800 font-medium">
                          {new Date(bid.createdAt).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-500">Principal Amount</p>
                        <p className="text-base text-zinc-800 font-semibold">
                          ${bid?.debtPortfolioId?.totalPrincipalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div
                      className={
                        "inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full w-fit"
                      }
                    >
                      {statusInfo.icon}
                      {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="text-right space-y-1">
                    <p className="text-sm text-gray-500">
                      {isFullBid ? "Full Debt Purchase" : "Contingency Fee Bid"}
                    </p>
                    <div className="flex justify-end items-center gap-2 text-lg font-bold text-zinc-900">
                      {isFullBid ? (
                        <>
                          <DollarSign className="w-5 h-5 text-green-600" />
                          ${bid?.amount.toLocaleString()}
                        </>
                      ) : (
                        <>
                          <Percent className="w-5 h-5 text-blue-600" />
                          {bid?.amount}%
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBids;
