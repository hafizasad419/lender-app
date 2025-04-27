import { Axios } from "@src/api";
import { RootState } from "@src/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LineChart } from "lucide-react";
import { ErrorNotification, SuccessNotification } from "@src/utils";

function MyBids() {
    const [bids, setBids] = useState([]);
    const collectorId = useSelector((state: RootState) => state.user._id);

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const { data } = await Axios.get(`/bids/collector/${collectorId}`);
                setBids(data.bids);
                console.log(data);
                SuccessNotification(data.message)
            } catch (error:any) {
                const message = error.response?.data?.error || error?.message || 'Failed to fetch collector profile.';
                ErrorNotification(message);
            }
        };
        if (collectorId) {
            fetchBids();
        }
    }, [collectorId]);

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight mb-4">My Bids</h1>

            <div className="bg-white p-6 rounded-2xl shadow">
                <h2 className="text-xl font-semibold text-zinc-800 mb-4 flex items-center">
                    <LineChart className="w-5 h-5 mr-2 text-blue-600" /> Your Bid History
                </h2>

                {bids.length === 0 ? (
                    <p className="text-zinc-500 text-sm">You haven't placed any bids yet.</p>
                ) : (
                    <div className="space-y-4">
                        {bids.map((bid: any, idx: number) => (
                            <div
                                key={idx}
                                className="flex justify-between items-center border-b pb-4 last:border-b-0"
                            >
                                <div>
                                    <p className="">
                                        Portfolio: {bid?.debtPortfolioId.name}
                                    </p>

                                    <p className="text-sm">
                                        Placed on: {new Date(bid.createdAt).toLocaleDateString()}
                                    </p>

                                    <p className="text-sm">
                                        Principal Amount: <span className="text-zinc font-semibold">
                                            ${bid?.debtPortfolioId?.totalPrincipalAmount}
                                        </span>
                                    </p>
                                </div>
                                <div className="text-right text-zinc text-sm font-bold">
                                    {bid?.type === "fullBid" ? (
                                        <div>
                                            ${bid?.amount}
                                            <p>(Full Debt Purchase Bid)</p>
                                        </div>
                                    ) : (
                                        <p className="text-base font-bold text-zinc-800">You will get {bid?.amount}%</p>
                                    )

                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyBids;

