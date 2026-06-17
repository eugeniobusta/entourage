"use client";

import { useState } from "react";

type Entry = {
  id: string;
  email: string;
  created_at: string;
  source: string;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const fetchData = async (pwd: string) => {
    setLoading(true);
    setErr("");
    const res = await fetch(
      `/api/admin/waitlist?password=${encodeURIComponent(pwd)}`
    );
    if (res.ok) {
      const data = await res.json();
      setEntries(data.entries ?? []);
      setAuthed(true);
    } else {
      setErr("Wrong password.");
    }
    setLoading(false);
  };

  const exportCSV = () => {
    const rows = [
      ["#", "Email", "Date Joined", "Source"],
      ...entries.map((e, i) => [
        String(i + 1),
        e.email,
        new Date(e.created_at).toLocaleString(),
        e.source ?? "website",
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `entourage-waitlist-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const refresh = () => fetchData(password);

  if (!authed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center w-full max-w-xs">
          <div
            className="text-4xl font-black text-white mb-1 tracking-tight"
            style={{ fontFamily: "var(--font-display-google), sans-serif" }}
          >
            ENTOURAGE
          </div>
          <div className="text-[9px] tracking-[0.45em] text-white/25 uppercase mb-10">
            Admin Dashboard
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchData(password);
            }}
            className="flex flex-col gap-3"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="bg-transparent border border-white/15 px-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:border-white/40 transition-colors"
            />
            {err && <p className="text-xs text-red-400/70">{err}</p>}
            <button
              type="submit"
              disabled={loading}
              className="border border-white/20 py-3 text-[10px] tracking-[0.35em] uppercase text-white/50 hover:text-white hover:bg-white/[0.04] transition-all duration-300 disabled:opacity-40"
            >
              {loading ? "Checking…" : "Enter"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const latest =
    entries.length > 0
      ? new Date(entries[0].created_at).toLocaleDateString()
      : "—";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/[0.07] px-8 py-5 flex items-center justify-between">
        <div>
          <div
            className="text-2xl font-black tracking-tight"
            style={{ fontFamily: "var(--font-display-google), sans-serif" }}
          >
            ENTOURAGE
          </div>
          <div className="text-[9px] tracking-[0.4em] uppercase text-white/25 mt-0.5">
            Waitlist Admin
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            className="text-[9px] tracking-[0.35em] uppercase text-white/40 hover:text-white transition-colors border border-white/10 px-4 py-2 hover:border-white/30"
          >
            Refresh
          </button>
          <button
            onClick={exportCSV}
            className="text-[9px] tracking-[0.35em] uppercase text-white/40 hover:text-white transition-colors border border-white/10 px-4 py-2 hover:border-white/30"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="px-8 py-10 max-w-5xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="border border-white/[0.08] p-6">
            <div className="text-4xl font-black mb-2">{entries.length}</div>
            <div className="text-[9px] tracking-[0.38em] uppercase text-white/28">
              Total Signups
            </div>
          </div>
          <div className="border border-white/[0.08] p-6">
            <div className="text-4xl font-black mb-2">
              {Math.max(0, 100 - entries.length)}
            </div>
            <div className="text-[9px] tracking-[0.38em] uppercase text-white/28">
              Spots Remaining
            </div>
          </div>
          <div className="border border-white/[0.08] p-6">
            <div className="text-xl font-black mb-2 leading-tight">{latest}</div>
            <div className="text-[9px] tracking-[0.38em] uppercase text-white/28">
              Latest Signup
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="border border-white/[0.08]">
          <div className="grid grid-cols-[3rem_1fr_200px_100px] gap-4 px-6 py-3 border-b border-white/[0.07] text-[9px] tracking-[0.35em] uppercase text-white/28">
            <span>#</span>
            <span>Email</span>
            <span>Date Joined</span>
            <span>Source</span>
          </div>

          {entries.length === 0 ? (
            <div className="px-6 py-16 text-center text-white/25 text-sm tracking-wide">
              No signups yet.
            </div>
          ) : (
            entries.map((entry, i) => (
              <div
                key={entry.id}
                className="grid grid-cols-[3rem_1fr_200px_100px] gap-4 px-6 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.015] transition-colors duration-200"
              >
                <span className="text-white/25 text-xs font-mono">
                  {String(i + 1).padStart(3, "0")}
                </span>
                <span className="text-white text-sm">{entry.email}</span>
                <span className="text-white/35 text-xs">
                  {new Date(entry.created_at).toLocaleString()}
                </span>
                <span className="text-white/25 text-xs">{entry.source}</span>
              </div>
            ))
          )}
        </div>

        <p className="mt-6 text-[9px] tracking-[0.25em] uppercase text-white/18">
          Showing all {entries.length} signup{entries.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
