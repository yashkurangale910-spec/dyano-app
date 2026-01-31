import { supabase } from '../../config/supabase.js';

class SupabaseQuiz {
    constructor(data) {
        this.data = data;
    }

    static async create(quizData) {
        const payload = {
            user_id: quizData.user,
            title: quizData.title,
            topic: quizData.topic,
            topic_framing: quizData.topicFraming,
            questions: quizData.questions, // Store as JSONB
            difficulty: quizData.difficulty || 'medium',
            score: quizData.score || 0,
            total_questions: quizData.totalQuestions,
            is_completed: quizData.isCompleted || false,
            created_at: new Date()
        };

        const { data, error } = await supabase
            .from('quizzes')
            .insert([payload])
            .select()
            .single();

        if (error) throw new Error(error.message);
        return new SupabaseQuiz(data);
    }

    static async findById(id) {
        const { data, error } = await supabase
            .from('quizzes')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) return null;
        return new SupabaseQuiz(data);
    }

    static async find(query) {
        let builder = supabase.from('quizzes').select('*');

        if (query.user) {
            builder = builder.eq('user_id', query.user);
        }

        // Sorting by createdAt desc by default
        builder = builder.order('created_at', { ascending: false });

        const { data, error } = await builder;
        if (error) throw new Error(error.message);
        return data.map(d => new SupabaseQuiz(d));
    }

    async save() {
        const payload = {
            score: this.data.score,
            is_completed: this.data.is_completed,
            questions: this.data.questions
        };

        const { data, error } = await supabase
            .from('quizzes')
            .update(payload)
            .eq('id', this.data.id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        this.data = data;
        return this;
    }

    // Accessors
    get _id() { return this.data.id; }
    get title() { return this.data.title; }
    get topic() { return this.data.topic; }
    get questions() { return this.data.questions; }
    get score() { return this.data.score; }
    set score(val) { this.data.score = val; }
    get isCompleted() { return this.data.is_completed; }
    set isCompleted(val) { this.data.is_completed = val; }
}

export default SupabaseQuiz;
