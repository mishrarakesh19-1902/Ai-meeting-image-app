// import "dotenv/config";
// import express from "express";
// import cors from "cors";
// import fs from "fs-extra";
// import path from "path";
// import { fileURLToPath } from "url";
// import { v4 as uuidv4 } from "uuid";
// import OpenAI from "openai";
// import nodemailer from "nodemailer";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const PORT = process.env.PORT || 8080;
// const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || `http://localhost:${PORT}`;
// const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// app.use(cors({
//   origin: CLIENT_ORIGIN,
//   credentials: true
// }));
// app.use(express.json({ limit: "2mb" }));

// // Ensure storage dir exists
// const imagesDir = path.join(__dirname, "storage", "images");
// await fs.ensureDir(imagesDir);

// // Static serving for generated images
// app.use("/images", express.static(imagesDir, { maxAge: "7d", immutable: false }));

// // Health
// app.get("/api/health", (req, res) => {
//   res.json({ ok: true, time: new Date().toISOString() });
// });

// // OpenAI client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// // Generate image endpoint
// app.post("/api/generate", async (req, res) => {
//   try {
//     const { prompt, size } = req.body || {};
//     if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
//       return res.status(400).json({ error: "Prompt is required." });
//     }
//     const imgSize = (size && typeof size === "string" && /^\d+x\d+$/.test(size)) ? size : "1024x1024";

//     // Call OpenAI Images API
//     const response = await openai.images.generate({
//       model: "gpt-image-1",
//       prompt,
//       size: imgSize
//     });

//     const b64 = response.data?.[0]?.b64_json;
//     if (!b64) {
//       return res.status(500).json({ error: "Image generation failed (no data returned)." });
//     }
//     const buffer = Buffer.from(b64, "base64");
//     const id = uuidv4();
//     const filePath = path.join(imagesDir, `${id}.png`);
//     await fs.writeFile(filePath, buffer);

//     const imageUrl = `${PUBLIC_BASE_URL}/images/${id}.png`;
//     res.json({ id, imageUrl, size: imgSize });
//   } catch (err) {
//     console.error("Generate error:", err?.response?.data || err);
//     res.status(500).json({ error: "Failed to generate image.", details: err?.message || String(err) });
//   }
// });

// // Helper: build a mailer or return null if not configured
// function buildTransport() {
//   const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;
//   if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null;
//   return nodemailer.createTransport({
//     host: SMTP_HOST,
//     port: Number(SMTP_PORT),
//     secure: String(SMTP_SECURE).toLowerCase() === "true",
//     auth: {
//       user: SMTP_USER,
//       pass: SMTP_PASS
//     }
//   });
// }

// // Share via email
// app.post("/api/share", async (req, res) => {
//   try {
//     const { id, to, subject, message } = req.body || {};
//     if (!id) return res.status(400).json({ error: "id is required." });
//     if (!to) return res.status(400).json({ error: "Recipient(s) are required." });

//     const filePath = path.join(imagesDir, `${id}.png`);
//     const exists = await fs.pathExists(filePath);
//     if (!exists) return res.status(404).json({ error: "Image not found." });

//     // Parse recipients (comma or space separated)
//     const recipients = (Array.isArray(to) ? to : String(to).split(/[,;\s]+/))
//       .map(s => s.trim())
//       .filter(Boolean);
//     if (!recipients.length) return res.status(400).json({ error: "No valid recipients found." });

//     const imageUrl = `${PUBLIC_BASE_URL}/images/${id}.png`;
//     const subj = subject || "AI Meeting Image";
//     const html = message || `
//       <p>Hello,</p>
//       <p>A meeting image has been shared with you.</p>
//       <p><a href="${imageUrl}" target="_blank" rel="noopener">Open image</a></p>
//       <p>— Sent from AI Meeting Image App</p>
//     `;

//     const transport = buildTransport();
//     if (!transport) {
//       return res.status(400).json({ error: "SMTP is not configured. Please set SMTP_* env vars." });
//     }

