import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Axios } from "@src/api";
import { ErrorNotification } from "@src/utils";
import { portfoliosFetched } from "@src/redux/slices/portfolioSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@src/redux/store";
import Fallback from "@src/Components/Fallback";

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const [page, setPage] = useState(pageParam);
  const [isLoading, setIsLoading] = useState(false);
  const [limit] = useState(6); // Can be made dynamic later

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const portfolios = useSelector((state: RootState) => state.portfolioListings.listings) || [];
  const hasFetched = useSelector((state: RootState) => state.portfolioListings.hasFetched);
  const pagination = useSelector((state: RootState) => state.portfolioListings.pagination);
  const totalPages = pagination?.totalPages || 1;

  // Sync URL → State
  useEffect(() => {
    setPage(pageParam);
  }, [pageParam]);

  // Sync State → URL
  useEffect(() => {
    setSearchParams({ page: page.toString() });
  }, [page]);

  const fetchPortfolios = async () => {
    try {
      setIsLoading(true);
      const { data } = await Axios.get("portfolio/listings", {
        params: {
          page,
          limit,
          sortBy: "createdAt",
          sortOrder: "desc",
        },
      });

      dispatch(portfoliosFetched({
        listings: data.listings.data,
        pagination: data.listings.pagination,
      }));
    } catch (error:any) {
      if (error.response?.data?.error) {
        ErrorNotification(error.response.data.error);
      } else {
        ErrorNotification("Oops, unexpected error while fetching portfolios.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on page change
  useEffect(() => {
    fetchPortfolios();
  }, [page]);

  if (isLoading) return <Fallback />;

  if (hasFetched && portfolios.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center text-gray-500">No portfolios found.</div>
      </div>
    );
  }

  const handleNext = () => {
    if (page < totalPages) setPage(prev => prev + 1);
  };

  const handlePrevious = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((p) => (
          <section key={p.portfolioId} className="rounded-2xl shadow-md p-6">
            <div className="space-y-3">
              <div className="text-sm text-gray-500">
                {p.postedDaysAgo === 0 ? "Today" : p.postedDaysAgo === 1 ? "Yesterday" : p.postedDaysAgo + " days ago"}
                </div>
              <h2 className="text-xl font-semibold text-gray-800">{p.portfolioName}</h2>
              <div className="text-gray-700 font-medium">Face Value: ${p.portfolioFaceValue.toLocaleString()}</div>
              <div className="text-gray-600">Average Age: {p.averageDebtAgeInMonths.toFixed(0)} months</div>
              <button
                className="btn-primary mt-4 w-full"
                onClick={() => navigate(`/marketplace/listings/${p.portfolioId}`)}
              >
                View Details
              </button>
            </div>
          </section>
        ))}
      </div>

      <div className="flex justify-center items-center mt-8 gap-4">
        <button
          onClick={handlePrevious}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Marketplace;

