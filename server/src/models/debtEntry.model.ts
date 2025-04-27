import mongoose from "mongoose";

const debtEntrySchema = new mongoose.Schema({
  lenderId: { type: mongoose.Schema.Types.ObjectId, ref: "Lender" },
  portfolioId: { type: mongoose.Schema.Types.ObjectId, ref: 'DebtPortfolio' },
  debtorName: String,
  demographics: {
    age: Number,
    gender: String,
    location: String
  },
  principalAmount: Number,
  interest: Number,
  debtAgeInMonths: Number,
  lastPaymentDate: Date,
  collectionAttempts: Number,
  expiryDate: {
    type: Date,
    default: function () {
      const sixMonthsLater = new Date();
      sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
      return sixMonthsLater;
    }
  }
});

// Indexing on portfolioId for efficient retrieval of all entries by portfolio
debtEntrySchema.index({ portfolioId: 1 });

export const DebtEntry = mongoose.model('DebtEntry', debtEntrySchema);
