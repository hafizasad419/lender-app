import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@src/redux/store";
import { useState } from "react";
import PortfolioInfo from "./PortfolioInfo";
import BidSection from "./BidSection";
import BidHistory from "./BidHistory";
import BackButton from "@src/Components/BackButton";
import { calculateCollectorPayout } from "@src/utils";

const PortfolioDetails = () => {
    const { portfolioId } = useParams();
    const collectorId = useSelector((state: RootState) => state.user?._id);
    const listings = useSelector((state: RootState) => state.portfolioListings.listings);
    const portfolio = listings.find((p) => p.portfolioId === portfolioId);
    // console.log("Portfolio Details", portfolio)

    const [bidType, setBidType] = useState<"percentage" | "fullBid">("percentage");
    const [bids, setBids] = useState<any[]>([]);

    const highestBid = bids.reduce((prev: any, current: any) => {
        const currentDollarValue = current.type === "percentage"
            ? calculateCollectorPayout(Number(portfolio?.portfolioFaceValue), current.amount)
            : current.amount;

        const prevDollarValue = prev.type === "percentage"
            ? calculateCollectorPayout(Number(portfolio?.portfolioFaceValue), prev.amount)
            : prev.amount;

        return currentDollarValue > prevDollarValue ? current : prev;
    }, { amount: 0, type: "purchase", collectorId: {} });

    if (!portfolio) return <div className="max-w-4xl mx-auto p-6 text-center text-zinc-700">Portfolio not found.</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 text-gray-700">
            <BackButton to="/marketplace" />

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 py-6">
                <PortfolioInfo
                    portfolio={portfolio} />

                <div className="bg-white p-6 rounded-xl shadow space-y-5">
                    <BidSection
                        bids={bids}
                        highestBid={highestBid}
                        portfolio={portfolio}
                        portfolioId={portfolioId}
                        collectorId={collectorId}
                        bidType={bidType}
                        setBidType={setBidType}
                        setBids={setBids}
                    />
                    <BidHistory
                        portfolioId={portfolioId}
                        bids={bids}
                        setBids={setBids}
                        highestBid={highestBid}
                        portfolioFaceValue={portfolio?.portfolioFaceValue}
                    />
                </div>
            </section>
        </div>
    );
};

export default PortfolioDetails;
