import { useEffect, useState } from "react";
import { BadgeDollarSign, DollarSign, Percent, User2 } from "lucide-react";
import { Axios } from "@src/api";
import { calculateCollectorPayout, ErrorNotification, obfuscateName } from "@src/utils";

const BidHistory = ({ portfolioId, bids, setBids, highestBid, portfolioFaceValue }: any) => {
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

    if (loading)
        return (
            <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md">
                <p className="text-sm text-zinc-500">Loading bid history...</p>
            </section>
        );

    if (!bids.length)
        return (
            <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md">
                <p className="text-sm text-zinc-400">No bids yet.</p>
            </section>
        );


    return (
        <section className="bg-white border border-gray-200 rounded-3xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-5">
                <BadgeDollarSign className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-semibold text-zinc-800">Bid History</h2>
            </div>

            <div className="mb-6">
                <p className="text-sm text-gray-500">Highest Bid</p>
                <p className="text-base font-medium text-zinc-800">
                    {highestBid.type === "percentage"
                        ? `${highestBid.amount}% (Contingency) = $${calculateCollectorPayout(Number(portfolioFaceValue), highestBid.amount)}`
                        : `$${highestBid.amount.toLocaleString()} (Purchase)`}
                </p>
            </div>

            <div className="space-y-5">
                {bids.map((bid: any, index: number) => (
                    <div
                        key={index}
                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-gray-100 rounded-xl p-4 shadow-xl transition-shadow duration-200"
                    >
                        {/* Amount */}
                        <div className="flex items-start gap-3">
                            <div className="bg-zinc-100 p-2 rounded-lg">
                                <DollarSign className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Amount</p>
                                <p className="text-sm font-medium text-zinc-800">
                                    {bid.type === "percentage"
                                        ? `${bid.amount}%`
                                        : `$${bid.amount.toLocaleString()}`}
                                </p>
                            </div>
                        </div>

                        {/* Type */}
                        <div className="flex items-start gap-3">
                            <div className="bg-zinc-100 p-2 rounded-lg">
                                <Percent className="w-5 h-5 text-zinc-700" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Bid Type</p>
                                <p className="text-sm font-medium text-zinc-800">
                                    {bid.type === "percentage" ? "Contingency" : "Purchase"}
                                </p>
                            </div>
                        </div>

                        {/* Collector */}
                        <div className="flex items-start gap-3">
                            <div className="bg-zinc-100 p-2 rounded-lg">
                                <User2 className="w-5 h-5 text-zinc-700" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Collector</p>
                                <p className="text-sm font-medium text-zinc-800">
                                    {obfuscateName(bid?.collectorId?.name) || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default BidHistory;
