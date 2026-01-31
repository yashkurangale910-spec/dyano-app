import { supabase } from '../../config/supabase.js';
import bcrypt from 'bcryptjs';

class SupabaseUser {
    constructor(data) {
        this.data = data;
    }

    static async findOne(query) {
        // Simple query mapping for email
        if (query.email) {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', query.email)
                .single();

            if (error || !data) return null;
            return new SupabaseUser(data); // Return instance
        }
        return null;
    }

    static async findById(id) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) return null;
        return new SupabaseUser(data);
    }

    static async create(userData) {
        // Hash password manually before insert, similar to Mongoose pre-save
        if (userData.password) {
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);
        }

        // Default values
        const payload = {
            ...userData,
            isActive: true,
            createdAt: new Date(),
            lastLogin: null
        };

        const { data, error } = await supabase
            .from('users')
            .insert([payload])
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return new SupabaseUser(data);
    }

    async comparePassword(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.data.password);
    }

    static async find() {
        const { data, error } = await supabase
            .from('users')
            .select('*');

        if (error) return [];
        return data.map(d => new SupabaseUser(d));
    }

    // Accessors for common fields to match Mongoose document interface
    get _id() { return this.data.id; } // Mongoose uses _id, Supabase uses id
    get id() { return this.data.id; }
    get email() { return this.data.email; }
    get name() { return this.data.name; }
    get password() { return this.data.password; }

    // Logic to save updates (e.g. lastLogin)
    async save() {
        const { data, error } = await supabase
            .from('users')
            .update(this.data) // Update everything currently in this.data
            .eq('id', this.data.id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        this.data = data;
        return this;
    }
}

export default SupabaseUser;
