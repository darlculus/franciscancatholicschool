const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://srmunnnqtokbavdfomaj.supabase.co',
  process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNybXVubm5xdG9rYmF2ZGZvbWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1ODE1NjAsImV4cCI6MjA4NzE1NzU2MH0.tFJNSG7ZTEBzmclvx5HD2xBhQ349y5gS7FDktf5z5vM'
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // GET - list all classes
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return res.status(200).json({ classes: data });
    }

    // PUT - assign teacher to a class
    if (req.method === 'PUT') {
      const { class_id, teacher_id, teacher_name } = req.body;
      if (!class_id) return res.status(400).json({ error: 'class_id required' });

      const { data, error } = await supabase
        .from('classes')
        .update({ teacher_id, teacher_name })
        .eq('id', class_id)
        .select()
        .single();
      if (error) throw error;

      // Also update the teacher's assigned_class in users table
      if (teacher_id) {
        await supabase.from('users')
          .update({ assigned_class: data.class_key })
          .eq('username', teacher_id);
      }

      return res.status(200).json({ class: data });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Classes API error:', error);
    return res.status(500).json({ error: error.message });
  }
};
