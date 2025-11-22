import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchLink } from "../lib/api";

export default function Stats() {
    const { code } = useParams();
    const [link, setLink] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const data = await fetchLink(code);
            setLink(data);
            setLoading(false);
        }
        load();
    }, [code]);

    if (loading) return <div>Loading...</div>;
    if (!link) return <div>Not found</div>;

    return (
        <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Stats for {link.code}</h2>
            <p><strong>Target URL:</strong> <a href={link.targetUrl} target="_blank" rel="noreferrer" className="text-blue-600">{link.targetUrl}</a></p>
            <p><strong>Clicks:</strong> {link.clicks}</p>
            <p><strong>Last clicked:</strong> {link.lastClickedAt ? new Date(link.lastClickedAt).toLocaleString() : '-'}</p>
            <p><strong>Created at:</strong> {link.createdAt ? new Date(link.createdAt).toLocaleString() : '-'}</p>
        </div>
    );
}

