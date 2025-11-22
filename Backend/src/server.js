// src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import linksRouter from "./routes/links.js";
import redirectRouter from "./routes/redirect.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
app.use(cors());
app.use(express.json());

// Healthcheck
app.get("/healthz", (req, res) => {
    return res.status(200).json({ ok: true, version: "1.0" });
});

// API prefix
app.use("/api/links", linksRouter);

// Redirect route - IMPORTANT: mount at root so GET /:code works
app.use("/", redirectRouter);

// default 404 for unknown api routes (optional)
app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
        return res.status(404).json({ error: "Not found" });
    }
    next();
});

// error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
