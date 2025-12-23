# WHAStore Frontend

Frontend untuk WHAStore (top-up game) berbasis Next.js App Router, React Query, dan Tailwind. Mendukung katalog game, checkout Midtrans, dan dashboard admin transaksi.

## Teknologi
- Next.js 16 (App Router, Turbopack)
- TypeScript + React Query
- TailwindCSS
- Axios + Zod schema (normalisasi data API)
- Docker (build & runtime)

## Prasyarat
- Node.js 20+
- npm (atau pnpm/yarn/bun, gunakan npm untuk konsistensi CI)
- Optional: Docker + Docker Compose

## Menjalankan Lokal
1) Install dependencies  
```bash
npm ci
```

2) Siapkan env (salin dari contoh)  
```bash
cp .env.local .env
# kemudian isi NEXT_PUBLIC_API_URL, contoh:
# NEXT_PUBLIC_API_URL=https://apiweb.whastore.my.id/api/v1
```

3) Jalankan dev server  
```bash
npm run dev
# buka http://localhost:3000
```

## Skrip Penting
- `npm run dev`    : jalankan di mode pengembangan
- `npm run lint`   : cek lint
- `npm run build`  : build produksi (Next)

## Docker
Build dan jalankan kontainer:
```bash
docker build -t whastore-frontend .
docker run -p 3000:3000 --env-file .env whastore-frontend
```

Deploy dengan compose (lihat `docker-compose.yml`):
```bash
docker compose pull
docker compose up -d
```

## Konfigurasi ENV
Minimal:
- `NEXT_PUBLIC_API_URL` : base URL API, contoh `https://apiweb.whastore.my.id/api/v1`
- `NEXT_PUBLIC_SITE_NAME` : nama brand (opsional)

## CI/CD (GitHub Actions)
- Job `lint`   : npm ci + lint
- Job `docker` : build & push image ke GHCR `ghcr.io/wildanhanifabdillah/store-frontend`
- Job `deploy` : SSH ke VPS, `docker compose pull && up -d`

Pastikan secret berikut terisi: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_SSH_PORT`, `VPS_FRONTEND_PATH`.

## Catatan Gambar
`next.config.js` diset `images.unoptimized = true` untuk menghindari error optimizer. Akses gambar langsung dari CDN yang sudah di-whitelist.

## Troubleshooting
- 404 atau gagal fetch API: cek `NEXT_PUBLIC_API_URL` di env/container.
- Gambar 400 via `/_next/image`: sudah dinonaktifkan, pastikan deploy terbaru.
- Lint/type error saat build: jalankan `npm run lint` sebelum push.
