import React, { useState } from "react";
import { createLink } from "../lib/api";

const CODE_RE = /^[A-Za-z0-9]{6,8}$/;

export default function AddLinkForm({ onSuccess }) {
    const [open, setOpen] = useState(false);
    const [targetUrl, setTargetUrl] = useState("");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    function validate() {
        if (!targetUrl) return "Target URL is required";
        try {
            const u = new URL(targetUrl);
            if (u.protocol !== "http:" && u.protocol !== "https:") return "URL must be http(s)";
        } catch {
            return "Invalid URL";
        }
        if (code && !CODE_RE.test(code)) return "Code must be 6-8 alphanumeric";
        return null;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        const v = validate();
        if (v) return setError(v);

        setLoading(true);
        try {
            await createLink({ targetUrl, code: code || undefined });
            setTargetUrl("");
            setCode("");
            setOpen(false);
            onSuccess?.();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <button onClick={() => setOpen(true)} className="px-3 py-1 bg-blue-600 text-white rounded">Add</button>

            {open && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-40">
                    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow w-full max-w-md">
                        <h3 className="font-semibold mb-2">Add Link</h3>

                        <div className="mb-2">
                            <label className="block text-sm">Target URL</label>
                            <input
                                value={targetUrl}
                                onChange={(e) => setTargetUrl(e.target.value)}
                                className="w-full p-2 border rounded"
                                placeholder="https://example.com/page"
                                required
                            />
                        </div>

                        <div className="mb-2">
                            <label className="block text-sm">Custom Code (optional)</label>
                            <input
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full p-2 border rounded"
                                placeholder="6-8 alphanumeric"
                            />
                        </div>

                        {error && <div className="text-red-600 mb-2">{error}</div>}

                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setOpen(false)} className="px-3 py-1 border rounded">Cancel</button>
                            <button type="submit" disabled={loading} className="px-3 py-1 bg-green-600 text-white rounded">
                                {loading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
