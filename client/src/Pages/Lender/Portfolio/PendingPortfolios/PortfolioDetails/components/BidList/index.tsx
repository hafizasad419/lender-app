import type React from "react";
import { useState } from "react";
import { BadgeDollarSign, Check, X } from "lucide-react";
import { calculateCollectorPayout, ErrorNotification, obfuscateName, SuccessNotification } from "@src/utils";
import { Axios } from "@src/api";
import { useNavigate } from "react-router-dom";
import AcceptedBidCard from "../AcceptedBidCard";

interface Bid {
    _id: string;
    amount: number;
    type: string;
    portfolioId: any;
    collectorId: {
        name: string;
        email: string;
    };
    createdAt: string;
    status: string;
}

interface BidListProps {
    bids: Bid[];
    totalPrincipalAmount: number;
}

const BidList = ({ bids, totalPrincipalAmount }: BidListProps) => {
    const navigate = useNavigate();
    const [loadingBid, setLoadingBid] = useState<{ id: string; type: "accept" | "reject" } | null>(null);



    const hasAcceptedBid = bids.some(bid => bid.status === "accepted");
    const acceptedBid = bids.find(bid => bid.status === "accepted");
    if (hasAcceptedBid)
        return (
            <AcceptedBidCard
                acceptedBid={...acceptedBid}
                totalPrincipalAmount={totalPrincipalAmount} />
)


const updateBidStatus = async (bidId: string, status: "accepted" | "rejected") => {
    try {
        setLoadingBid({ id: bidId, type: status === "accepted" ? "accept" : "reject" });
        const response = await Axios.patch(`/bids/update-status/${bidId}`, { status });

        if (response.status === 200) {
            SuccessNotification("Bid Status updated successfully!");
            // Filter out the accepted/rejected bid from the display after status update
            navigate("/portfolio");
            return response.data;
        }
    } catch (error: any) {
        if (error.response?.data?.error) {
            ErrorNotification(error.response.data.error);
        } else {
            ErrorNotification("Something went wrong. Please try again.");
        }
    } finally {
        setLoadingBid(null);
    }
};

// Filter out accepted bids so that they are not displayed
const filteredBids = bids.filter(bid => bid.status !== "accepted");

return (
    <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center gap-2 mb-5">
            <BadgeDollarSign className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-semibold text-zinc-800">All Bids</h2>
        </div>

        <div
            className="grid grid-cols-1 md:grid-cols-2 max-h-[400px] overflow-y-auto custom-scrollbar gap-4"
            style={{
                "--sb-track-color": "#ffffff",
                "--sb-thumb-color": "#f55800",
                "--sb-size": "8px",
                scrollbarWidth: "thin",
                scrollbarColor: "var(--sb-thumb-color) var(--sb-track-color)",
            } as React.CSSProperties}
        >
            {filteredBids.length > 0 ? (
                filteredBids.map((bid) => {
                    const collectorRevenue = calculateCollectorPayout(totalPrincipalAmount, bid.amount);
                    return (
                        <div
                            key={bid._id}
                            className={`border rounded-xl p-5 text-gray-700 text-sm space-y-3 transition-all duration-300 hover:shadow-md`}
                        >
                            <div className="flex flex-col justify-between items-start">
                                <div className="space-y-2">
                                    <p className="text-lg font-semibold text-zinc-800">
                                        {bid.type === "fullBid" ? "$" + bid.amount : bid.amount + "%"}
                                        <span className="ml-2 text-xs font-normal text-gray-500 uppercase tracking-wider">
                                            {bid.type === "fullBid" ? "Full Bid" : "Percentage"}
                                        </span>
                                    </p>

                                    {bid.type === "percentage" && totalPrincipalAmount ? (
                                        <>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Collector's Share:</span> ${collectorRevenue}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Your Share:</span> ${Number(totalPrincipalAmount - collectorRevenue)}
                                            </p>
                                        </>
                                    ) : bid.type === "fullBid" && totalPrincipalAmount ? (
                                        <>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Collector's Share:</span> ${bid?.amount}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Your Share:</span> ${Number(totalPrincipalAmount - bid?.amount)}
                                            </p>
                                        </>
                                    ) : null}

                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Collector:</span> {obfuscateName(bid.collectorId?.name)}
                                    </p>

                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Status:</span> <span className="capitalize">{bid?.status}</span>
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        <span className="font-medium">Date:</span> {new Date(bid.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                                    </p>
                                </div>

                                <div className="flex gap-x-4 pt-4">
                                    <button
                                        onClick={() => updateBidStatus(bid._id, "accepted")}
                                        disabled={!!loadingBid}
                                        className="flex items-center gap-1 text-sm btn-primary"
                                    >
                                        <Check className="w-4 h-4" />
                                        {loadingBid?.id === bid._id && loadingBid?.type === "accept" ? "Accepting..." : "Accept"}
                                    </button>

                                    <button
                                        onClick={() => updateBidStatus(bid._id, "rejected")}
                                        disabled={!!loadingBid}
                                        className="flex items-center gap-1 text-sm btn-outline"
                                    >
                                        <X className="w-4 h-4" />
                                        {loadingBid?.id === bid._id && loadingBid?.type === "reject" ? "Rejecting..." : "Reject"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="text-sm text-zinc-500 italic text-center py-10 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-lg mb-2">😴</p>
                    <p>No bids placed yet. Waiting for someone to make a move!</p>
                </div>
            )}
        </div>
    </section>
);
};

export default BidList;
