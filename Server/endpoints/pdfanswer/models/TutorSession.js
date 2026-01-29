import mongoose from 'mongoose';

const tutorSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['chat', 'essay_grading', 'problem_solving'],
        default: 'chat'
    },
    personality: {
        type: String,
        enum: ['friendly', 'strict', 'socratic', 'professional'],
        default: 'friendly'
    },
    depth: {
        type: String,
        enum: ['brief', 'standard', 'detailed', 'comprehensive'],
        default: 'standard'
    },
    messages: [{
        role: {
            type: String,
            enum: ['user', 'assistant', 'system'],
            required: true
        },
        content: {
            type: String,
            required: true
        },
        hasImage: {
            type: Boolean,
            default: false
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    tags: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes for better query performance
tutorSessionSchema.index({ user: 1, type: 1 });
tutorSessionSchema.index({ user: 1, updatedAt: -1 });
tutorSessionSchema.index({ user: 1, isActive: 1 });

// Virtual for message count
tutorSessionSchema.virtual('messageCount').get(function () {
    return this.messages.length;
});

// Method to add message
tutorSessionSchema.methods.addMessage = function (role, content, hasImage = false) {
    this.messages.push({ role, content, hasImage });
    return this.save();
};

// Method to get summary
tutorSessionSchema.methods.getSummary = function () {
    return {
        id: this._id,
        type: this.type,
        personality: this.personality,
        messageCount: this.messages.length,
        lastMessage: this.messages[this.messages.length - 1]?.content.substring(0, 100),
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    };
};

const TutorSession = mongoose.model('TutorSession', tutorSessionSchema);

export default TutorSession;
