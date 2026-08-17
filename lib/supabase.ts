import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://olbjlqwtkugfjdikruql.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sYmpscXd0a3VnZmpkaWtydXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MDQ2OTksImV4cCI6MjEwMjE4MDY5OX0.mtHADDXylTsWvq9oNMpHIoc4NtDh_BYuizhPm24U8QM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);