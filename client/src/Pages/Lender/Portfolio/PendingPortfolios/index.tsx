import { Axios } from "@src/api";
import { ErrorNotification, formatDebtType, SuccessNotification } from "@src/utils";
import { useState } from "react";
import { Link } from "react-router-dom";

interface PortfolioItem {
  _id: string;
  name: string;
  totalPrincipalAmount: number;
  totalDebts: string;
  debtType: string;
  status: string;
}

interface PendingPortfoliosProps {
  portfolios: PortfolioItem[];
  onPortfolioDeleted?: () => void; 
}

const PendingPortfolios = ({ portfolios, onPortfolioDeleted  }: PendingPortfoliosProps) => {

  const [deletingId, setDeletingId] = useState<string | null>(null);


  const handleDelete = async (portfolioId: string) => {
    const confirm = window.confirm("Are you sure you want to delete this portfolio? This cannot be undone.");
    if (!confirm) return;

    try {
      setDeletingId(portfolioId);
      await Axios.delete(`/portfolio/listings/${portfolioId}`);
      SuccessNotification("Portfolio deleted successfully.");
      onPortfolioDeleted?.()
    } catch (error: any) {
      ErrorNotification(error?.response?.data?.error || "Failed to delete portfolio.");
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (!portfolios.length) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-zinc mb-2">No Pending Portfolios</h2>
        <p className="text-gray-600">There are no portfolios in auction right now.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-zinc mb-6">Your Portfolios in Auction</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((portfolio) => (
          <div
            key={portfolio._id}
            className="border border-gray-200 rounded-2xl shadow-sm p-5 bg-white hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-zinc mb-2">
              {portfolio?.name || "Unnamed Portfolio"}
            </h3>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Principal Amount:</strong> ${portfolio?.totalPrincipalAmount?.toLocaleString("en-US") || "0"}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Total Debts:</strong> {portfolio?.totalDebts}
            </p>

            <p className="text-sm text-gray-600 mb-1">
              <strong>Debt Type: </strong>
              <span>{formatDebtType(portfolio?.debtType) || "Other"}</span>
            </p>

            <div className="flex gap-2 mt-2">
              <Link to={`/portfolio/${portfolio._id}`} className="!px-4 !py-2 !text-sm btn-primary-zinc">
                View Details
              </Link>

              <button
                onClick={() => handleDelete(portfolio._id)}
                disabled={deletingId === portfolio._id}
                className=" !bg-red-600 !text-white rounded-lg hover:!bg-red-700 !px-4 !py-2 !text-sm btn-primary-zinc"
              >
                {deletingId === portfolio._id ? "Deleting..." : "Delete"}
              </button>


            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingPortfolios;
