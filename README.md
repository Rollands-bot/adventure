# Ruang Aktif Adventure - Landing Page

Landing page modern untuk layanan sewa peralatan outdoor menggunakan Next.js 14 App Router, Tailwind CSS, dan Framer Motion.

## 🚀 Fitur

- **Desain Modern & Responsif** - Tampilan premium yang optimal di semua device
- **Animasi Smooth** - Menggunakan Framer Motion untuk interaksi yang halus
- **Optimized Performance** - Lazy loading, optimized images dengan next/image
- **SEO Ready** - Metadata lengkap untuk optimasi search engine
- **Vercel Ready** - Siap deploy ke Vercel dengan konfigurasi minimal

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Language**: TypeScript
- **Deployment**: Vercel

## 📁 Struktur Folder

```
ruang-aktif-adventure/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout dengan metadata
│   │   └── page.tsx        # Halaman utama landing page
│   ├── components/
│   │   ├── Navbar.tsx      # Navigation bar
│   │   ├── Hero.tsx        # Hero section
│   │   ├── Features.tsx    # Features section
│   │   ├── Products.tsx    # Product showcase
│   │   ├── HowItWorks.tsx  # How it works section
│   │   ├── Testimonials.tsx # Testimonials section
│   │   ├── CTA.tsx         # Call to action section
│   │   ├── Footer.tsx      # Footer component
│   │   ├── FeatureCard.tsx # Reusable feature card
│   │   └── ProductCard.tsx # Reusable product card
│   └── styles/
│       └── globals.css     # Global styles & Tailwind config
├── public/                  # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## 🎨 Design System

### Warna
- **Primary**: Blue (#2563EB) - Untuk branding dan elemen utama
- **Accent**: Orange (#F97316) - Untuk CTA buttons
- **Neutral**: White, Gray scale - Untuk background dan text

### Typography
- **Font**: Inter (Google Fonts)
- **Style**: Modern sans-serif, clean & readable

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Build untuk Production

```bash
npm run build
npm start
```

## 📦 Deployment ke Vercel

### Option 1: Vercel Dashboard

1. Push code ke GitHub/GitLab/Bitbucket
2. Buka [vercel.com](https://vercel.com)
3. Import project dari repository
4. Vercel akan auto-detect Next.js
5. Klik **Deploy**

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables (jika diperlukan)

Tidak ada environment variable yang diperlukan untuk landing page ini.

## 📱 Sections

1. **Navbar** - Logo, navigation menu, CTA button
2. **Hero** - Full-width dengan background image, headline, dan CTA
3. **Features** - 4 feature cards dengan icon
4. **Products** - Grid produk dengan harga dan rating
5. **How It Works** - 3 step proses sewa
6. **Testimonials** - Review dari customer
7. **CTA** - Closing call-to-action
8. **Footer** - Links, contact info, social media

## ⚡ Performance

- **LCP**: < 2.5s (optimized images dengan next/image)
- **CLS**: < 0.1 (proper image dimensions)
- **FID**: < 100ms (minimal JavaScript)

## 📄 License

MIT License - feel free to use this template for your projects!

---

**Ruang Aktif Adventure** - Sewa Perlengkapan Outdoor Tanpa Ribet 🏔️
