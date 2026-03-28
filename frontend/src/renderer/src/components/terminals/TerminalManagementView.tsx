import { makeStyles, tokens, Text, Button } from "@fluentui/react-components";
import { AddRegular, DeleteRegular, ArrowSortUpRegular, ArrowSortDownRegular, ArrowSortRegular } from "@fluentui/react-icons";
import { useState, useMemo, useEffect } from "react";
import type { ReactElement } from "react";
import { TerminalRow } from "./TerminalRow";
import { AddTerminalDialog } from "./AddTerminalDialog";
import { DeleteTerminalDialog } from "./DeleteTerminalDialog";
import { terminalApi } from "../../api/terminalApi";
import type { Terminal, MonitoringStatus } from "../../api/terminalApi";

type SortKey = "name" | "ip" | "online" | "monitoring";
type SortDir = "asc" | "desc";

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
  sortCol: {
    display: "flex",
    alignItems: "center",
    gap: "2px",
    cursor: "pointer",
    userSelect: "none",
    flexShrink: 0,
    "&:hover": { color: tokens.colorNeutralForeground1 },
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

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey | null; sortDir: SortDir }): ReactElement {
  if (col !== sortKey) return <ArrowSortRegular style={{ fontSize: "12px", opacity: 0.4 }} />;
  return sortDir === "asc"
    ? <ArrowSortUpRegular style={{ fontSize: "12px" }} />
    : <ArrowSortDownRegular style={{ fontSize: "12px" }} />;
}

export function TerminalManagementView(): ReactElement {
  const styles = useStyles();
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  useEffect(() => {
    terminalApi.list().then(setTerminals);
  }, []);

  // マウント時: online + monitoring=off の端末の date を更新
  useEffect(() => {
    terminalApi.getStatus().then((statuses) => {
      setTerminals((prev) =>
        prev.map((t) => {
          const s = statuses.find((s) => s.id === t.id);
          if (!s) return t;
          return t.monitoring === "off"
            ? { ...t, online: s.online, date: s.date }
            : { ...t, online: s.online };
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

  const handleSort = (key: SortKey): void => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedTerminals = useMemo(() => {
    if (!sortKey) return terminals;
    return [...terminals].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [terminals, sortKey, sortDir]);

  const handleToggle = (id: string, next: MonitoringStatus): void => {
    terminalApi.patch(id, { monitoring: next }).then((updated) =>
      setTerminals((prev) => prev.map((t) => (t.id === id ? updated : t)))
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
            if (!s) return t;
            return t.monitoring === "off"
              ? { ...t, online: s.online, date: s.date }
              : { ...t, online: s.online };
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
      setTerminals((prev) => prev.map((t) => (t.id === id ? updated : t)))
    );
  };

  const handleDateChange = (id: string, date: string): void => {
    terminalApi.patch(id, { date }).then((updated) =>
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

  const colStyle = (w: string) => ({
    width: w,
    color: tokens.colorNeutralForeground3,
  });

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
          size="small"
          icon={<AddRegular />}
          onClick={() => setAddDialogOpen(true)}
        >
          端末を追加
        </Button>
        <Button
          appearance="outline"
          size="small"
          icon={<DeleteRegular />}
          onClick={() => setDeleteDialogOpen(true)}
        >
          一括削除
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
        <div className={styles.sortCol} style={colStyle("140px")} onClick={() => handleSort("name")}>
          <Text size={200} weight="semibold" style={{ color: "inherit" }}>端末名</Text>
          <SortIcon col="name" sortKey={sortKey} sortDir={sortDir} />
        </div>
        <div className={styles.sortCol} style={colStyle("130px")} onClick={() => handleSort("ip")}>
          <Text size={200} weight="semibold" style={{ color: "inherit" }}>IPアドレス</Text>
          <SortIcon col="ip" sortKey={sortKey} sortDir={sortDir} />
        </div>
        <div className={styles.sortCol} style={colStyle("80px")} onClick={() => handleSort("online")}>
          <Text size={200} weight="semibold" style={{ color: "inherit" }}>状態</Text>
          <SortIcon col="online" sortKey={sortKey} sortDir={sortDir} />
        </div>
        <Text size={200} weight="semibold" style={{ ...colStyle("140px"), flexShrink: 0 }}>端末日付</Text>
        <div className={styles.sortCol} style={colStyle("120px")} onClick={() => handleSort("monitoring")}>
          <Text size={200} weight="semibold" style={{ color: "inherit" }}>自動監視</Text>
          <SortIcon col="monitoring" sortKey={sortKey} sortDir={sortDir} />
        </div>
        <Text size={200} weight="semibold" style={{ color: tokens.colorNeutralForeground3 }}>操作</Text>
      </div>

      <div className={styles.list}>
        {terminals.length === 0 ? (
          <div className={styles.empty}>
            <Text size={300} style={{ color: "inherit" }}>端末を追加してください</Text>
          </div>
        ) : (
          sortedTerminals.map((t) => (
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
