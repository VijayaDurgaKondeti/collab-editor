const express   = require('express');
const http      = require('http');
const cors      = require('cors');
const WebSocket = require('ws');
const Y         = require('yjs');
const { setupWSConnection } = require('y-websocket/bin/utils');
require('dotenv').config();

const { pool, initDB } = require('./db');

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());

const httpServer = http.createServer(app);
const wss = new WebSocket.Server({ server: httpServer });

const docs = new Map();

async function getDoc(docName) {
  if (docs.has(docName)) return docs.get(docName);

  const ydoc = new Y.Doc();

  try {
    const { rows } = await pool.query(
      'SELECT state FROM documents WHERE id = $1', [docName]
    );
    if (rows.length > 0) {
      Y.applyUpdate(ydoc, rows[0].state);
      console.log('Loaded doc from DB:', docName);
    }
  } catch (err) {
    console.error('Error loading doc:', err);
  }

  docs.set(docName, ydoc);
  return ydoc;
}

async function saveDoc(docName) {
  const ydoc = docs.get(docName);
  if (!ydoc) return;
  try {
    const state = Buffer.from(Y.encodeStateAsUpdate(ydoc));
    await pool.query(
      `INSERT INTO documents (id, state, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (id) DO UPDATE SET state = $2, updated_at = NOW()`,
      [docName, state]
    );
    console.log('Saved doc:', docName);
  } catch (err) {
    console.error('Error saving doc:', err);
  }
}

wss.on('connection', async (conn, req) => {
  const docName = req.url?.replace('/', '') || 'default';
  console.log('Client connected to room:', docName);

  await getDoc(docName);
  setupWSConnection(conn, req, { docName, gc: true });

  const saveInterval = setInterval(() => saveDoc(docName), 10_000);

  conn.on('close', () => {
    clearInterval(saveInterval);
    saveDoc(docName);
    console.log('Client disconnected from room:', docName);
  });
});

app.get('/', (_req, res) => res.send('Server running'));

async function start() {
  await initDB();
  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log('Server running on port', PORT);
  });
}

start();