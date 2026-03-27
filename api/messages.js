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
    // GET - fetch messages
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('sent_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ messages: data || [] });
    }

    // POST - send a message
    if (req.method === 'POST') {
      const { sender_name, sender_role, recipient, subject, body } = req.body;
      if (!subject || !body || !recipient)
        return res.status(400).json({ error: 'subject, body and recipient are required' });

      const { data, error } = await supabase.from('messages').insert([{
        sender_name: sender_name || 'School',
        sender_role: sender_role || 'admin',
        recipient,
        subject,
        body,
        sent_at: new Date().toISOString()
      }]).select().single();
      if (error) throw error;
      return res.status(201).json({ message: data });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Messages API error:', err);
    return res.status(500).json({ error: err.message });
  }
};
