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
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const { password: _, ...userData } = user;

    // For students, enrich with their student record
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

    res.json({ 
      success: true, 
      user: userData,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
