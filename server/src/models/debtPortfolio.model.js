import mongoose from "mongoose";

const debtPortfolioSchema = new mongoose.Schema({
    lenderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lender'
    },

    name: {
        type: String,
        required: true
    },
    debtType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['auction', 'accepted'],
        default: 'auction'
    },

    uploadedVia: {
        type: String,
        enum: ['csv', 'manual'],
        default: 'csv'
    },

    totalDebts: {
        type: Number
    },

    totalPrincipalAmount: {
        type: Number
    },

    bids: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid'
    },
},
    {
        timestamps: true,
    }
);

// Indexing on lenderId for fast querying by lender
debtPortfolioSchema.index({ lenderId: 1 });

export const DebtPortfolio = mongoose.model('DebtPortfolio', debtPortfolioSchema);
