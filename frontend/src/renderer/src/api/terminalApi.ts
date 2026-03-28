const BASE = "http://localhost:4696/api";

export type MonitoringStatus = "on" | "off";
export type OnlineStatus = "online" | "offline";

export type Terminal = {
  id: string;
  name: string;
  ip: string;
  monitoring: MonitoringStatus;
  online: OnlineStatus;
  date: string | null;
};

export const terminalApi = {
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

  patch(id: string, patch: Partial<Pick<Terminal, "name" | "monitoring" | "date">>): Promise<Terminal> {
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
};
