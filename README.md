<div align="center">

# EXIF PULSE

### Advanced File Forensics — 100% In-Browser

Extract EXIF data, GPS coordinates, color palettes, PDF metadata, and audio/video properties from any file.  
Everything runs client-side. **Your files never leave your device.**

---

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)

</div>

---

## Features

### Image Analysis
- **Deep EXIF Extraction** — Camera make/model, lens, focal length, aperture, ISO, shutter speed, flash, orientation, software
- **Interactive GPS Map** — Leaflet map with dark tiles pinpoints exact photo location; one-click links to Google Maps and Apple Maps
- **Color Palette Extractor** — Canvas-based dominant color sampling with copyable HEX codes and a gradient preview bar
- **Dimension Stats** — Width × height, megapixel count, aspect ratio

### PDF Inspection
- Title, author, subject, keywords, creator tool, producer, creation/modification dates
- Encryption status and permission flags (print, copy, modify, annotate)

### Audio & Video
- Duration, bitrate, resolution (video), sample rate and channel count (audio)

### Privacy & Export Tools
- **Strip Metadata** — Re-renders images through HTML5 Canvas to produce a clean, EXIF-free copy ready for download
- **Metadata Search** — Live client-side filter across all extracted fields
- **Export Suite** — One-click export to JSON, CSV, or a print-ready PDF report (jsPDF)

### UX & Design
- Mystical dark aesthetic: deep black, gold accents, Cormorant Garant serif display font
- Starfield + constellation SVG decorations
- Full landing page: hero drop zone, feature grid, arched showcase section, format collection cards
- Fully responsive split-pane analysis dashboard

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| EXIF extraction | exif-js |
| PDF parsing | pdfjs-dist |
| Maps | Leaflet + CartoDB Dark tiles |
| PDF export | jsPDF |
| Icons | Lucide React |
| Fonts | Cormorant Garant, Inter (Google Fonts) |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (comes with Node 18)

Check your versions:

```bash
node -v
npm -v
```

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/exif-pulse.git
cd exif-pulse
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

4. **Open in your browser**

```
http://localhost:5173
```

That's it — no API keys, no backend, no environment variables required.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server with HMR at `localhost:5173` |
| `npm run build` | Build optimised production bundle to `dist/` |
| `npm run preview` | Serve the production build locally for testing |
| `npm run lint` | Run ESLint across all source files |
| `npm run typecheck` | Run TypeScript type-checking without emitting files |

---

## Project Structure

```
exif-pulse/
├── public/
├── src/
│   ├── components/
│   │   ├── ColorPalette.tsx      # Dominant color swatches with copy-to-clipboard
│   │   ├── DropZone.tsx          # Drag-and-drop file input with scan animation
│   │   ├── ExportToolbar.tsx     # JSON / CSV / PDF export + metadata stripper
│   │   ├── FileCard.tsx          # Sidebar file queue item
│   │   ├── GPSMap.tsx            # Leaflet map with dark CartoDB tiles
│   │   ├── LandingFeatures.tsx   # Landing page sections (features, showcase, formats)
│   │   ├── LandingHero.tsx       # Hero section with starfield and drop zone
│   │   ├── MetadataPanel.tsx     # Tabbed analysis view (Overview / Technical / Location / Raw)
│   │   └── StarField.tsx         # Animated star field + constellation SVG decorations
│   ├── types/
│   │   └── index.ts              # Shared TypeScript interfaces
│   ├── utils/
│   │   ├── exifUtils.ts          # EXIF + GPS extraction via exif-js
│   │   ├── exportUtils.ts        # JSON / CSV / PDF / sanitized-image download
│   │   ├── fileUtils.ts          # File type detection, color palette, preview generation
│   │   ├── mediaUtils.ts         # Audio/video duration and codec extraction
│   │   └── pdfUtils.ts           # PDF metadata + permission parsing via pdfjs-dist
│   ├── App.tsx                   # Root layout: landing + dashboard
│   ├── index.css                 # Global styles, Tailwind layers, Leaflet overrides
│   └── main.tsx                  # React entry point
├── index.html
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## Deployment

### Netlify (recommended)

1. Push the repository to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) and click **"Add new site" → "Import an existing project"**
3. Connect to GitHub and select this repository
4. Set build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **Deploy**

### Vercel

```bash
npm i -g vercel
vercel --prod
```

Accept the defaults (Vite is auto-detected).

### GitHub Pages

1. Install the deployment helper:

```bash
npm install -D gh-pages
```

2. Add to `package.json` scripts:

```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

3. Add `base` to `vite.config.ts`:

```ts
export default defineConfig({
  base: '/exif-pulse/',
  plugins: [react()],
})
```

4. Deploy:

```bash
npm run deploy
```

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build -t exif-pulse .
docker run -p 8080:80 exif-pulse
```

---

## Privacy

EXIF PULSE is designed with a **privacy-first** architecture:

- **Zero network requests** for file processing — all parsing runs in the browser
- **No file uploads** — files are read via the HTML5 File API and never sent to a server
- **No analytics or tracking** — no cookies, no telemetry
- **No backend required** — the `dist/` folder is a fully static site

The only outbound requests are:
- Google Fonts (typography)
- Leaflet tile CDN (only when a file contains GPS data and the Location tab is open)
- CartoDB map tiles (same condition)

To run fully offline, serve the app from `localhost` and the map tiles will simply fail gracefully.

---

## Supported File Types

| Category | Formats |
|---|---|
| Images | JPG / JPEG, PNG, WebP, GIF, BMP, TIFF, HEIC, HEIF |
| Documents | PDF |
| Audio | MP3, WAV, OGG, FLAC, AAC, M4A, WMA |
| Video | MP4, MOV, AVI, MKV, WebM, WMV, FLV |

---

## Uploading to GitHub

If you haven't initialised git yet, run these commands in the project root:

```bash
# 1. Initialise a git repository
git init

# 2. Stage all files (node_modules and dist are already in .gitignore)
git add .

# 3. Initial commit
git commit -m "feat: initial EXIF PULSE release"

# 4. Create a repo on GitHub (via web UI or gh CLI)
gh repo create exif-pulse --public --source=. --remote=origin --push

# Or, if you created the repo manually on GitHub:
git remote add origin https://github.com/YOUR_USERNAME/exif-pulse.git
git branch -M main
git push -u origin main
```

---

## Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push the branch: `git push origin feature/my-feature`
5. Open a Pull Request

Please ensure `npm run build` and `npm run typecheck` pass before submitting.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
  Built with React, Vite, and Tailwind CSS
</div>
