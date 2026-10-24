const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Makes text safe to put inside an SQL string
function safeText(value) {
  return String(value || '').slice(0, 200).replace(/'/g, "''");
}

// POST /api/leads - Capture a lead, save it, and send it to the Google Sheet
router.post('/', async (req, res) => {
  const businessId = parseInt(req.body.businessId, 10);
  const sessionId = parseInt(req.body.sessionId, 10);
  const name = safeText(req.body.name);
  const email = safeText(req.body.email);

  if (!businessId || !email || !email.includes('@')) {
    return res.status(400).json({ error: 'Business ID and a valid email are required.' });
  }

  try {
    db.query(`INSERT INTO leads (business_id, name, email, chat_session_id) VALUES (${businessId}, '${name}', '${email}', ${sessionId || 'NULL'})`);
  } catch (error) {
    console.error('Could not save lead to database:', error.message);
  }

  // Send the lead to the Google Sheet, which also emails it
  const sheetUrl = process.env.LEADS_SHEET_URL;
  if (sheetUrl && typeof fetch === 'function') {
    try {
      let business = 'Business ' + businessId;
      const rows = db.query(`SELECT name FROM businesses WHERE id = ${businessId}`);
      if (rows.length && rows[0].name) business = rows[0].name;
      await fetch(sheetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business, name: req.body.name || '', email: req.body.email || '' })
      });
    } catch (error) {
      console.error('Could not send lead to Google Sheet:', error.message);
    }
  }

  res.status(201).json({ message: 'Lead captured successfully.' });
});

// GET /api/leads - Retrieve leads for a business
router.get('/', authMiddleware, (req, res) => {
  try {
    const businessId = parseInt(req.businessId, 10) || 0;
    const leads = db.query(`SELECT * FROM leads WHERE business_id = ${businessId} ORDER BY created_at DESC`);
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
