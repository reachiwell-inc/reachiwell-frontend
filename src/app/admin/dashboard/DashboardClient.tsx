  "use client";

  import { useMemo, useState } from "react";

  type ChatStatus = "Completed" | "In progress" | "Escalated";

  type ConversationRow = {
    name: string;
    date: string;
    time: string;
    location: string;
    ctas: string;
    status: ChatStatus;
    rating: number;
  };

  function StatusPill({ status }: { status: ChatStatus }) {
    const styles =
      status === "Completed"
        ? "bg-[#E7F5EF] text-[#2F7A56]"
        : status === "In progress"
          ? "bg-[#F8EFE3] text-[#B36B22]"
          : "bg-[#F9E7E7] text-[#C54747]";

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-[10px] text-xs font-medium ${styles}`}>
        {status}
      </span>
    );
  }

  function StarIcon() {
    return (
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10 1.667l2.575 5.217 5.758.837-4.166 4.061.983 5.737L10 14.95l-5.15 2.57.983-5.737-4.166-4.061 5.758-.837L10 1.667z"
          fill="#F59E0B"
        />
      </svg>
    );
  }

  function ChevronDown() {
    return (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M5 7.5L10 12.5L15 7.5"
          stroke="#6B7280"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  function SearchIcon() {
    return (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M9.167 15.833a6.667 6.667 0 1 1 0-13.333 6.667 6.667 0 0 1 0 13.333Z"
          stroke="#9CA3AF"
          strokeWidth="1.8"
        />
        <path d="M17.5 17.5l-3.625-3.625" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  export default function DashboardClient() {
    const [filterOpen, setFilterOpen] = useState(false);
    const [filter, setFilter] = useState<"All Chats" | ChatStatus>("All Chats");
    const [query, setQuery] = useState("");

    const rows: ConversationRow[] = [
      { name: "RW-10481", date: "Mar 12, 2026", time: "10:14 AM", location: "Vancouver, BC", ctas: "CTAS 1", status: "Completed", rating: 5 },
      { name: "RW-10482", date: "Mar 12, 2026", time: "10:14 AM", location: "Surrey, BC", ctas: "CTAS 2", status: "In progress", rating: 5 },
      { name: "RW-10483", date: "Mar 12, 2026", time: "10:14 AM", location: "Kelowna, BC", ctas: "CTAS 3", status: "Escalated", rating: 5 },
      { name: "RW-10484", date: "Mar 12, 2026", time: "10:14 AM", location: "Prince George, BC", ctas: "CTAS 4", status: "Completed", rating: 5 },
      { name: "RW-10485", date: "Mar 12, 2026", time: "10:14 AM", location: "Vancouver, BC", ctas: "CTAS 5", status: "Completed", rating: 5 },
      { name: "RW-10486", date: "Mar 12, 2026", time: "10:14 AM", location: "Vancouver, BC", ctas: "CTAS 1", status: "In progress", rating: 5 },
      { name: "RW-10487", date: "Mar 12, 2026", time: "10:14 AM", location: "Vancouver, BC", ctas: "CTAS 2", status: "Completed", rating: 5 },
      { name: "RW-10488", date: "Mar 12, 2026", time: "10:14 AM", location: "Vancouver, BC", ctas: "CTAS 3", status: "Completed", rating: 5 },
      { name: "RW-10489", date: "Mar 12, 2026", time: "10:14 AM", location: "Vancouver, BC", ctas: "CTAS 4", status: "Completed", rating: 5 },
    ];

    const filteredRows = useMemo(() => {
      const q = query.trim().toLowerCase();
      return rows.filter((r) => {
        const matchesFilter = filter === "All Chats" ? true : r.status === filter;
        const matchesQuery = !q
          ? true
          : [r.name, r.location, r.ctas || "", r.status].some((x) => x.toLowerCase().includes(q));
        return matchesFilter && matchesQuery;
      });
    }, [filter, query]);

    return (
      <div className="w-full">
        <div className="mx-auto w-full max-w-[1120px]">
          <div className="flex items-start justify-between">
            <h1 className="text-[#161818] text-2xl font-semibold leading-[1.275] mt-1">Conversation History</h1>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setFilterOpen((v) => !v)}
                  className="h-[44px] px-4 rounded-xl border border-[#E5E7EB] bg-white text-[#161818] text-sm font-medium inline-flex items-center gap-2 shadow-[0_1px_0_rgba(17,24,39,0.02)]"
                >
                  <span className="min-w-[76px] text-left">{filter === "All Chats" ? "All Chats" : filter}</span>
                  <ChevronDown />
                </button>

                {filterOpen && (
                  <div className="absolute right-0 mt-2 w-[160px] rounded-xl border border-[#E5E7EB] bg-white shadow-[0_12px_30px_rgba(17,24,39,0.10)] overflow-hidden z-20">
                    {(["All Chats", "Completed", "In progress", "Escalated"] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setFilter(opt);
                          setFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm ${
                          opt === filter ? "bg-[#F3F4F6] text-[#161818]" : "text-[#414747] hover:bg-[#F3F4F6]"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <SearchIcon />
                </div>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="h-[44px] w-[360px] rounded-xl border border-[#E5E7EB] bg-white pl-11 pr-4 text-sm text-[#161818] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2D8E86] focus:ring-2 focus:ring-[#2D8E86]/15"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-[#9CA3AF] text-xs font-medium">
                  <th className="px-8 py-5">Name</th>
                  <th className="px-4 py-5">Date</th>
                  <th className="px-4 py-5">Time</th>
                  <th className="px-4 py-5">Location</th>
                  <th className="px-4 py-5">CTAS</th>
                  <th className="px-4 py-5">Status</th>
                  <th className="px-8 py-5">Rating</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((r) => (
                  <tr key={r.name} className="border-t border-[#EEF2F7] text-sm text-[#414747]">
                    <td className="px-8 py-6 text-[#414747]">{r.name}</td>
                    <td className="px-4 py-6">{r.date}</td>
                    <td className="px-4 py-6">{r.time}</td>
                    <td className="px-4 py-6">{r.location}</td>
                    <td className="px-4 py-6 text-[#6B7280]">{r.ctas || ""}</td>
                    <td className="px-4 py-6">
                      <StatusPill status={r.status} />
                    </td>
                    <td className="px-8 py-6">
                      <div className="inline-flex items-center gap-1.5 text-[#414747]">
                        <span className="font-medium">{r.rating}</span>
                        <StarIcon />
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRows.length === 0 && (
                  <tr className="border-t border-[#EEF2F7]">
                    <td colSpan={7} className="px-8 py-10 text-sm text-[#6B7280]">
                      No conversations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="h-8" />
          </div>
        </div>
      </div>
    );
  }

