import { useEffect, useState } from "react";
import { BadgeDollarSign } from "lucide-react";
import { Axios } from "@src/api";
import { ErrorNotification } from "@src/utils";


const BidHistory = ({ portfolioId, bids, setBids }: any) => {
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const { data } = await Axios.get(`/portfolio/bid/${portfolioId}`);
                setBids(data.bids || []);
            } catch {
                ErrorNotification("Failed to load bid history");
            } finally {
                setLoading(false);
            }
        };

        if (portfolioId) {
            fetchBids();
        }
    }, [portfolioId]);

    if (loading) return <div className="text-sm text-zinc-500">Loading bid history...</div>;
    if (!bids.length) return <div className="text-sm text-zinc-400">No bids yet.</div>;

    const highestBid = bids.reduce(
        (prev: any, current: any) => (current.amount > prev.amount ? current : prev),
        { amount: 0, type: "percentage", collectorId: {} }
    );

    return (
        <div className="bg-white p-6 rounded-xl shadow space-y-5">
            <h2 className="text-lg font-semibold text-zinc flex items-center">
                <BadgeDollarSign className="w-5 h-5 mr-2 text-green-600" />
                Bid History
            </h2>

            <p className="text-sm text-zinc-600">
                Highest Bid:{" "}
                <span className="font-semibold text-zinc">
                    {highestBid.type === "percentage"
                        ? `${highestBid.amount}% (Contingency)`
                        : `$${highestBid.amount.toLocaleString()} (Purchase)`}
                </span>
            </p>

            <div className="flex flex-col gap-3">
                {bids.map((bid: any, index: number) => (
                    <div
                        key={index}
                        className="flex justify-between items-center border p-3 rounded-lg text-sm"
                    >
                        <span className="text-zinc-600">
                            {bid.type === "percentage"
                                ? `${bid.amount}%`
                                : `$${bid.amount.toLocaleString()}`}
                        </span>
                        <span className="text-zinc-400">
                            {bid.type === "percentage" ? "Contingency" : "Purchase"}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BidHistory;
