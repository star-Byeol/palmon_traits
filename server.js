const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbywLfYa3YMQt4lWXdD25JJWlVHf3C5kBiqYgkwPlbMRtzzVjhfxSLlp88hB07nPK3Dr/exec';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

async function fetchAppsScriptJson(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Apps Script 요청 실패: HTTP ${response.status} / ${text}`);
  }

  return await response.json();
}

app.get('/api/traits', async (req, res) => {
  try {
    const q = req.query.q || '';
    const url = `${APPS_SCRIPT_URL}?action=traits&q=${encodeURIComponent(q)}`;
    const data = await fetchAppsScriptJson(url);
    res.json(data);
  } catch (error) {
    console.error('GET /api/traits error:', error);
    res.status(500).json({ error: String(error.message || error) });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    const url = `${APPS_SCRIPT_URL}?action=search&q=${encodeURIComponent(q)}`;
    const data = await fetchAppsScriptJson(url);
    res.json(data);
  } catch (error) {
    console.error('GET /api/search error:', error);
    res.status(500).json({ error: String(error.message || error) });
  }
});

app.get('/api/alias', async (req, res) => {
  try {
    const q = req.query.q || '';
    const url = `${APPS_SCRIPT_URL}?action=alias&q=${encodeURIComponent(q)}`;
    const data = await fetchAppsScriptJson(url);
    res.json(data);
  } catch (error) {
    console.error('GET /api/alias error:', error);
    res.status(500).json({ error: String(error.message || error) });
  }
});

app.get('/api/recommend', async (req, res) => {
  try {
    const url = `${APPS_SCRIPT_URL}?action=recommend`;
    const data = await fetchAppsScriptJson(url);
    res.json(data);
  } catch (error) {
    console.error('GET /api/recommend error:', error);
    res.status(500).json({ error: String(error.message || error) });
  }
});

app.post('/api/save', async (req, res) => {
  try {
    const url = `${APPS_SCRIPT_URL}?action=save`;
    const data = await fetchAppsScriptJson(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    res.json(data);
  } catch (error) {
    console.error('POST /api/save error:', error);
    res.status(500).json({ error: String(error.message || error) });
  }
});

app.post('/api/request', async (req, res) => {
  try {
    const url = `${APPS_SCRIPT_URL}?action=request`;
    const data = await fetchAppsScriptJson(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    res.json(data);
  } catch (error) {
    console.error('POST /api/request error:', error);
    res.status(500).json({ error: String(error.message || error) });
  }
});

app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});