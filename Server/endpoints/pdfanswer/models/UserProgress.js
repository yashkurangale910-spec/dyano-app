import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    stats: {
        totalQuizzesTaken: { type: Number, default: 0 },
        averageScore: { type: Number, default: 0 },
        totalFlashcardsLearned: { type: Number, default: 0 },
        totalRoadmapsCompleted: { type: Number, default: 0 },
        studyTimeMinutes: { type: Number, default: 0 }
    },
    dailyStreak: {
        count: { type: Number, default: 0 },
        lastActivityDate: { type: Date }
    },
    achievements: [{
        name: String,
        unlockedAt: { type: Date, default: Date.now }
    }],
    lastAccessedFeatures: [{
        feature: String,
        accessedAt: { type: Date }
    }]
}, {
    timestamps: true
});

const UserProgress = mongoose.model('UserProgress', userProgressSchema);
export default UserProgress;
