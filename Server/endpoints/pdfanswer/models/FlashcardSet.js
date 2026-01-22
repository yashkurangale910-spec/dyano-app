import mongoose from 'mongoose';

const flashcardSetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    cards: [{
        front: {
            type: String,
            required: true
        },
        back: {
            type: String,
            required: true
        },
        difficulty: {
            type: Number, // 0 to 5 for spaced repetition
            default: 0
        },
        nextReview: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const FlashcardSet = mongoose.model('FlashcardSet', flashcardSetSchema);
export default FlashcardSet;
