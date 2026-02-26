const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://srmunnnqtokbavdfomaj.supabase.co',
  process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNybXVubm5xdG9rYmF2ZGZvbWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1ODE1NjAsImV4cCI6MjA4NzE1NzU2MH0.tFJNSG7ZTEBzmclvx5HD2xBhQ349y5gS7FDktf5z5vM'
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verify admin role
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // GET - List all teachers
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ teachers: data });
    }

    // POST - Add new teacher
    if (req.method === 'POST') {
      const { teacher_id, full_name, email, phone, subject, qualification, password } = req.body;

      if (!teacher_id || !full_name || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Insert teacher
      const { data: teacher, error: teacherError } = await supabase
        .from('teachers')
        .insert([{ teacher_id, full_name, email, phone, subject, qualification }])
        .select()
        .single();

      if (teacherError) throw teacherError;

      // Create login credentials if password provided
      if (password) {
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(password, 10);

        await supabase
          .from('users')
          .insert([{
            username: teacher_id,
            password: hashedPassword,
            full_name,
            role: 'teacher',
            email
          }]);
      }

      return res.status(201).json({ teacher });
    }

    // PUT - Update teacher
    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Teacher ID required' });
      }

      const { data, error } = await supabase
        .from('teachers')
        .update({ ...updates, updated_at: new Date() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json({ teacher: data });
    }

    // DELETE - Remove teacher
    if (req.method === 'DELETE') {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Teacher ID required' });
      }

      const { error } = await supabase
        .from('teachers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ message: 'Teacher deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Teachers API error:', error);
    return res.status(500).json({ error: error.message });
  }
};
