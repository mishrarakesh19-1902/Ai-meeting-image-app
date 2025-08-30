# AI Meeting Image Generator & Share (Full-Stack)

A minimal full-stack app that:
- Generates an image from a natural-language prompt using OpenAI's `gpt-image-1`
- Lets you download the PNG
- Lets you share it via email to multiple recipients (attachment + link)
- Simple React + Vite + Tailwind frontend and Express backend

## 1) Prerequisites
- Node.js 18+ and npm
- An OpenAI API key: set `OPENAI_API_KEY` in `server/.env`
- (For sharing) SMTP credentials (e.g., Gmail App Password)

## 2) Setup

```bash
# 1. Extract this project
unzip ai-meeting-image-app.zip
cd ai-meeting-image-app

# 2. Server
cd server
cp .env.example .env
# edit .env to add OPENAI_API_KEY and SMTP_* if you want email
npm i
npm run dev
# Server at http://localhost:8080

# 3. Client (in a new terminal)
cd ../client
npm i
# Point VITE_API_URL to your server if needed:
# On Windows PowerShell:
#   $env:VITE_API_URL="http://localhost:8080"
# On macOS/Linux:
#   export VITE_API_URL="http://localhost:8080"
npm run dev
# Client at http://localhost:5173
```

> If you need to change ports, update `server/.env` (`PORT`, `PUBLIC_BASE_URL`, `CLIENT_ORIGIN`) and `client` `.env` (`VITE_API_URL`).

## 3) How to use
1. Type a descriptive prompt (e.g., "Clean, minimalist poster for sprint planning meeting with modern office table, muted colors, high-res").
2. Choose a size and click **Generate Image**.
3. After the preview appears, click **Download PNG**, **Share via Email**, or **Copy Link**.

## 4) Email sending (SMTP)
- The app uses SMTP via Nodemailer.
- For Gmail:
  - Turn on 2FA
  - Create an **App Password**
  - Use: `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_SECURE=false`
  - `SMTP_USER=your@gmail.com`, `SMTP_PASS=<app password>`
- You can also use any SMTP provider (Resend, Mailgun, SendGrid, etc.)

## 5) Notes
- Images are stored under `server/storage/images` and served at `/images/<id>.png`.
- For production, put the server behind HTTPS and restrict CORS `CLIENT_ORIGIN` accordingly.
- You may swap OpenAI with any provider (Stability, Replicate, Fal.ai) in `server/index.js` where the image is generated.

## 6) Optional improvements
- Overlay meeting details (title/date/time) on the generated image using `sharp`.
- Add prompt presets and history.
- Add authentication for private sharing.
- Add an S3 bucket for storage and short-lived signed URLs.
```

