import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import UserProgress from '../models/UserProgress.js';
import Quiz from '../models/Quiz.js';
import FlashcardSet from '../models/FlashcardSet.js';
import Roadmap from '../models/Roadmap.js';

const router = express.Router();

/**
 * Get user progress and statistics
 * @route GET /progress
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get or create user progress
        let progress = await UserProgress.findOne({ user: userId });

        if (!progress) {
            progress = await UserProgress.create({ user: userId });
        }

        // Calculate real-time stats
        const quizzes = await Quiz.find({ user: userId });
        const flashcardSets = await FlashcardSet.find({ user: userId });
        const roadmaps = await Roadmap.find({ user: userId });

        const completedQuizzes = quizzes.filter(q => q.isCompleted).length;
        const totalFlashcards = flashcardSets.reduce((sum, set) => sum + set.cards.length, 0);
        const completedRoadmaps = roadmaps.filter(r => r.status === 'completed').length;

        const averageScore = quizzes.length > 0
            ? quizzes.reduce((sum, q) => sum + (q.score || 0), 0) / quizzes.length
            : 0;

        // Update progress stats
        progress.stats.totalQuizzesTaken = quizzes.length;
        progress.stats.averageScore = Math.round(averageScore);
        progress.stats.totalFlashcardsLearned = totalFlashcards;
        progress.stats.totalRoadmapsCompleted = completedRoadmaps;

        // Calculate streak
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (progress.dailyStreak.lastActivityDate) {
            const lastActivity = new Date(progress.dailyStreak.lastActivityDate);
            lastActivity.setHours(0, 0, 0, 0);

            const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));

            if (daysDiff === 0) {
                // Same day, keep streak
            } else if (daysDiff === 1) {
                // Consecutive day, increment streak
                progress.dailyStreak.count += 1;
                progress.dailyStreak.lastActivityDate = new Date();
            } else {
                // Streak broken
                progress.dailyStreak.count = 1;
                progress.dailyStreak.lastActivityDate = new Date();
            }
        } else {
            progress.dailyStreak.count = 1;
            progress.dailyStreak.lastActivityDate = new Date();
        }

        await progress.save();

        res.json({
            success: true,
            data: {
                progress,
                breakdown: {
                    quizzes: {
                        total: quizzes.length,
                        completed: completedQuizzes,
                        averageScore: Math.round(averageScore)
                    },
                    flashcards: {
                        sets: flashcardSets.length,
                        totalCards: totalFlashcards
                    },
                    roadmaps: {
                        total: roadmaps.length,
                        completed: completedRoadmaps
                    }
                }
            }
        });
    } catch (error) {
        console.error('Progress fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch progress',
            error: error.message
        });
    }
});

/**
 * Update user progress (manual update)
 * @route POST /progress/update
 */
router.post('/update', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { studyTimeMinutes, achievement } = req.body;

        let progress = await UserProgress.findOne({ user: userId });

        if (!progress) {
            progress = await UserProgress.create({ user: userId });
        }

        if (studyTimeMinutes) {
            progress.stats.studyTimeMinutes += studyTimeMinutes;
        }

        if (achievement) {
            const exists = progress.achievements.some(a => a.name === achievement);
            if (!exists) {
                progress.achievements.push({ name: achievement });
            }
        }

        await progress.save();

        res.json({
            success: true,
            data: progress
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update progress',
            error: error.message
        });
    }
});

/**
 * Get achievements
 * @route GET /progress/achievements
 */
router.get('/achievements', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const progress = await UserProgress.findOne({ user: userId });

        const allAchievements = [
            { id: 'first_quiz', name: 'First Quiz', description: 'Complete your first quiz', icon: '🎯' },
            { id: 'quiz_master', name: 'Quiz Master', description: 'Complete 10 quizzes', icon: '🏆' },
            { id: 'perfect_score', name: 'Perfect Score', description: 'Get 100% on a quiz', icon: '💯' },
            { id: 'week_streak', name: 'Week Warrior', description: '7-day study streak', icon: '🔥' },
            { id: 'flashcard_fan', name: 'Flashcard Fan', description: 'Create 50 flashcards', icon: '📚' },
            { id: 'roadmap_runner', name: 'Roadmap Runner', description: 'Complete a roadmap', icon: '🗺️' },
        ];

        const unlockedIds = progress ? progress.achievements.map(a => a.name) : [];

        const achievements = allAchievements.map(ach => ({
            ...ach,
            unlocked: unlockedIds.includes(ach.id),
            unlockedAt: progress?.achievements.find(a => a.name === ach.id)?.unlockedAt
        }));

        res.json({
            success: true,
            data: achievements
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch achievements',
            error: error.message
        });
    }
});

export default router;
