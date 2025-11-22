import React from "react";
import { Outlet, Link } from "react-router-dom";
import { API_BASE } from "./lib/api";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
          <Link to="/" className="font-semibold text-lg">URL Shortener</Link>
          <a
            href={`${API_BASE}/healthz`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-gray-500"
          >
            Health
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <Outlet />
      </main>

      <footer className="max-w-4xl mx-auto p-4 text-sm text-gray-500">
        Built with  Vite  React  Tailwind<br /> Creator : Priyanshu Choudhary
      </footer>
    </div>
  );
}
