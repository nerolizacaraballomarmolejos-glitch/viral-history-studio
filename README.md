# VIRAL HISTORY STUDIO

Videos virales de historia para TikTok, Reels y Shorts.

## Arranque

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Deploy

- **Vercel**: importa este repo (Root Directory vacío)
- **Railway worker**: Root Directory = `worker`

Variables:

```env
ELEVENLABS_API_KEY=
PEXELS_API_KEY=
RENDER_WORKER_URL=
WORKER_SECRET=
```

## Estructura

- `src/` — Next.js app
- `worker/` — FFmpeg render service (Railway)
