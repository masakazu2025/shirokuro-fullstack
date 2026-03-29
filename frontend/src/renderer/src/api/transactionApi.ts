const BASE = import.meta.env.VITE_API_BASE_URL as string;
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export type Transaction = {
  id: string;
  date: string;
  timestamp: string;
  attributes: Record<string, unknown>;
};

export type TransactionFileEntry = {
  filename: string;
  display_name: string;
  order: number;
};

export type FileSection = {
  name: string;
  label: string;
  type: "text" | "csv" | "json";
  value: string | Record<string, string>[] | unknown;
};

export type TransactionFileContent = {
  filename: string;
  display_name: string;
  data: FileSection[];
};

// ---- real API ----

const realApi = {
  listAll(terminalId: string): Promise<Transaction[]> {
    return fetch(`${BASE}/terminals/${terminalId}/transactions`).then((r) => r.json());
  },

  listByDate(terminalId: string, date: string): Promise<Transaction[]> {
    return fetch(`${BASE}/terminals/${terminalId}/transactions/${date}`).then((r) => r.json());
  },

  listFiles(terminalId: string, date: string, txId: string): Promise<TransactionFileEntry[]> {
    return fetch(`${BASE}/terminals/${terminalId}/transactions/${date}/${txId}/files`).then((r) => r.json());
  },

  getFile(terminalId: string, date: string, txId: string, filename: string): Promise<TransactionFileContent> {
    return fetch(`${BASE}/terminals/${terminalId}/transactions/${date}/${txId}/files/${filename}`).then((r) => r.json());
  },
};

// ---- mock ----

import { mockTerminals } from "../mock/terminals";
import type { TransactionFile } from "../mock/terminals";

const mockApi = {
  listAll(terminalId: string): Promise<Transaction[]> {
    const terminal = mockTerminals.find((t) => t.id === terminalId);
    if (!terminal) return Promise.resolve([]);
    return Promise.resolve(
      terminal.dateFolders.flatMap((d) =>
        d.transactions.map((tx) => ({
          id: tx.id,
          date: tx.date,
          timestamp: tx.timestamp,
          attributes: {},
        }))
      )
    );
  },

  listByDate(terminalId: string, date: string): Promise<Transaction[]> {
    const terminal = mockTerminals.find((t) => t.id === terminalId);
    if (!terminal) return Promise.resolve([]);
    const folder = terminal.dateFolders.find((d) => d.date === date);
    if (!folder) return Promise.resolve([]);
    return Promise.resolve(
      folder.transactions.map((tx) => ({
        id: tx.id,
        date: tx.date,
        timestamp: tx.timestamp,
        attributes: {},
      }))
    );
  },

  listFiles(terminalId: string, date: string, txId: string): Promise<TransactionFileEntry[]> {
    const terminal = mockTerminals.find((t) => t.id === terminalId);
    if (!terminal) return Promise.resolve([]);
    const folder = terminal.dateFolders.find((d) => d.date === date);
    if (!folder) return Promise.resolve([]);
    const tx = folder.transactions.find((t) => t.id === txId);
    if (!tx) return Promise.resolve([]);
    return Promise.resolve(
      tx.files.map((f: TransactionFile) => ({
        filename: f.filename,
        display_name: f.display_name,
        order: f.order,
      }))
    );
  },

  getFile(terminalId: string, date: string, txId: string, filename: string): Promise<TransactionFileContent> {
    const terminal = mockTerminals.find((t) => t.id === terminalId);
    if (!terminal) return Promise.reject(new Error("not found"));
    const folder = terminal.dateFolders.find((d) => d.date === date);
    if (!folder) return Promise.reject(new Error("not found"));
    const tx = folder.transactions.find((t) => t.id === txId);
    if (!tx) return Promise.reject(new Error("not found"));
    const file = tx.files.find((f: TransactionFile) => f.filename === filename);
    if (!file) return Promise.reject(new Error("not found"));
    return Promise.resolve({
      filename: file.filename,
      display_name: file.display_name,
      data: file.data as FileSection[],
    });
  },
};

// ---- export ----

export const transactionApi = USE_MOCK ? mockApi : realApi;
