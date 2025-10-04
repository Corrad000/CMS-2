import { supabase } from './supabase';

export async function initializeDatabase() {
  try {
    const { data: existingSettings } = await supabase
      .from('company_settings')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (!existingSettings) {
      await supabase.from('company_settings').insert({
        company_name: 'My Company',
        primary_color: '#3b82f6',
        secondary_color: '#64748b',
      });
      console.log('Database initialized with default settings');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}
