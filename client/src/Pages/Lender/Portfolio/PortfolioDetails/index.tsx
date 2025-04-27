import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Axios } from "@src/api";
import { ErrorNotification } from "@src/utils";
import Fallback from "@src/Components/Fallback";
import {
  BadgeDollarSign,
  FileText,
  UserRound,
  CalendarClock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import BackButton from "@src/Components/BackButton";

const PortfolioDetails = () => {
  const { portfolioId } = useParams();
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDebts, setShowDebts] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!portfolioId) return;
      try {
        const response = await Axios.get(`/portfolio/listings/${portfolioId}`);
        setPortfolioData(response.data?.data);
        console.log("Fetched:", response.data?.data);
      } catch (error) {
        ErrorNotification(error?.response?.data?.error || "Failed to fetch portfolio.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [portfolioId]);

  if (loading) return <Fallback />;

  if (!portfolioData || !portfolioData.debtEntries?.length) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-zinc-700 mb-2">No Debt Entries Found</h2>
        <p className="text-gray-500">This portfolio currently has no debt entries.</p>
      </div>
    );
  }

  const { portfolio, debtEntries, bids } = portfolioData;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">

      <BackButton to="/portfolio" />


      {/* Portfolio & Bids Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Portfolio Info */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-zinc-700" />
            <h2 className="text-xl font-semibold text-zinc-800">Portfolio Details</h2>
          </div>
          <div className="text-gray-700 text-sm space-y-1">
            <p><strong>Name:</strong> {portfolio.name}</p>
            <p><strong>ID:</strong> {portfolio._id}</p>
            <p><strong>Uploaded Via:</strong> {portfolio.uploadedVia}</p>
            <p><strong>Created At:</strong> {new Date(portfolio.createdAt).toLocaleDateString()}</p>
            <p><strong>Total Debts:</strong> {portfolio.totalDebts}</p>
            <p><strong>Total Principal:</strong> ${portfolio.totalPrincipalAmount}</p>
            <p><strong>Lender:</strong> {portfolio.lenderId?.name} ({portfolio.lenderId?.email})</p>
          </div>
        </div>

        {/* Bids Info */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <BadgeDollarSign className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-zinc-800">All Bids</h2>
          </div>
          <div className="space-y-4 max-h-[300px] overflow-auto pr-2">
            {bids.length > 0 ? (
              bids.map((bid: any) => (
                <div
                  key={bid._id}
                  className="border border-green-100 rounded-xl bg-green-50 p-4 text-gray-700 text-sm space-y-1"
                >
                  <p><strong>Amount:</strong> {bid.type === "fullBid" ? "$" + bid.amount : bid.amount + "%"}</p>
                  <p><strong>Type:</strong> {bid.type === "fullBid" ? "Full Bid" : "Percentage"}</p>
                  <p><strong>Collector:</strong> {bid.collectorId?.name} ({bid.collectorId?.email})</p>
                  <p><strong>Date:</strong> {new Date(bid.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <div className="text-sm text-zinc-500 italic text-center pt-4">
                😴 No bids placed yet. Waiting for someone to make a move!
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Toggle Debt Entries */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowDebts(!showDebts)}
          className="flex items-center gap-2 btn-outline"
        >
          {showDebts ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          {showDebts ? "Hide Debters" : "View Debters"}
        </button>
      </div>

      {/* Debt Entries Section */}
      {showDebts && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {debtEntries.map((entry: any) => (
            <div key={entry._id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition text-sm space-y-2">
              <h3 className="text-lg font-semibold text-zinc-800 flex items-center gap-2">
                <UserRound className="w-4 h-4" /> {entry.debtorName}
              </h3>
              <div className="space-y-1 text-gray-700">
                <p><strong>Principal:</strong> ${entry.principalAmount}</p>
                <p><strong>Interest:</strong> {entry.interest}%</p>
                <p><strong>Age:</strong> {entry.debtAgeInMonths} months</p>
                <p><strong>Last Paid:</strong> {new Date(entry.lastPaymentDate).toLocaleDateString()}</p>
                <p><strong>Expiry:</strong> {new Date(entry.expiryDate).toLocaleDateString()}</p>
                <p><strong>Attempts:</strong> {entry.collectionAttempts}</p>
              </div>
              <div className="pt-2 border-t text-gray-600">
                <p className="font-semibold text-zinc-700">Demographics</p>
                <p><strong>Age:</strong> {entry.demographics.age}</p>
                <p><strong>Gender:</strong> {entry.demographics.gender}</p>
                <p><strong>Location:</strong> {entry.demographics.location}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioDetails;
