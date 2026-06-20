# 📝 Real-Time Collaborative Editor

A Google Docs-like collaborative editor where multiple users can edit documents simultaneously in real-time, with zero merge conflicts.

🔗 **Live Demo**: https://collab-editor-kappa.vercel.app

---

## ✨ Features

- 🔄 **Real-time sync** — changes appear instantly across all connected users
- 🧠 **Conflict-free editing** — powered by Yjs CRDTs, no merge conflicts ever
- 🏠 **Document rooms** — each document gets a unique shareable URL
- 👥 **Online presence** — see how many users are in the room
- 🔗 **Copy link** — share your document with one click
- 💾 **Persistence** — documents saved to PostgreSQL, survive server restarts
- ✍️ **Rich text** — bold, italic, underline, headings, and links

---

## 🏗️ Architecture
Browser A ──┐                    ┌── Browser B

│   WebSocket (WSS)  │

└──► Node.js Server ◄┘

│

┌───────┴────────┐

│                │

Yjs CRDT          PostgreSQL

(sync)            (persist)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, React 19 |
| Editor | Quill.js |
| Real-time | WebSockets (ws), y-websocket |
| Conflict Resolution | Yjs CRDTs |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Deployment | Vercel (frontend), Render (backend) |

---

## 🚀 How It Works

1. Each document room has a unique ID (e.g. `/doc/abc123`)
2. Users connect via WebSocket to the Node.js backend
3. Every keystroke is encoded as a **Yjs CRDT update** and broadcast to all users
4. CRDTs guarantee that concurrent edits from multiple users **never conflict**
5. Document state is saved to PostgreSQL every 10 seconds and on disconnect
6. When a user joins an existing room, the saved state is loaded from the database

---

## ⚙️ Run Locally

### Prerequisites
- Node.js 18+
- PostgreSQL

### Backend

```bash
cd server
npm install
node index.js
```

Create `server/.env`:

DATABASE_URL=postgresql://postgres:password@localhost:5432/collab_editor

CLIENT_URL=http://localhost:3000

PORT=4000

### Frontend

```bash
cd client
npm install
npm run dev
```

Create `client/.env.local`:

Open `http://localhost:3000` in two browser tabs and start collaborating!

---

## 📁 Project Structure
collab-editor/

├── client/                 # Next.js frontend

│   └── src/

│       ├── app/

│       │   ├── page.tsx           # Home page (create/join rooms)

│       │   └── doc/[id]/page.tsx  # Document room page

│       └── components/

│           └── Editor.tsx         # Quill + Yjs editor

└── server/                 # Node.js backend

├── index.js            # WebSocket server + y-websocket

└── db.js               # PostgreSQL connection + persistence

---

## 📈 Resume Bullet Points

- Built real-time collaborative text editor supporting concurrent multi-user editing via Yjs CRDTs and WebSockets
- Implemented conflict-free replicated data types (CRDTs) to resolve simultaneous edits with zero data loss
- Designed document persistence using PostgreSQL with binary Yjs state snapshots
- Built unique shareable document rooms with live online user presence tracking
- Deployed on Vercel + Render with persistent WebSocket connections

---

## 🔮 Future Improvements

- User authentication with NextAuth.js
- Version history and document restore
- Export to PDF / Markdown
- Comments and suggestions mode