// src/controllers/linksController.js
import { pool } from "../db.js";
import { isValidUrl, isValidCode } from "../utils/validate.js";

/**
 * POST /api/links
 * Body: { targetUrl, code? }
 */
export async function createLink(req, res, next) {
    const { targetUrl, code } = req.body || {};

    if (!targetUrl || typeof targetUrl !== "string") {
        return res.status(400).json({ error: "targetUrl is required" });
    }
    if (!isValidUrl(targetUrl)) {
        return res.status(400).json({ error: "targetUrl must be a valid http(s) URL" });
    }
    if (code !== undefined && !isValidCode(code)) {
        return res.status(400).json({ error: "code must match [A-Za-z0-9]{6,8}" });
    }

    const generatedCode = code || generateRandomCode(6);
    try {
        const text = `INSERT INTO links (code, target_url) VALUES ($1, $2) RETURNING code, target_url AS "targetUrl", clicks, last_clicked_at AS "lastClickedAt", created_at AS "createdAt"`;
        const values = [generatedCode, targetUrl];
        const result = await pool.query(text, values);
        const row = result.rows[0];
        // normalize dates to ISO strings (optional)
        if (row.lastClickedAt) row.lastClickedAt = row.lastClickedAt.toISOString();
        if (row.createdAt) row.createdAt = row.createdAt.toISOString();
        return res.status(201).json(row);
    } catch (err) {
        // unique violation
        if (err.code === "23505") {
            return res.status(409).json({ error: "Code exists" });
        }
        return next(err);
    }
}

/**
 * GET /api/links
 */
export async function listLinks(req, res, next) {
    try {
        const q = `SELECT code, target_url AS "targetUrl", clicks, last_clicked_at AS "lastClickedAt", created_at AS "createdAt" FROM links ORDER BY created_at DESC`;
        const result = await pool.query(q);
        const rows = result.rows.map((r) => {
            if (r.lastClickedAt) r.lastClickedAt = r.lastClickedAt.toISOString();
            if (r.createdAt) r.createdAt = r.createdAt.toISOString();
            return r;
        });
        return res.status(200).json(rows);
    } catch (err) {
        return next(err);
    }
}

/**
 * GET /api/links/:code
 */
export async function getLink(req, res, next) {
    const { code } = req.params;
    try {
        const q = `SELECT code, target_url AS "targetUrl", clicks, last_clicked_at AS "lastClickedAt", created_at AS "createdAt" FROM links WHERE code = $1`;
        const result = await pool.query(q, [code]);
        if (result.rowCount === 0) return res.status(404).json({ error: "Not found" });
        const r = result.rows[0];
        if (r.lastClickedAt) r.lastClickedAt = r.lastClickedAt.toISOString();
        if (r.createdAt) r.createdAt = r.createdAt.toISOString();
        return res.status(200).json(r);
    } catch (err) {
        return next(err);
    }
}

/**
 * DELETE /api/links/:code
 */
export async function deleteLink(req, res, next) {
    const { code } = req.params;
    try {
        const q = `DELETE FROM links WHERE code = $1 RETURNING id`;
        const result = await pool.query(q, [code]);
        if (result.rowCount === 0) return res.status(404).json({ error: "Not found" });
        return res.status(204).send();
    } catch (err) {
        return next(err);
    }
}

/**
 * Helper: simple random code generator [A-Za-z0-9], length n (6-8 recommended)
 */
function generateRandomCode(n = 6) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let s = "";
    for (let i = 0; i < n; i++) {
        s += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return s;
}
