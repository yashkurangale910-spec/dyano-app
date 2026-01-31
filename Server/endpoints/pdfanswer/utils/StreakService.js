import UserProgress from '../models/UserProgress.js';

/**
 * StreakService: Handles the logic for daily activity streaks and XP awards
 */
export class StreakService {
    /**
     * Awards XP to a user and updates their total
     * @param {string} userId - The unique identifier of the user
     * @param {number} amount - Amount of XP to award
     * @returns {Object} Updated stats
     */
    static async awardXP(userId, amount) {
        let progress = await UserProgress.findOne({ user: userId });
        if (!progress) {
            progress = await UserProgress.create({ user: userId });
        }

        // Initialize XP if not exists (adding to model dynamically if schema is flexible, 
        // but let's assume it might need a separate field or stay in stats)
        if (!progress.stats.totalXP) progress.stats.totalXP = 0;

        progress.stats.totalXP += amount;

        // Handle Level Up Logic (e.g., 1000 XP per level)
        const currentLevel = Math.floor(progress.stats.totalXP / 1000) + 1;
        progress.stats.level = currentLevel;

        await progress.save();
        return { totalXP: progress.stats.totalXP, level: progress.stats.level };
    }

    /**
     * Synchronizes the daily streak based on activity
     * @param {string} userId - The unique identifier of the user
     */
    static async syncStreak(userId) {
        let progress = await UserProgress.findOne({ user: userId });
        if (!progress) {
            progress = await UserProgress.create({ user: userId });
        }

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (!progress.dailyStreak.lastActivityDate) {
            progress.dailyStreak.count = 1;
            progress.dailyStreak.lastActivityDate = today;
        } else {
            const lastActivity = new Date(progress.dailyStreak.lastActivityDate);
            const lastDay = new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate());

            const diffTime = Math.abs(today - lastDay);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // Consecutive day
                progress.dailyStreak.count += 1;
                progress.dailyStreak.lastActivityDate = today;
            } else if (diffDays > 1) {
                // Broken streak
                progress.dailyStreak.count = 1;
                progress.dailyStreak.lastActivityDate = today;
            }
            // If diffDays === 0, it's the same day, no change to streak count
        }

        await progress.save();
        return progress.dailyStreak;
    }

    /**
     * Check if a milestone has been reached and award achievements
     */
    static async checkMilestones(userId) {
        const progress = await UserProgress.findOne({ user: userId });
        if (!progress) return [];

        const newAchievements = [];
        const { stats, dailyStreak } = progress;

        // Milestone: First Mastery
        if (stats.totalRoadmapsCompleted >= 1 && !progress.achievements.some(a => a.name === 'roadmap_master')) {
            newAchievements.push('roadmap_master');
        }

        // Milestone: 7 Day Streak
        if (dailyStreak.count >= 7 && !progress.achievements.some(a => a.name === 'week_warrior')) {
            newAchievements.push('week_warrior');
        }

        if (newAchievements.length > 0) {
            newAchievements.forEach(name => {
                progress.achievements.push({ name, unlockedAt: new Date() });
            });
            await progress.save();
        }

        return newAchievements;
    }

    /**
     * Calculates the 'Neural Density' map for 3D visualization
     * Maps user mastery across categories to intensity values
     * @param {string} userId - The unique identifier of the user
     */
    static async getNeuralDensity(userId) {
        const progress = await UserProgress.findOne({ user: userId });
        if (!progress) return {};

        // Categories to map for the digital twin regions
        const categories = ['Frontend', 'Backend', 'DevOps', 'Mobile', 'Data Science', 'Security'];
        const density = {};

        // Derived from total stats for physics-simulation purposes
        const totalMastery = (progress.stats?.averageScore || 0) / 100;

        categories.forEach((cat, index) => {
            // Seed a deterministic-ish intensity for visual variety
            density[cat] = Math.min(1, (totalMastery * (0.5 + Math.random() * 0.5)));
        });

        return density;
    }
}
