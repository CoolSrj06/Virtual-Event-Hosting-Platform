const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.get('/events/allEvents', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching data');
  }
});

app.get('/events/:eventId', async (req, res) => {
    const { eventId } = req.params;
    try {
      const result = await pool.query('SELECT * FROM events WHERE id = $1', [eventId]);
      if (result.rows.length === 0) return res.status(404).json({ message: 'Event not found' });
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
app.get('/events/:eventId/sessions', async (req, res) => {
const { eventId } = req.params;

try {
    const result = await pool.query(
    'SELECT * FROM sessions WHERE event_id = $1 ORDER BY start_time ASC',
    [eventId]
    );
    res.json(result.rows);
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
}
});

// GET /sessions/:sessionId/questions - Fetch questions for a session
app.get('/sessions/:sessionId/questions', async (req, res) => {
const { sessionId } = req.params;
try {
    const result = await pool.query(
    'SELECT * FROM questions WHERE session_id = $1 ORDER BY timestamp DESC',
    [sessionId]
    );
    const formatted = result.rows.map(q => ({
    id: q.id,
    text: q.text,
    timestamp: new Date(q.timestamp).getTime(),
    username: q.username
    }));
    res.json(formatted);
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
}
});

// POST /sessions/:sessionId/questions - Submit a question for a session
app.post('/sessions/:sessionId/questions', async (req, res) => {
const { sessionId } = req.params;
const { text, username = 'Anonymous' } = req.body;
try {
    const id = uuidv4();  
    const result = await pool.query(
    'INSERT INTO questions (id,session_id, text, username) VALUES ($1, $2, $3, $4) RETURNING *',
    [id, sessionId, text, username]
    );
    const q = result.rows[0];
    res.status(201).json({
    id: q.id,
    text: q.text,
    timestamp: new Date(q.timestamp).getTime(),
    username: q.username
    });
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
}
});

// GET /sessions/:sessionId/analytics - Fetch analytics for a session
app.get('/sessions/:sessionId/analytics', async (req, res) => {
const { sessionId } = req.params;
try {
    const result = await pool.query(
    'SELECT * FROM analytics WHERE session_id = $1',
    [sessionId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'No analytics found' });
    res.json(result.rows[0]);
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
}
});

// GET session details by using sessionId
app.get('/sessions/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM sessions WHERE id = $1', [sessionId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Session not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(process.env.PORT, () => {
  console.log('Server is running on http://localhost:5000');
});
