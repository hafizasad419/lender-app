import { formatDebtType } from "@src/utils";
import { Link } from "react-router-dom";

interface PortfolioItem {
    _id: string;
    name: string;
    totalPrincipalAmount: number;
    totalDebts: string;
    bidCount: string;
    debtType: string;
}

interface AcceptedPortfoliosProps {
    portfolios: PortfolioItem[];
}

const AcceptedPortfolios = ({ portfolios }: AcceptedPortfoliosProps) => {
    if (!portfolios.length) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold text-zinc mb-2">No Accepted Portfolios</h2>
                <p className="text-gray-600">You have no portfolios accepted at the moment.</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-zinc mb-6">Your Accepted Portfolios</h1>
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
                            <span>{formatDebtType(portfolio?.debtType )|| "Other"}</span>
                        </p>

                        <div className="flex gap-2 mt-2">
                            <Link to={`/portfolio/${portfolio._id}`} className="!px-4 !py-2 !text-sm btn-primary-zinc">
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AcceptedPortfolios;
