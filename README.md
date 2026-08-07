# DropBin

> Share files in seconds. Fast, temporary file sharing, made effortless.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://dropbin.onrender.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

DropBin is a modern, temporary file-sharing platform that lets you upload any file and get a shareable secure link instantly. Files are automatically deleted after expiration, so you never have to clean up.

**Live Demo**: [https://dropbin.onrender.com](https://dropbin.onrender.com)

---

## ✨ Features

- **⚡ Instant Uploads** – Drag and drop any file, get a link in seconds
- **🔒 Secure by Default** – Files are encrypted in transit and at rest
- **⏱️ Automatic Expiration** – Set timers from 1 hour to 30 days
- **🔐 Password Protection** – Optional password for sensitive files
- **📥 Download Limits** – Cap downloads at 1, 5, 10, or more
- **👤 No Account Required** – Upload and share without signing up
- **📁 Large File Support** – Send hefty payloads without compression
- **🛡️ Privacy First** – We don't peek, index, or mine your data

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/munachi-me/dropbin.git
cd dropbin
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
FILEBASE_ENDPOINT =your_filebase_endpoint
FILEBASE_BUCKET=your_filebase_bucket
FILEBASE_ACCESS_KEY=your_ffilebase_access_key
FILEBASE_SECRET_KEY=your_filebase_secret_key
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

---

## 🏗️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Database & Auth | [Supabase](https://supabase.com/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Animations | [GSAP](https://gsap.com/) + [ScrollTrigger](https://gsap.com/scrolltrigger/) |
| Icons | [React Icons](https://react-icons.github.io/react-icons/) |
| Deployment | [Render](https://render.com/) |

---

## 📁 Project Structure

```
dropbin/
├── app/                    # Next.js App Router
│   ├── about/              # About page
│   ├── pricing/            # Pricing page
│   ├── drop/               # Drop page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # Reusable components
│   ├── filecard.tsx        # File display card
│   ├── footer.tsx          # Site footer
│   ├── toast.tsx         # Toast notification
│   └── navbar.tsx          # Navigation bar
├── lib/                    # Utilities & config
│   ├── env.ts              # env config
│   ├── filebase.ts         # filebase setup
│   └── supabase.ts         # Supabase client setup
├── public/               # Static assets
│   └── dropbin-logo.svg  # Logo
├── .env.local            # Environment variables
├── next.config.ts        # Next.js config
├── package.json          # Dependencies
├── postcss.config.mjs    # PostCSS config
├── tsconfig.json         # TypeScript config
└── README.md             # This file
```

---

## 🗄️ Database Schema (Supabase)

```sql
-- Drops table (file uploads)
CREATE TABLE drops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  filename TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT,
  storage_path TEXT NOT NULL,
  password TEXT,
  expires_at TIMESTAMP NOT NULL,
  download_limit INTEGER DEFAULT 5,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);
```

---

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (browser-safe) | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | Optional |
| `FILEBASE_ENDPOINT` | Your Filebase project URL | Yes |
| `FILEBASE_BUCKET` | Filebase anonymous key (server-side only) | Yes |
| `FILEBASE_ACCESS_KEY` | Filebase access key (server-side only) | Yes |
| `FILEBASE_SECRET_KEY` | Filebase secret key (server-side only) | Yes |

> ⚠️ **Important**: Never expose `SUPABASE_SERVICE_ROLE_KEY` or `FILEBASE_ACCESS_KEY` or `FILEBASE_SECRET_KEY` in client-side code. Use it only in API routes or server components.

---

## 🚢 Deployment

### Deploy to Render (Recommended)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

1. Fork/clone this repository
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Configure build settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add environment variables in Render dashboard
6. Deploy!

### Deploy to Vercel

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmunachi-me%2Fdropbin)

1. Push your code to GitHub
2. Import the repository on Vercel
3. Add environment variables
4. Deploy!

---

## 📦 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

## 📞 Contact

- **GitHub**: [@munachi-me](https://github.com/munachi-me)
- **Live Site**: [https://dropbin.onrender.com](https://dropbin.onrender.com)

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Supabase](https://supabase.com/)
- Storage provider [Filebase](https://filebase.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**DropBin — Drop. Share. Done.**
