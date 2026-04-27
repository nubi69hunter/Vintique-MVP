import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jcccugkueilsbnzrlert.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjY2N1Z2t1ZWlsc2JuenJsZXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMjk1ODYsImV4cCI6MjA5MjgwNTU4Nn0.B9ODuCkm1CLabXXA9O1vq_Sn2ZMGhGf6_rdh-N48U8U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
