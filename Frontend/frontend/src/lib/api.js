export const API_BASE = import.meta.env.VITE_API_BASE;
export async function fetchLinks() {
    const res = await fetch(`${API_BASE}/api/links`);
    if (!res.ok) throw new Error("Failed to fetch links");
    return res.json();
}

export async function createLink(payload) {
    const res = await fetch(`${API_BASE}/api/links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(body.error || "Failed to create link");
    }
    return body;
}

export async function deleteLink(code) {
    const res = await fetch(`${API_BASE}/api/links/${code}`, {
        method: "DELETE"
    });
    if (res.status === 204) return;
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to delete");
}

export async function fetchLink(code) {
    const res = await fetch(`${API_BASE}/api/links/${code}`);
    if (!res.ok) return null;
    return res.json();
}
