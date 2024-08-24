import { createClient } from '@supabase/supabase-js';

// Substitua pelos valores do seu projeto Supabase
const SUPABASE_URL = 'https://ttswumsoivgohtgprfbf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0c3d1bXNvaXZnb2h0Z3ByZmJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ0NzkzNDAsImV4cCI6MjA0MDA1NTM0MH0.s4rRYQMC10ZjIArpD0xpB2eM7V5U5zuUorlumU_hDlU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
