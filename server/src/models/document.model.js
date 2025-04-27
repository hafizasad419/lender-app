import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    relatedTo: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedModel'
    },
    relatedModel: { type: String, enum: ['DebtEntry', 'DebtPortfolio'] },
    versions: [{
      fileUrl: String,
      uploadedAt: { type: Date, default: Date.now },
      uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Lender' }
    }]
  });

  export const Document = mongoose.model('Document', documentSchema);
  
