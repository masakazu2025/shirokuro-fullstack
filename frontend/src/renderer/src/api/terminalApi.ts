const BASE = import.meta.env.VITE_API_BASE_URL as string;
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export type MonitoringStatus = "on" | "off";
export type OnlineStatus = "online" | "offline";

export type Terminal = {
  id: string;
  name: string;
  ip: string;
  monitoring: MonitoringStatus;
  online: OnlineStatus;
  terminal_date: string | null;
  monitoring_date: string | null;
};

export type TerminalStatus = {
  id: string;
  online: OnlineStatus;
};

// ---- real API ----

const realApi = {
  list(): Promise<Terminal[]> {
    return fetch(`${BASE}/terminals`).then((r) => r.json());
  },

  add(entries: Array<{ name: string; ip: string }>): Promise<Terminal[]> {
    return fetch(`${BASE}/terminals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entries),
    }).then((r) => r.json());
  },

  patch(id: string, patch: Partial<Pick<Terminal, "name" | "monitoring" | "monitoring_date">>): Promise<Terminal> {
    return fetch(`${BASE}/terminals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    }).then((r) => r.json());
  },

  deleteOne(id: string): Promise<void> {
    return fetch(`${BASE}/terminals/${id}`, { method: "DELETE" }).then(() => undefined);
  },

  deleteMany(ids: string[]): Promise<void> {
    return fetch(`${BASE}/terminals`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    }).then(() => undefined);
  },

  getStatus(): Promise<TerminalStatus[]> {
    return fetch(`${BASE}/terminals/online`).then((r) => r.json());
  },
};

// ---- mock ----

let _mockStore: Terminal[] = [
  { id: "t1", name: "POS端末-01", ip: "192.168.1.101", monitoring: "on",  online: "online",  terminal_date: "2026-03-28", monitoring_date: "2026-03-28" },
  { id: "t2", name: "POS端末-02", ip: "192.168.1.102", monitoring: "on",  online: "online",  terminal_date: "2026-03-28", monitoring_date: "2026-03-28" },
  { id: "t3", name: "POS端末-03", ip: "192.168.1.103", monitoring: "off", online: "offline", terminal_date: null,         monitoring_date: null },
];

const mockApi = {
  list(): Promise<Terminal[]> {
    return Promise.resolve([..._mockStore]);
  },

  add(entries: Array<{ name: string; ip: string }>): Promise<Terminal[]> {
    const created: Terminal[] = entries.map((e, i) => ({
      id: `mock-${Date.now()}-${i}`,
      name: e.name || e.ip,
      ip: e.ip,
      monitoring: "off",
      online: "offline",
      terminal_date: null,
      monitoring_date: null,
    }));
    _mockStore = [..._mockStore, ...created];
    return Promise.resolve(created);
  },

  patch(id: string, patch: Partial<Pick<Terminal, "name" | "monitoring" | "monitoring_date">>): Promise<Terminal> {
    _mockStore = _mockStore.map((t) => (t.id === id ? { ...t, ...patch } : t));
    return Promise.resolve(_mockStore.find((t) => t.id === id)!);
  },

  deleteOne(id: string): Promise<void> {
    _mockStore = _mockStore.filter((t) => t.id !== id);
    return Promise.resolve();
  },

  deleteMany(ids: string[]): Promise<void> {
    _mockStore = _mockStore.filter((t) => !ids.includes(t.id));
    return Promise.resolve();
  },

  getStatus(): Promise<TerminalStatus[]> {
    return Promise.resolve(
      _mockStore.map((t) => ({ id: t.id, online: t.online }))
    );
  },
};

// ---- export ----

export const terminalApi = USE_MOCK ? mockApi : realApi;
