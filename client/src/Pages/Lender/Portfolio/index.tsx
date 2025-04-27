import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Axios } from "@src/api";
import { ErrorNotification, SuccessNotification } from "@src/utils";
import Fallback from "@src/Components/Fallback";
import { Link } from "react-router-dom";

interface PortfolioItem {
  _id: string;
  name: string;
  totalPrincipalAmount: number;
  totalDebts: string;
  bidCount: string;
}

const Portfolio = () => {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const lender = useSelector((state: any) => state.user);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!lender || !lender._id) return;

      try {
        const response = await Axios.get(`/portfolio/lender/${lender._id}`);
        setPortfolios(response.data?.portfolios || []);
      } catch (error: any) {
        ErrorNotification(error?.response?.data?.error || "Failed to fetch portfolio.");
        console.error("Portfolio fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [lender]);

  const handleDelete = async (portfolioId: string) => {
    const confirm = window.confirm("Are you sure you want to delete this portfolio? This cannot be undone.");
    if (!confirm) return;

    try {
      setDeletingId(portfolioId);
      await Axios.delete(`/portfolio/listings/${portfolioId}`);
      setPortfolios(prev => prev.filter(p => p._id !== portfolioId));
      SuccessNotification("Portfolio deleted successfully.");
    } catch (error: any) {
      ErrorNotification(error?.response?.data?.error || "Failed to delete portfolio.");
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Fallback />;

  if (!portfolios.length) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-zinc mb-2">No Portfolios Found</h2>
        <p className="text-gray-600">Your portfolio is currently empty. Upload a CSV to get started.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-zinc mb-6">Your Portfolios</h1>
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

            <div className="flex gap-2">
              <Link
                to={`/portfolio/${portfolio._id}`}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
              >
                View Details
              </Link>

              <button
                onClick={() => handleDelete(portfolio._id)}
                disabled={deletingId === portfolio._id}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition disabled:opacity-50"
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

export default Portfolio;
