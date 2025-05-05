import { useEffect, useState } from "react";
import PendingPortfolios from './PendingPortfolios';
import AcceptedPortfolios from './AcceptedPortfolios';
import { ErrorNotification, SuccessNotification } from "@src/utils";
import { Axios } from "@src/api";
import { useSelector } from "react-redux";
import Fallback from "@src/Components/Fallback";

function Portfolio() {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const lender = useSelector((state: any) => state.user);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await Axios.get(`/portfolio/lender/${lender._id}`);
        setPortfolios(response.data?.portfolios || []);
      } catch (error: any) {
        console.error("Error fetching portfolios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [lender._id, version]); // Fetch once on mount and then refresh

  if (loading) return <Fallback />;

  const inAuctionPortfolios = portfolios.filter(p => p.status === "auction");
  const acceptedPortfolios = portfolios.filter(p => p.status === "accepted");

  return (
    <>
      <PendingPortfolios
        portfolios={inAuctionPortfolios}
        onPortfolioDeleted={() => setVersion(prev => prev + 1)}
      />
      <AcceptedPortfolios
        portfolios={acceptedPortfolios} />
    </>
  );
}

export default Portfolio;
