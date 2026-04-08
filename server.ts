import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.post("/api/waitlist", async (req, res) => {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    try {
      const scriptUrl = "https://script.google.com/macros/s/AKfycbxfyxaT8NTGrz68HDlZy2inJ_PNl-sND3lTdezEQpThW6CimNT39uzafRqS7cUDxsRj/exec";

      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`Google Script returned status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        res.json({ success: true, message: "Successfully joined the waitlist!" });
      } else {
        res.status(400).json({ error: data.error || "Failed to join waitlist." });
      }
    } catch (error) {
      console.error("Error adding to waitlist:", error);
      res.status(500).json({ error: "Failed to join waitlist. Please try again later." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
