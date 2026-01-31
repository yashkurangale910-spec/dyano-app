import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import UserProgress from '../models/UserProgress.js';
import Quiz from '../models/Quiz.js';
import FlashcardSet from '../models/FlashcardSet.js';
import Roadmap from '../models/Roadmap.js';

import { StreakService } from '../utils/StreakService.js';
import { ExpertModelService } from '../utils/ExpertModelService.js';

const router = express.Router();

/**
 * Get user progress and statistics
 * @route GET /progress
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Sync streak first
        await StreakService.syncStreak(userId);

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

        await progress.save();

        // Check for new achievements
        await StreakService.checkMilestones(userId);

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

/**
 * Get neural density map for 3D visualization
 * @route GET /progress/neural-density
 */
router.get('/neural-density', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const density = await StreakService.getNeuralDensity(userId);
        res.json({
            success: true,
            data: density
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch neural density',
            error: error.message
        });
    }
});

/**
 * Get expert blueprint for Cerebral Mesh comparison
 * @route GET /progress/expert-mesh/:category
 */
router.get('/expert-mesh/:category', authenticateToken, async (req, res) => {
    try {
        const { category } = req.params;
        const blueprint = await ExpertModelService.getExpertBlueprint(category);
        res.json({
            success: true,
            data: blueprint
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch expert blueprint',
            error: error.message
        });
    }
});

export default router;
