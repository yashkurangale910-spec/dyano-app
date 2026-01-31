import { supabase } from '../../config/supabase.js';

class SupabaseRoadmap {
    constructor(data) {
        this.data = data;
    }

    static async create(roadmapData) {
        // Map Mongoose-style 'user' (ObjectId) to Supabase 'user_id'
        const payload = {
            user_id: roadmapData.user,
            title: roadmapData.title,
            console_goal: roadmapData.goal, // DB column might be 'goal' or 'console_goal', using 'goal' map
            goal: roadmapData.goal,
            status: roadmapData.status || 'not started',
            steps: roadmapData.steps, // JSONB column
            created_at: new Date()
        };

        const { data, error } = await supabase
            .from('roadmaps')
            .insert([payload])
            .select()
            .single();

        if (error) throw new Error(error.message);
        return new SupabaseRoadmap(data);
    }

    static async find(query, sort = null) {
        let builder = supabase
            .from('roadmaps')
            .select('*');

        if (query.user) {
            builder = builder.eq('user_id', query.user);
        }

        if (sort && sort.createdAt === -1) {
            builder = builder.order('created_at', { ascending: false });
        }

        const { data, error } = await builder;
        if (error) throw new Error(error.message);

        return data.map(d => new SupabaseRoadmap(d));
    }

    // Accessors
    get _id() { return this.data.id; }
    get title() { return this.data.title; }
    get goal() { return this.data.goal; }
    get steps() { return this.data.steps; }
    get status() { return this.data.status; }
    get createdAt() { return this.data.created_at; }
}

export default SupabaseRoadmap;
