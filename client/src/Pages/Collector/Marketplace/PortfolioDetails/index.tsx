import { NavLink, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@src/redux/store";
import { useEffect, useState } from "react";
import { Axios } from "@src/api";
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import TextField from '@src/Components/FormikFields/TextField';
import { SuccessNotification, ErrorNotification } from '@src/utils';
import {
    BadgeDollarSign,
    Banknote,
    CalendarDays,
    TimerReset,
    FileText,
    Users,
    Building2,
    ClipboardList,
    LineChart,
    Coins,
    ArrowLeft,
} from "lucide-react";
import { BiLeftArrow, BiLoaderAlt } from "react-icons/bi";
import BackButton from "@src/Components/BackButton";

const PortfolioDetails = () => {
    const { portfolioId } = useParams();
    const collectorId = useSelector((state: RootState) => state.user?._id);
    const listings = useSelector((state: RootState) => state.portfolioListings.listings);
    const portfolio = listings.find((p) => p.portfolioId === portfolioId);
    const [bidValue, setBidValue] = useState(0);
    const [bids, setBids] = useState<any[]>([]); // Replace with actual data source later

    // Add this near your state definitions:
    const [bidType, setBidType] = useState<"percentage" | "fullBid">("percentage");
    const [amountBidValue, setAmountBidValue] = useState(0);

    // Helper to calculate collector's share based on percentage
    const collectorShare = (portfolio?.portfolioFaceValue || 0) * (bidValue / 100);


    if (!portfolio) {
        return (
            <div className="max-w-4xl mx-auto p-6 text-center text-zinc-700">
                Portfolio not found.
            </div>
        );
    }

    const details = [
        { label: "Lender Name", value: portfolio.lenderName, icon: <Users className="w-5 h-5 mr-2 text-zinc-500" /> },
        { label: "Organization", value: portfolio.lenderOrganization, icon: <Building2 className="w-5 h-5 mr-2 text-zinc-500" /> },
        { label: "Portfolio Name", value: portfolio.portfolioName, icon: <ClipboardList className="w-5 h-5 mr-2 text-zinc-500" /> },
        { label: "Face Value", value: `$${portfolio.portfolioFaceValue}`, icon: <Banknote className="w-5 h-5 mr-2 text-zinc-500" /> },
        { label: "Posted", value: `${portfolio.postedDaysAgo === 0 ? "Today" : portfolio.postedDaysAgo === 1 ? "Yesterday" : portfolio.postedDaysAgo + " days ago"} `, icon: <CalendarDays className="w-5 h-5 mr-2 text-zinc-500" /> },
        { label: "Avg Debt Size", value: `$${portfolio.averageDebtSize.toFixed(0)}`, icon: <Coins className="w-5 h-5 mr-2 text-zinc-500" /> },
        { label: "Avg Debt Age", value: `${portfolio.averageDebtAgeInMonths.toFixed(0)} months`, icon: <TimerReset className="w-5 h-5 mr-2 text-zinc-500" /> },
        { label: "Total Debtors", value: portfolio.totalDebtors, icon: <Users className="w-5 h-5 mr-2 text-zinc-500" /> },
        { label: "Portfolio ID", value: portfolio.portfolioId, icon: <FileText className="w-5 h-5 mr-2 text-zinc-500" /> },
    ];

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const { data } = await Axios.get(`/portfolio/bid/${portfolioId}`);
                console.log(data)
                setBids(data.bids);
            } catch (error:any) {
                ErrorNotification("Failed to load bid history");
            }
        };

        if (portfolioId) {
            fetchBids();
        }
    }, [portfolioId]);

    const collectorAlreadyBid = bids.some((bid) => bid.collectorId?._id === collectorId);

    const highestBid = bids.reduce((prev, current) =>
        current.amount > prev.amount ? current : prev,
        { amount: 0, type: "", collectorId: "" }
    );;

    return (
        <div className="max-w-6xl mx-auto p-6 text-gray-700">

            <BackButton to="/marketplace" />



            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 py-6">
                {/* Left: Portfolio Info */}
                <div>
                    <h1 className="text-3xl font-bold text-zinc">{portfolio.lenderName}</h1>
                    <p className="text-zinc-500 text-sm mt-1 mb-6">{portfolio?.lenderOrganization}</p>

                    {/* Tabular Layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        {details.map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 border rounded-xl bg-white shadow-sm">
                                {item.icon && <div className="text-zinc-400">{item.icon}</div>}
                                <div className="flex flex-col">
                                    <span className="text-zinc-500 font-medium">{item.label}</span>
                                    <span className="text-zinc font-semibold overflow-ellipsis">{item.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Bidding Section */}
                <div className="bg-white p-6 rounded-xl shadow space-y-5">
                    <h2 className="text-lg font-semibold text-zinc flex items-center">
                        <BadgeDollarSign className="w-5 h-5 mr-2 text-green-600" /> Place a Bid
                    </h2>

                    {/* Bid Type Switch */}
                    <div className="flex gap-4">
                        <button
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${bidType === "percentage"
                                ? "bg-zinc text-white border-zinc"
                                : "bg-white text-zinc border-gray-300"
                                }`}
                            onClick={() => setBidType("percentage")}
                        >
                            Bid as % (Contingency)
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${bidType === "fullBid"
                                ? "bg-zinc text-white border-zinc"
                                : "bg-white text-zinc border-gray-300"
                                }`}
                            onClick={() => setBidType("fullBid")}
                        >
                            Buy Portfolio (Amount)
                        </button>
                    </div>

                    {/* Highest Bid Info */}
                    {bids.length > 0 && (
                        <p className="text-sm text-zinc-600">
                            Highest Bid:{" "}
                            <span className="font-semibold text-zinc">
                                {highestBid.type === "percentage"
                                    ? `${highestBid.amount}% (Contingency)`
                                    : `$${highestBid.amount.toLocaleString()} (Purchase)`}
                            </span>
                        </p>
                    )}

                    {/* Bid Form */}
                    <Formik
                        initialValues={{ bidPercentage: 0, bidAmount: "" }}
                        validationSchema={
                            bidType === "percentage"
                                ? yup.object({
                                    bidPercentage: yup
                                        .number()
                                        .min(20, "Minimum is 20%")
                                        .max(60, "Maximum is 60%")
                                        .required("Required"),
                                })
                                : yup.object({
                                    bidAmount: yup
                                        .number()
                                        .min(1, "Must be greater than 0")
                                        .max(
                                            portfolio?.portfolioFaceValue || 0,
                                            `Max is $${portfolio?.portfolioFaceValue}`
                                        )
                                        .required("Required"),
                                })
                        }
                        onSubmit={async (values, { setSubmitting, resetForm }) => {
                            try {
                                const bidAmount =
                                    bidType === "percentage"
                                        ? Number(values.bidPercentage)
                                        : Number(values.bidAmount);

                                await Axios.post("/portfolio/bid/create", {
                                    portfolioId,
                                    collectorId,
                                    bidType,
                                    bidAmount,
                                });

                                SuccessNotification("Bid placed successfully");
                                resetForm();
                                setBidValue(0);
                                setAmountBidValue(0);
                                const { data } = await Axios.get(`/portfolio/bid/${portfolioId}`);
                                setBids(data.bids);
                            } catch (error:any) {
                                ErrorNotification("Failed to place bid");
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ isSubmitting, values }) => (
                            <Form className="flex flex-col gap-3 text-sm">
                                {bidType === "percentage" ? (
                                    <>
                                        <TextField
                                            field="bidPercentage"
                                            type="number"
                                            label_text=""
                                            placeholder="Enter bid % (20 - 60%)"
                                        />


                                        {Number(values.bidPercentage) >= 20 && Number(values.bidPercentage) <= 60 ? (
                                            <p className="text-zinc-600">
                                                @{values.bidPercentage || 0}% you’ll earn{" "}
                                                <span className="font-semibold text-green-600">
                                                    $
                                                    {(
                                                        (portfolio?.portfolioFaceValue || 0) *
                                                        (Number(values.bidPercentage) / 100)
                                                    ).toFixed(2)}
                                                </span>{" "}
                                                if this debt is collected.
                                            </p>
                                        ) : null}

                                        <button
                                            type="submit"
                                            className="btn-primary !px-6 mt-2"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <BiLoaderAlt className="animate-spin text-xl mx-auto" />
                                            ) : (
                                                "Place Your Bid"
                                            )}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <TextField
                                            field="bidAmount"
                                            type="number"
                                            className="min-w-64"
                                            label_text=""
                                            placeholder={`Enter amount ($1 - $${portfolio?.portfolioFaceValue})`}
                                        />
                                        <p className="text-zinc-600">
                                            You’re offering{" "}
                                            <span className="font-semibold text-blue-600">
                                                ${Number(values.bidAmount).toFixed(2)}
                                            </span>{" "}
                                            to buy this portfolio.
                                        </p>
                                        <button
                                            type="submit"
                                            className="btn-primary !px-6 mt-2"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <BiLoaderAlt className="animate-spin text-xl mx-auto" />
                                            ) : (
                                                "Submit Purchase Bid"
                                            )}
                                        </button>
                                    </>
                                )}
                            </Form>
                        )}
                    </Formik>
                </div>
            </section>


            <div className="bg-white p-6 rounded-2xl shadow mt-8">
                <h2 className="text-xl font-semibold text-zinc mb-6 flex items-center">
                    <LineChart className="w-5 h-5 mr-2 text-blue-600" />
                    Bid History
                </h2>

                {bids.length === 0 ? (
                    <p className="text-zinc-500 text-sm">No bids placed yet.</p>
                ) : (
                    <ul className="space-y-5">
                        {bids.map((bid, idx) => {
                            const isFull = bid.type === "fullBid";
                            const amount = bid.amount?.toLocaleString(undefined, {
                                minimumFractionDigits: isFull ? 2 : 0,
                                maximumFractionDigits: isFull ? 2 : 0,
                            });

                            const collectorShare = !isFull
                                ? (
                                    (portfolio?.portfolioFaceValue || 0) *
                                    (bid.amount / 100)
                                ).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })
                                : null;

                            return (
                                <li
                                    key={idx}
                                    className="flex justify-between items-start border-b pb-5 last:border-b-0"
                                >
                                    {/* Left: Bidder Info */}
                                    <div className="space-y-1">
                                        <p className="text-zinc-800 font-medium flex items-center">
                                            <Users className="w-4 h-4 mr-2 text-zinc-400" />
                                            {bid.collectorId?.name}
                                        </p>
                                        <p className="text-zinc-500 text-sm flex items-center">
                                            <Building2 className="w-4 h-4 mr-2 text-zinc-400" />
                                            {bid.collectorId?.organization || "—"}
                                        </p>
                                        <p className="text-xs text-zinc-400 flex items-center">
                                            <CalendarDays className="w-4 h-4 mr-2" />
                                            {new Date(bid.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {/* Right: Bid Info */}
                                    <div className="text-right space-y-1">
                                        {isFull ? (
                                            <>
                                                <p className="text-lg font-semibold text-zinc-800">
                                                    ${amount}
                                                </p>
                                                <p className="text-sm text-green-600 font-medium">
                                                    Full Purchase
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-lg font-semibold text-zinc-800">
                                                    {bid.amount}% Contingency
                                                </p>
                                                <p className="text-sm text-blue-600 font-medium">
                                                    Est. Revenue: ${collectorShare}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>



        </div>
    );
};

export default PortfolioDetails;

