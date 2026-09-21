const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://srmunnnqtokbavdfomaj.supabase.co',
  process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNybXVubm5xdG9rYmF2ZGZvbWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1ODE1NjAsImV4cCI6MjA4NzE1NzU2MH0.tFJNSG7ZTEBzmclvx5HD2xBhQ349y5gS7FDktf5z5vM'
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // GET - fetch archived results for a student, or all archives for a class
    if (req.method === 'GET') {
      const { student_id, class_key } = req.query;

      if (student_id) {
        const { data, error } = await supabase
          .from('student_results_archive')
          .select('*')
          .eq('student_id', student_id)
          .order('archived_at', { ascending: false });
        if (error) throw error;
        return res.status(200).json({ archives: data });
      }

      if (class_key) {
        // Get all student IDs in this class, then fetch their archives
        const { data: students, error: sErr } = await supabase
          .from('students')
          .select('id')
          .eq('class_key', class_key);
        if (sErr) throw sErr;
        const ids = students.map(s => s.id);
        if (!ids.length) return res.status(200).json({ archives: [] });
        const { data, error } = await supabase
          .from('student_results_archive')
          .select('*')
          .in('student_id', ids)
          .order('archived_at', { ascending: false });
        if (error) throw error;
        return res.status(200).json({ archives: data });
      }

      return res.status(400).json({ error: 'student_id or class_key required' });
    }

    // POST - archive current results for all students before a new term
    if (req.method === 'POST') {
      const { term, session } = req.body;
      if (!term || !session) return res.status(400).json({ error: 'term and session are required' });

      // Fetch all active students with results
      const { data: students, error: sErr } = await supabase
        .from('students')
        .select('id, class_key, class_name, result, mid_result')
        .eq('status', 'active');
      if (sErr) throw sErr;

      let archived = 0;
      for (const s of students) {
        // Only archive if there is actual result data
        const hasResult = s.result && Object.keys(s.result).length > 0;
        const hasMid = s.mid_result && Object.keys(s.mid_result).length > 0;
        if (!hasResult && !hasMid) continue;

        const { error } = await supabase
          .from('student_results_archive')
          .upsert({
            student_id: s.id,
            term,
            session,
            class_key: s.class_key,
            class_name: s.class_name,
            result: s.result || {},
            mid_result: s.mid_result || {},
            archived_at: new Date().toISOString()
          }, { onConflict: 'student_id,term,session' });
        if (!error) archived++;
      }

      return res.status(200).json({ success: true, archived });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Archive API error:', error);
    return res.status(500).json({ error: error.message });
  }
};
