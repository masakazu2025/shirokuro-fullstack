import { makeStyles, tokens, Text, Button } from "@fluentui/react-components";
import { AddRegular, DeleteRegular, FilterDismissRegular } from "@fluentui/react-icons";
import { useState, useMemo, useEffect } from "react";
import type { ReactElement } from "react";
import { TerminalRow } from "./TerminalRow";
import { AddTerminalDialog } from "./AddTerminalDialog";
import { DeleteTerminalDialog } from "./DeleteTerminalDialog";
import { ColumnFilterPopover } from "./ColumnFilterPopover";
import type { SortDir } from "./ColumnFilterPopover";
import { terminalApi } from "../../api/terminalApi";
import type { Terminal, MonitoringStatus } from "../../api/terminalApi";

type SortKey = "name" | "ip" | "online" | "monitoring";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "10px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    flexShrink: 0,
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "4px 12px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    flexShrink: 0,
  },
  tableHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "4px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground3,
    flexShrink: 0,
  },
  list: {
    flexGrow: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
  empty: {
    padding: "24px 16px",
    color: tokens.colorNeutralForeground4,
  },
});

export function TerminalManagementView(): ReactElement {
  const styles = useStyles();
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [nameFilter, setNameFilter] = useState<Set<string> | null>(null);
  const [ipFilter, setIpFilter] = useState<Set<string> | null>(null);
  const [onlineFilter, setOnlineFilter] = useState<Set<string> | null>(null);
  const [monitoringFilter, setMonitoringFilter] = useState<Set<string> | null>(null);

  useEffect(() => {
    terminalApi.list().then(setTerminals);
  }, []);

  // マウント時: online のみ更新（date はバック起動時プローブで確定済み）
  useEffect(() => {
    terminalApi.getStatus().then((statuses) => {
      setTerminals((prev) =>
        prev.map((t) => {
          const s = statuses.find((s) => s.id === t.id);
          return s ? { ...t, online: s.online } : t;
        })
      );
    });
  }, []);

  // 30秒ポーリング: online のみ更新
  useEffect(() => {
    const id = setInterval(() => {
      terminalApi.getStatus().then((statuses) => {
        setTerminals((prev) =>
          prev.map((t) => {
            const s = statuses.find((s) => s.id === t.id);
            return s ? { ...t, online: s.online } : t;
          })
        );
      });
    }, 30_000);
    return () => clearInterval(id);
  }, []);

  const handleSort = (key: SortKey, dir: SortDir): void => {
    if (sortKey === key && sortDir === dir) {
      setSortKey(null);
    } else {
      setSortKey(key);
      setSortDir(dir);
    }
  };

  const filteredTerminals = useMemo(() => {
    let result = terminals;
    if (nameFilter !== null) result = result.filter((t) => nameFilter.has(t.name));
    if (ipFilter !== null) result = result.filter((t) => ipFilter.has(t.ip));
    if (onlineFilter !== null) result = result.filter((t) => onlineFilter.has(t.online));
    if (monitoringFilter !== null) result = result.filter((t) => monitoringFilter.has(t.monitoring));
    if (!sortKey) return result;
    return [...result].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "ip") {
        const toNum = (ip: string) => ip.split(".").map((n) => parseInt(n, 10));
        const an = toNum(a.ip);
        const bn = toNum(b.ip);
        for (let i = 0; i < 4; i++) {
          if (an[i] !== bn[i]) { cmp = an[i] - bn[i]; break; }
        }
      } else if (sortKey === "name") {
        cmp = a.name.localeCompare(b.name, "ja", { numeric: true });
      } else {
        const av = a[sortKey];
        const bv = b[sortKey];
        cmp = av < bv ? -1 : av > bv ? 1 : 0;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [terminals, nameFilter, ipFilter, onlineFilter, monitoringFilter, sortKey, sortDir]);

  const handleToggle = (id: string, next: MonitoringStatus): void => {
    const current = terminals.find((t) => t.id === id);
    const patch = next === "on" && current?.terminal_date
      ? { monitoring: next, monitoring_date: current.terminal_date }
      : { monitoring: next };
    terminalApi.patch(id, patch).then((updated) =>
      setTerminals((prev) => prev.map((t) => (t.id === id ? { ...updated, online: t.online } : t)))
    );
  };

  const handleAdd = (entries: Array<{ name: string; ip: string }>): void => {
    terminalApi.add(entries).then((created) => {
      setTerminals((prev) => [...prev, ...created]);
      setAddDialogOpen(false);
      terminalApi.getStatus().then((statuses) => {
        setTerminals((prev) =>
          prev.map((t) => {
            const s = statuses.find((s) => s.id === t.id);
            return s ? { ...t, online: s.online } : t;
          })
        );
      });
    });
  };

  const handleDeleteOne = (id: string): void => {
    terminalApi.deleteOne(id).then(() =>
      setTerminals((prev) => prev.filter((t) => t.id !== id))
    );
  };

  const handleRename = (id: string, name: string): void => {
    terminalApi.patch(id, { name }).then((updated) =>
      setTerminals((prev) => prev.map((t) => (t.id === id ? { ...updated, online: t.online } : t)))
    );
  };

  const handleDateChange = (id: string, terminal_date: string): void => {
    terminalApi.patch(id, { terminal_date }).then((updated) =>
      setTerminals((prev) => prev.map((t) => (t.id === id ? updated : t)))
    );
  };

  const handleDelete = (ids: string[]): void => {
    terminalApi.deleteMany(ids).then(() => {
      setTerminals((prev) => prev.filter((t) => !ids.includes(t.id)));
    });
  };

  const onlineCount = terminals.filter((t) => t.online === "online").length;
  const monitoringCount = terminals.filter((t) => t.monitoring === "on").length;

  const applyFilters = (exclude: "name" | "ip" | "online" | "monitoring"): Terminal[] => {
    let result = terminals;
    if (exclude !== "name" && nameFilter !== null) result = result.filter((t) => nameFilter.has(t.name));
    if (exclude !== "ip" && ipFilter !== null) result = result.filter((t) => ipFilter.has(t.ip));
    if (exclude !== "online" && onlineFilter !== null) result = result.filter((t) => onlineFilter.has(t.online));
    if (exclude !== "monitoring" && monitoringFilter !== null) result = result.filter((t) => monitoringFilter.has(t.monitoring));
    return result;
  };

  const nameOptions = useMemo(
    () => [...new Set(applyFilters("name").map((t) => t.name))]
      .sort((a, b) => a.localeCompare(b, "ja", { numeric: true }))
      .map((n) => ({ value: n, label: n })),
    [terminals, ipFilter, onlineFilter, monitoringFilter]
  );
  const ipOptions = useMemo(
    () => [...new Set(applyFilters("ip").map((t) => t.ip))]
      .sort((a, b) => {
        const toNum = (ip: string) => ip.split(".").map((n) => parseInt(n, 10));
        const an = toNum(a); const bn = toNum(b);
        for (let i = 0; i < 4; i++) if (an[i] !== bn[i]) return an[i] - bn[i];
        return 0;
      })
      .map((ip) => ({ value: ip, label: ip })),
    [terminals, nameFilter, onlineFilter, monitoringFilter]
  );
  const onlineOptions = useMemo(
    () => {
      const vals = new Set(applyFilters("online").map((t) => t.online));
      return [
        { value: "online", label: "オンライン" },
        { value: "offline", label: "オフライン" },
      ].filter((o) => vals.has(o.value as "online" | "offline"));
    },
    [terminals, nameFilter, ipFilter, monitoringFilter]
  );
  const monitoringOptions = useMemo(
    () => {
      const vals = new Set(applyFilters("monitoring").map((t) => t.monitoring));
      return [
        { value: "on", label: "監視中" },
        { value: "off", label: "停止中" },
      ].filter((o) => vals.has(o.value as "on" | "off"));
    },
    [terminals, nameFilter, ipFilter, onlineFilter]
  );

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Text size={400} weight="semibold">端末管理</Text>
        <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
          オンライン {onlineCount} / {terminals.length}台　監視中 {monitoringCount}台
        </Text>
      </div>

      <div className={styles.toolbar}>
        <Button
          appearance="primary"
          size="medium"
          icon={<AddRegular />}
          onClick={() => setAddDialogOpen(true)}
          style={{ fontWeight: "normal" }}
        >
          端末を追加
        </Button>
        <Button
          appearance="outline"
          size="medium"
          icon={<DeleteRegular />}
          onClick={() => setDeleteDialogOpen(true)}
          style={{ fontWeight: "normal" }}
          disabled={terminals.length === 0}
        >
          一括削除
        </Button>
        <Button
          appearance="subtle"
          size="medium"
          icon={<FilterDismissRegular />}
          onClick={() => { setNameFilter(null); setIpFilter(null); setOnlineFilter(null); setMonitoringFilter(null); }}
          style={{ fontWeight: "normal" }}
          disabled={nameFilter === null && ipFilter === null && onlineFilter === null && monitoringFilter === null}
        >
          フィルタ解除
        </Button>
      </div>

      <AddTerminalDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={handleAdd}
        existingIps={terminals.map((t) => t.ip)}
      />
      <DeleteTerminalDialog
        open={deleteDialogOpen}
        terminals={terminals}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={handleDelete}
      />

      <div className={styles.tableHeader}>
        <div style={{ width: "10px", flexShrink: 0 }} />
        <div style={{ width: "140px", flexShrink: 0 }}>
          <ColumnFilterPopover
            label="端末名"
            options={nameOptions}
            filter={nameFilter}
            onFilterChange={setNameFilter}
            sortActive={sortKey === "name"}
            sortDir={sortDir}
            onSort={(dir) => handleSort("name", dir)}
          />
        </div>
        <div style={{ width: "130px", flexShrink: 0 }}>
          <ColumnFilterPopover
            label="IPアドレス"
            options={ipOptions}
            filter={ipFilter}
            onFilterChange={setIpFilter}
            sortActive={sortKey === "ip"}
            sortDir={sortDir}
            onSort={(dir) => handleSort("ip", dir)}
          />
        </div>
        <div style={{ width: "80px", flexShrink: 0 }}>
          <ColumnFilterPopover
            label="状態"
            options={onlineOptions}
            filter={onlineFilter}
            onFilterChange={setOnlineFilter}
            sortActive={sortKey === "online"}
            sortDir={sortDir}
            onSort={(dir) => handleSort("online", dir)}
          />
        </div>
        <Text size={200} weight="semibold" style={{ width: "140px", flexShrink: 0, color: tokens.colorNeutralForeground3 }}>
          端末日付
        </Text>
        <div style={{ width: "120px", flexShrink: 0 }}>
          <ColumnFilterPopover
            label="自動監視"
            options={monitoringOptions}
            filter={monitoringFilter}
            onFilterChange={setMonitoringFilter}
            sortActive={sortKey === "monitoring"}
            sortDir={sortDir}
            onSort={(dir) => handleSort("monitoring", dir)}
          />
        </div>
        <Text size={200} weight="semibold" style={{ color: tokens.colorNeutralForeground3 }}>操作</Text>
      </div>

      <div className={styles.list}>
        {terminals.length === 0 ? (
          <div className={styles.empty}>
            <Text size={300} style={{ color: "inherit" }}>端末を追加してください</Text>
          </div>
        ) : (
          filteredTerminals.map((t) => (
            <TerminalRow
              key={t.id}
              terminal={t}
              onToggleMonitoring={handleToggle}
              onRename={handleRename}
              onDateChange={handleDateChange}
              onDelete={handleDeleteOne}
            />
          ))
        )}
      </div>
    </div>
  );
}
