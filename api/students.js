const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://srmunnnqtokbavdfomaj.supabase.co',
  process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNybXVubm5xdG9rYmF2ZGZvbWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1ODE1NjAsImV4cCI6MjA4NzE1NzU2MH0.tFJNSG7ZTEBzmclvx5HD2xBhQ349y5gS7FDktf5z5vM'
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // GET - list students, optionally filtered by class_key
    if (req.method === 'GET') {
      const { class_key } = req.query;
      let query = supabase.from('students').select('*').eq('status', 'active').order('last_name');
      if (class_key) query = query.eq('class_key', class_key);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json({ students: data });
    }

    // POST - add new student
    if (req.method === 'POST') {
      const { first_name, last_name, middle_name, gender, date_of_birth, class_key, class_name,
              enrollment_date, parent_name, parent_phone, parent_email, address, medical_conditions,
              religion, state_of_origin, lga, guardian_name, guardian_phone, guardian_relationship,
              photo_url } = req.body;
      if (!first_name || !last_name || !gender || !class_key || !class_name)
        return res.status(400).json({ error: 'first_name, last_name, gender, class_key and class_name are required' });

      const { data, error } = await supabase.from('students').insert([{
        first_name, last_name, middle_name: middle_name || null, gender,
        date_of_birth: date_of_birth || null, class_key, class_name,
        enrollment_date: enrollment_date || null, parent_name, parent_phone, parent_email,
        address, medical_conditions, religion: religion || null,
        state_of_origin: state_of_origin || null, lga: lga || null,
        guardian_name: guardian_name || null, guardian_phone: guardian_phone || null,
        guardian_relationship: guardian_relationship || null, photo_url: photo_url || null
      }]).select().single();
      if (error) throw error;

      // Auto-create login account
      // Username = admission number, password = DOB as DDMMYYYY (or 'student123' if no DOB)
      const username = data.admission_number;
      let defaultPassword = 'student123';
      if (date_of_birth) {
        const d = new Date(date_of_birth);
        const dd = String(d.getUTCDate()).padStart(2, '0');
        const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
        const yyyy = d.getUTCFullYear();
        defaultPassword = `${dd}${mm}${yyyy}`;
      }
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      await supabase.from('users').insert([{
        username,
        password: hashedPassword,
        full_name: `${first_name} ${last_name}`,
        role: 'student',
        email: parent_email || null
      }]);

      return res.status(201).json({ student: data, default_password: defaultPassword });
    }

    // PUT - update student
    if (req.method === 'PUT') {
      const { id, ...fields } = req.body;
      if (!id) return res.status(400).json({ error: 'id required' });
      const { data, error } = await supabase.from('students').update(fields).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json({ student: data });
    }

    // DELETE - remove student
    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'id required' });
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Students API error:', error);
    return res.status(500).json({ error: error.message });
  }
};
