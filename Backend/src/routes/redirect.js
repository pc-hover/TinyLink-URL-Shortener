// src/routes/redirect.js
import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/**
 * GET /:code
 * Atomically increment clicks and set last_clicked_at, return 302 Location
 */
router.get("/:code", async (req, res, next) => {
    const { code } = req.params;
    try {
        // Update and return target_url atomically
        const q = `
      UPDATE links
      SET clicks = clicks + 1,
          last_clicked_at = now()
      WHERE code = $1
      RETURNING target_url
    `;
        const result = await pool.query(q, [code]);
        if (result.rowCount === 0) {
            return res.status(404).send("Not found");
        }
        const target = result.rows[0].target_url;
        // 302 redirect
        return res.redirect(302, target);
    } catch (err) {
        return next(err);
    }
});

export default router;
