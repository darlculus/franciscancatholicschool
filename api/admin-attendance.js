const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://srmunnnqtokbavdfomaj.supabase.co',
  process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNybXVubm5xdG9rYmF2ZGZvbWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1ODE1NjAsImV4cCI6MjA4NzE1NzU2MH0.tFJNSG7ZTEBzmclvx5HD2xBhQ349y5gS7FDktf5z5vM'
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { class_key, from_date, to_date } = req.query;

    // Build attendance query with optional filters
    let attQuery = supabase.from('attendance').select('student_id, student_name, class_key, class_name, status, date');
    if (class_key) attQuery = attQuery.eq('class_key', class_key);
    if (from_date) attQuery = attQuery.gte('date', from_date);
    if (to_date) attQuery = attQuery.lte('date', to_date);

    const { data: records, error } = await attQuery;
    if (error) throw error;

    // Group by student and calculate rates
    const studentMap = {};
    records.forEach(r => {
      if (!studentMap[r.student_id]) {
        studentMap[r.student_id] = {
          student_id: r.student_id,
          student_name: r.student_name,
          class_key: r.class_key,
          class_name: r.class_name,
          total: 0, present: 0, absent: 0, late: 0
        };
      }
      const s = studentMap[r.student_id];
      s.total++;
      if (r.status === 'present') s.present++;
      else if (r.status === 'absent') s.absent++;
      else if (r.status === 'late') s.late++;
    });

    const students = Object.values(studentMap).map(s => ({
      ...s,
      rate: s.total > 0 ? Math.round(((s.present + s.late) / s.total) * 100) : null,
      flagged: s.total > 0 && ((s.present + s.late) / s.total) < 0.7
    }));

    // Sort: flagged first, then by rate ascending
    students.sort((a, b) => {
      if (a.flagged && !b.flagged) return -1;
      if (!a.flagged && b.flagged) return 1;
      return (a.rate ?? 100) - (b.rate ?? 100);
    });

    // Also get class-level summary
    const classMap = {};
    students.forEach(s => {
      if (!classMap[s.class_key]) {
        classMap[s.class_key] = { class_key: s.class_key, class_name: s.class_name, students: 0, flagged: 0, total_rate: 0, counted: 0 };
      }
      classMap[s.class_key].students++;
      if (s.flagged) classMap[s.class_key].flagged++;
      if (s.rate !== null) { classMap[s.class_key].total_rate += s.rate; classMap[s.class_key].counted++; }
    });

    const classes = Object.values(classMap).map(c => ({
      ...c,
      avg_rate: c.counted > 0 ? Math.round(c.total_rate / c.counted) : null
    }));

    return res.status(200).json({ students, classes });
  } catch (error) {
    console.error('Admin attendance API error:', error);
    return res.status(500).json({ error: error.message });
  }
};
