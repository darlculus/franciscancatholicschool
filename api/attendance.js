const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://srmunnnqtokbavdfomaj.supabase.co',
  process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNybXVubm5xdG9rYmF2ZGZvbWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1ODE1NjAsImV4cCI6MjA4NzE1NzU2MH0.tFJNSG7ZTEBzmclvx5HD2xBhQ349y5gS7FDktf5z5vM'
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // GET - load attendance for a class on a date
    if (req.method === 'GET') {
      const { date, class_key } = req.query;
      if (!date || !class_key) return res.status(400).json({ error: 'date and class_key required' });

      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('date', date)
        .eq('class_key', class_key)
        .order('student_name', { ascending: true });
      if (error) throw error;
      return res.status(200).json({ records: data });
    }

    // POST - save attendance records for a class on a date
    if (req.method === 'POST') {
      const { date, class_key, class_name, teacher_id, records } = req.body;
      if (!date || !class_key || !records?.length)
        return res.status(400).json({ error: 'date, class_key and records required' });

      // Delete existing records for this date+class then re-insert
      await supabase.from('attendance').delete().eq('date', date).eq('class_key', class_key);

      const rows = records.map(r => ({
        date,
        class_key,
        class_name,
        teacher_id,
        student_id: r.studentId,
        student_name: r.studentName,
        status: r.status || 'absent',
        time_in: r.timeIn || null,
        notes: r.notes || null
      }));

      const { error } = await supabase.from('attendance').insert(rows);
      if (error) throw error;

      return res.status(200).json({ success: true, saved: rows.length });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Attendance API error:', error);
    return res.status(500).json({ error: error.message });
  }
};
