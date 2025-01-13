import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tsyyrcteowtqfopoifti.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzeXlyY3Rlb3d0cWZvcG9pZnRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyMDM5ODgsImV4cCI6MjA1MDc3OTk4OH0.cbC4kAiyRRQjLuC9ccESsfAFVJCUCSKylpd2qpTw-8k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
