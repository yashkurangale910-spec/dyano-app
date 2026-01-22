import mongoose from 'mongoose';

const pdfDocumentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileSize: Number,
    extractedText: String,
    summary: String,
    metadata: {
        author: String,
        pageCount: Number,
        keywords: [String]
    },
    status: {
        type: String,
        enum: ['processing', 'ready', 'failed'],
        default: 'processing'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const PDFDocument = mongoose.model('PDFDocument', pdfDocumentSchema);
export default PDFDocument;
