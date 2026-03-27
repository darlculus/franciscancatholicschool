const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

const supabaseUrl = 'https://srmunnnqtokbavdfomaj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNybXVubm5xdG9rYmF2ZGZvbWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1ODE1NjAsImV4cCI6MjA4NzE1NzU2MH0.tFJNSG7ZTEBzmclvx5HD2xBhQ349y5gS7FDktf5z5vM';
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }

  try {
    // First try the users table (staff, bursar, admin, and enrolled students)
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    // If found in users table, verify password with bcrypt
    if (!error && user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const { password: _, ...userData } = user;

      // Enrich student data from students table
      if (userData.role === 'student') {
        const { data: student } = await supabase
          .from('students')
          .select('id, admission_number, class_key, class_name, first_name, last_name, middle_name, photo_url')
          .eq('admission_number', userData.username)
          .single();
        if (student) {
          userData.student_id = student.id;
          userData.admission_number = student.admission_number;
          userData.class_key = student.class_key;
          userData.class_name = student.class_name;
          userData.name = [student.first_name, student.middle_name, student.last_name].filter(Boolean).join(' ');
          userData.photo_url = student.photo_url || null;
        }
      }

      return res.json({ success: true, user: userData, message: 'Login successful' });
    }

    // Fallback: try authenticating directly against the students table
    // Username = admission_number, password = DDMMYYYY of date_of_birth
    const { data: student, error: sErr } = await supabase
      .from('students')
      .select('*')
      .eq('admission_number', username)
      .eq('status', 'active')
      .single();

    if (sErr || !student) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Build expected password from DOB
    if (!student.date_of_birth) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const d = new Date(student.date_of_birth);
    const dd = String(d.getUTCDate()).padStart(2, '0');
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const yyyy = d.getUTCFullYear();
    const expectedPassword = `${dd}${mm}${yyyy}`;

    if (password !== expectedPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Auto-create the missing users row so future logins use bcrypt
    const hashedPassword = await bcrypt.hash(expectedPassword, 10);
    await supabase.from('users').upsert([{
      username: student.admission_number,
      password: hashedPassword,
      full_name: [student.first_name, student.middle_name, student.last_name].filter(Boolean).join(' '),
      role: 'student',
      email: student.parent_email || null
    }], { onConflict: 'username' });

    return res.json({
      success: true,
      message: 'Login successful',
      user: {
        username: student.admission_number,
        full_name: [student.first_name, student.middle_name, student.last_name].filter(Boolean).join(' '),
        role: 'student',
        student_id: student.id,
        admission_number: student.admission_number,
        class_key: student.class_key,
        class_name: student.class_name,
        name: [student.first_name, student.middle_name, student.last_name].filter(Boolean).join(' '),
        photo_url: student.photo_url || null
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
