// src/middlewares/errorHandler.js
export default function errorHandler(err, req, res, next) {
    console.error(err);
    // hide internal errors in production
    if (process.env.NODE_ENV === "production") {
        return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(500).json({ error: err.message || "Internal server error" });
}