//     const from = process.env.SMTP_FROM || process.env.SMTP_USER;
//     await transport.sendMail({
//       from,
//       to: recipients,
//       subject: subj,
//       html,
//       attachments: [
//         {
//           filename: `meeting-image-${id}.png`,
//           path: filePath,
//           contentType: "image/png"
//         }
//       ]
//     });

//     res.json({ ok: true, imageUrl, recipients });
//   } catch (err) {
//     console.error("Share error:", err);
//     res.status(500).json({ error: "Failed to send email.", details: err?.message || String(err) });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server listening on http://localhost:${PORT}`);
// });



import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import fetch from "node-fetch";
import FormData from "form-data";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || `http://localhost:${PORT}`;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true
}));
// app.use(cors({
//   origin: "*"
// }));

app.use(express.json({ limit: "2mb" }));

// Ensure storage dir exists
const imagesDir = path.join(__dirname, "storage", "images");
await fs.ensureDir(imagesDir);

// Static serving for generated images
app.use("/images", express.static(imagesDir, { maxAge: "7d", immutable: false }));

// Health
app.get("/api/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// ✅ Generate image with Stability AI (multipart/form-data)
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, size } = req.body || {};
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    // default size if not provided
    const imgSize = size || "1024x1024";
    const [width, height] = imgSize.split("x").map(Number);

    // Build form-data body
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("output_format", "png");
    formData.append("width", width);
    formData.append("height", height);

    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "application/json"
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Stability API error:", errorText);
      return res.status(500).json({ error: "Image generation failed.", details: errorText });
    }

    const data = await response.json();

    // The image comes base64-encoded
    const b64 = data?.image;
    if (!b64) {
      return res.status(500).json({ error: "No image data returned." });
    }

    const buffer = Buffer.from(b64, "base64");
    const id = uuidv4();
    const filePath = path.join(imagesDir, `${id}.png`);
    await fs.writeFile(filePath, buffer);

    const imageUrl = `${PUBLIC_BASE_URL}/images/${id}.png`;
    res.json({ id, imageUrl, size: imgSize });
  } catch (err) {
    console.error("Generate error:", err);
    res.status(500).json({ error: "Failed to generate image.", details: err?.message || String(err) });
  }
});

// Helper: build a mailer or return null if not configured
function buildTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(SMTP_SECURE).toLowerCase() === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
}

// Share via email
app.post("/api/share", async (req, res) => {
  try {
    const { id, to, subject, message } = req.body || {};
    if (!id) return res.status(400).json({ error: "id is required." });
    if (!to) return res.status(400).json({ error: "Recipient(s) are required." });

    const filePath = path.join(imagesDir, `${id}.png`);
    const exists = await fs.pathExists(filePath);
    if (!exists) return res.status(404).json({ error: "Image not found." });

    // Parse recipients
    const recipients = (Array.isArray(to) ? to : String(to).split(/[,;\s]+/))
      .map(s => s.trim())
      .filter(Boolean);
    if (!recipients.length) return res.status(400).json({ error: "No valid recipients found." });

    const imageUrl = `${PUBLIC_BASE_URL}/images/${id}.png`;
    const subj = subject || "AI Meeting Image";
    const html = message || `
      <p>Hello,</p>
      <p>A meeting image has been shared with you.</p>
      <p><a href="${imageUrl}" target="_blank" rel="noopener">Open image</a></p>
      <p>— Sent from AI Meeting Image App</p>
    `;

    const transport = buildTransport();
    if (!transport) {
      return res.status(400).json({ error: "SMTP is not configured. Please set SMTP_* env vars." });
    }

    const from = process.env.SMTP_FROM || process.env.SMTP_USER;
    await transport.sendMail({
      from,
      to: recipients,
      subject: subj,
      html,
      attachments: [
        {
          filename: `meeting-image-${id}.png`,
          path: filePath,
          contentType: "image/png"
        }
      ]
    });

    res.json({ ok: true, imageUrl, recipients });
  } catch (err) {
    console.error("Share error:", err);
    res.status(500).json({ error: "Failed to send email.", details: err?.message || String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
})
