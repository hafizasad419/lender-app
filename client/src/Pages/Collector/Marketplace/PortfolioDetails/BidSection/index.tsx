import { BadgeDollarSign } from "lucide-react";
import { Formik, Form } from "formik";
import * as yup from "yup";
import TextField from "@src/Components/FormikFields/TextField";
import { Axios } from "@src/api";
import { SuccessNotification, ErrorNotification, calculateCollectorPayout } from "@src/utils";
import { BiLoaderAlt } from "react-icons/bi";

const BidSection = ({
    bids,
    highestBid,
    portfolio,
    portfolioId,
    collectorId,
    bidType,
    setBidType,
    setBids
}: any) => {
    return (
        <>
            <h2 className="text-lg font-semibold text-zinc flex items-center">
                <BadgeDollarSign className="w-5 h-5 mr-2 text-green-600" /> Place a Bid
            </h2>

            {/* Bid Type Switch */}
            <div className="flex gap-4">
                {["percentage", "fullBid"].map((type) => (
                    <button
                        key={type}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${bidType === type
                            ? "bg-zinc text-white border-zinc"
                            : "bg-white text-zinc border-gray-300"
                            }`}
                        onClick={() => setBidType(type)}
                    >
                        {type === "percentage" ? "Bid as % (Contingency)" : "Buy Portfolio (Amount)"}
                    </button>
                ))}
            </div>

            {/* Highest Bid Info */}
            {bids.length > 0 && (
                <p className="text-sm text-zinc-600">
                    Highest Bid: <span className="font-semibold text-zinc">
                        {highestBid.type === "percentage"
                            ? `${highestBid.amount}% (Contingency) = $${calculateCollectorPayout(portfolio?.portfolioFaceValue, highestBid.amount)}`
                            : `$${highestBid.amount.toLocaleString()} (Purchase)`
                            }
                    </span>
                </p>
            )}

            {/* Bid Form */}
            <Formik
                initialValues={{ bidPercentage: 0, bidAmount: "" }}
                validationSchema={
                    bidType === "percentage"
                        ? yup.object({
                            bidPercentage: yup.number().min(20).max(60).required("Required"),
                        })
                        : yup.object({
                            bidAmount: yup.number().min(1).max(portfolio?.portfolioFaceValue || 0).required("Required"),
                        })
                }
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                    try {
                        const bidAmount = bidType === "percentage"
                            ? Number(values.bidPercentage)
                            : Number(values.bidAmount);

                        await Axios.post("/portfolio/bid/create", { portfolioId, collectorId, bidType, bidAmount });

                        SuccessNotification("Bid placed successfully");
                        resetForm();

                        const { data } = await Axios.get(`/portfolio/bid/${portfolioId}`);
                        setBids(data.bids);
                    } catch {
                        ErrorNotification("Failed to place bid");
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ isSubmitting, values }) => {
                    const collectorEstimatedEarning =
                        bidType === "percentage" &&
                            values.bidPercentage >= 20 &&
                            values.bidPercentage <= 60
                            ? ((values.bidPercentage / 100) * portfolio?.portfolioFaceValue).toFixed(2)
                            : null;

                    return (
                        <Form className="flex flex-col gap-3 text-sm">
                            {bidType === "percentage" ? (
                                <>
                                    <TextField
                                        field="bidPercentage"
                                        type="number"
                                        label_text=""
                                        placeholder="Enter bid % (20 - 60%)"
                                    />
                                    {collectorEstimatedEarning && (
                                        <p className="text-green-700 text-sm">
                                            @{values.bidPercentage}% you'll earn {" "}
                                            <span className="font-semibold">
                                                ${collectorEstimatedEarning}
                                            </span>{" "}
                                            if debt is collected successfully.
                                        </p>
                                    )}
                                </>
                            ) : (
                                <>
                                    <TextField
                                        field="bidAmount"
                                        type="number"
                                        label_text=""
                                        placeholder="Enter purchase amount"
                                    />
                                    {values.bidAmount !== "" &&
                                        Number(values.bidAmount) > 0 && (
                                            <p className="text-green-700 text-sm">
                                                You are offering{" "}
                                                <span className="font-semibold">
                                                    ${Number(values.bidAmount).toLocaleString()}
                                                </span>{" "}
                                                to purchase the full portfolio.
                                            </p>
                                        )}
                                </>
                            )}

                            <button
                                type="submit"
                                className="btn-primary !px-6 mt-2"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <BiLoaderAlt className="animate-spin text-xl mx-auto" />
                                ) : (
                                    "Place Bid"
                                )}
                            </button>
                        </Form>
                    );
                }}
            </Formik>
        </>
    );
};

export default BidSection;
