import { supabase } from '../../config/supabase.js';

class SupabaseFlashcardSet {
    constructor(data) {
        this.data = data;
    }

    static async create(setData) {
        const payload = {
            user_id: setData.user,
            title: setData.title,
            topic: setData.topic,
            cards: setData.cards, // Store card array as JSONB
            created_at: new Date()
        };

        const { data, error } = await supabase
            .from('flashcard_sets')
            .insert([payload])
            .select()
            .single();

        if (error) throw new Error(error.message);
        return new SupabaseFlashcardSet(data);
    }

    static async find(query) {
        let builder = supabase.from('flashcard_sets').select('*');
        if (query.user) {
            builder = builder.eq('user_id', query.user);
        }
        builder = builder.order('created_at', { ascending: false });

        const { data, error } = await builder;
        if (error) throw new Error(error.message);
        return data.map(d => new SupabaseFlashcardSet(d));
    }

    static async findById(id) {
        const { data, error } = await supabase
            .from('flashcard_sets')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data) return null;
        return new SupabaseFlashcardSet(data);
    }

    // Accessors
    get _id() { return this.data.id; }
    get title() { return this.data.title; }
    get topic() { return this.data.topic; }
    get cards() { return this.data.cards; }
}

export default SupabaseFlashcardSet;
