import React, { useEffect, useState } from "react";
import AddLinkForm from "../components/AddLinkForm";
import { fetchLinks, deleteLink } from "../lib/api";
import { Link as RouterLink } from "react-router-dom";

export default function Dashboard() {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState("");

    async function load() {
        setLoading(true);
        try {
            const data = await fetchLinks();
            setLinks(data);
        } catch (err) {
            console.error(err);
            setLinks([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    const filtered = links.filter((l) => l.code.includes(q) || l.targetUrl.includes(q));

    async function handleDelete(code) {
        if (!confirm("Delete this link?")) return;
        try {
            await deleteLink(code);
            load();
        } catch (err) {
            alert("Delete failed: " + err.message);
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <AddLinkForm onSuccess={load} />
            </div>

            <div className="mb-4">
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search code or URL"
                    className="w-full p-2 border rounded"
                />
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="overflow-x-auto bg-white rounded shadow">
                    <table className="min-w-full divide-y">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left">Code</th>
                                <th className="px-4 py-2 text-left">Target URL</th>
                                <th className="px-4 py-2">Clicks</th>
                                <th className="px-4 py-2">Last Clicked</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="5" className="p-4 text-center">No links found</td></tr>
                            ) : filtered.map((link) => (
                                <tr key={link.code} className="border-t">
                                    <td className="px-4 py-2">
                                        <RouterLink to={`/code/${link.code}`} className="text-blue-600">{link.code}</RouterLink>
                                    </td>
                                    <td className="px-4 py-2 max-w-xs truncate">{link.targetUrl}</td>
                                    <td className="px-4 py-2 text-center">{link.clicks}</td>
                                    <td className="px-4 py-2 text-center">
                                        {link.lastClickedAt ? new Date(link.lastClickedAt).toLocaleString() : "-"}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <div className="flex items-center justify-center gap-2">
               <button
                                                onClick={async () => {
                                                    try {
                                                        const shortUrl = `https://tinylink-url-shortener-zz13.onrender.com/${link.code}`;

                                                        await navigator.clipboard.writeText(shortUrl);
                                                        alert("Copied to clipboard:\n" + shortUrl);
                                                    } catch {
                                                        alert("Copy failed");
                                                    }
                                                }}
                                                className="px-2 py-1 border rounded text-sm"
                                            >
                                                Copy
                                            </button>

                                            <button
                                                onClick={() => handleDelete(link.code)}
                                                className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
