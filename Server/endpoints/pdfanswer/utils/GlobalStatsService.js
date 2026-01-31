/**
 * GlobalStatsService: Aggregates anonymous cognitive data to drive the Global Heatmap.
 */
export const GlobalStatsService = {
    /**
     * Get aggregated cognitive heatmap data.
     * In a production app, this would be a cache-heavy query across all users.
     */
    getHeatmapData: async () => {
        // Mocking global cognitive distribution
        const regions = [
            { name: 'North America', lng: -100, lat: 40, mastery: 0.8, struggle: 0.3 },
            { name: 'Europe', lng: 10, lat: 50, mastery: 0.9, struggle: 0.2 },
            { name: 'South Asia', lng: 80, lat: 20, mastery: 0.75, struggle: 0.45 },
            { name: 'East Asia', lng: 110, lat: 35, mastery: 0.85, struggle: 0.25 },
            { name: 'South America', lng: -60, lat: -15, mastery: 0.65, struggle: 0.35 },
            { name: 'Africa', lng: 20, lat: 0, mastery: 0.55, struggle: 0.5 }
        ];

        return {
            timestamp: new Date().toISOString(),
            totalSyncingUnits: 12450,
            regions: regions.map(r => ({
                ...r,
                nodeActivity: Math.floor(Math.random() * 1000)
            })),
            globalHotspots: [
                { id: 'react-hooks', label: 'React Hooks Complexity Spike', location: [80, 20], intensity: 0.9 },
                { id: 'docker-networking', label: 'DevOps Network Isolation', location: [10, 50], intensity: 0.7 }
            ]
        };
    }
};
