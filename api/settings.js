const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://srmunnnqtokbavdfomaj.supabase.co',
  process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNybXVubm5xdG9rYmF2ZGZvbWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1ODE1NjAsImV4cCI6MjA4NzE1NzU2MH0.tFJNSG7ZTEBzmclvx5HD2xBhQ349y5gS7FDktf5z5vM'
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // GET - fetch all settings
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('school_settings').select('*');
      if (error) throw error;
      const settings = {};
      data.forEach(row => { settings[row.key] = row.value; });
      return res.status(200).json({ settings });
    }

    // PUT - update one or more settings
    if (req.method === 'PUT') {
      const updates = req.body;
      for (const [key, value] of Object.entries(updates)) {
        const { error } = await supabase.from('school_settings')
          .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
        if (error) throw error;
      }
      return res.status(200).json({ success: true });
    }

    // POST - start a new term: archive current results, save term/session, then clear
    if (req.method === 'POST') {
      const { term, session } = req.body;
      if (!term || !session) return res.status(400).json({ error: 'term and session are required' });

      // 1. Get current term so we know what label to archive under
      const { data: settingsRows } = await supabase.from('school_settings').select('*');
      const currentSettings = {};
      (settingsRows || []).forEach(r => { currentSettings[r.key] = r.value; });
      const currentTerm = currentSettings.current_term;
      const currentSession = currentSettings.current_session;

      // 2. Archive all student results under the CURRENT term before clearing
      if (currentTerm && currentSession) {
        const { data: students } = await supabase
          .from('students')
          .select('id, class_key, class_name, result, mid_result')
          .eq('status', 'active');
        for (const s of (students || [])) {
          const hasResult = s.result && Object.keys(s.result).length > 0;
          const hasMid = s.mid_result && Object.keys(s.mid_result).length > 0;
          if (!hasResult && !hasMid) continue;
          await supabase.from('student_results_archive').upsert({
            student_id: s.id,
            term: currentTerm,
            session: currentSession,
            class_key: s.class_key,
            class_name: s.class_name,
            result: s.result || {},
            mid_result: s.mid_result || {},
            archived_at: new Date().toISOString()
          }, { onConflict: 'student_id,term,session' });
        }
      }

      // 3. Save new term settings
      for (const [key, value] of [['current_term', term], ['current_session', session]]) {
        const { error } = await supabase.from('school_settings')
          .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
        if (error) throw error;
      }

      // 4. Clear result, mid_result, result_published on ALL active students
      const { error: clearError } = await supabase.from('students')
        .update({ result: null, mid_result: null, result_published: false })
        .eq('status', 'active');
      if (clearError) throw clearError;

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Settings API error:', error);
    return res.status(500).json({ error: error.message });
  }
};
