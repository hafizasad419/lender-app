import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
    collectorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Collector' },
    debtPortfolioId: { type: mongoose.Schema.Types.ObjectId, ref: 'DebtPortfolio' },  // Updated to bid on entire portfolio
    type: { type: String, enum: ['percentage', 'fullBid'], required: true },
    amount: Number,  // Percentage or flat amount
}, { timestamps: true });

bidSchema.index({ collectorId: 1, debtPortfolioId: 1 }, { unique: true }); // Index for quick access to bids by collector and portfolio

export const Bid = mongoose.model('Bid', bidSchema);




