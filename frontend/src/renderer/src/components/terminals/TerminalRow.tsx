import { makeStyles, tokens, Text, Switch, Badge, Button, Tooltip, Dialog, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, Field, Input } from "@fluentui/react-components";
import { EditRegular, DeleteRegular } from "@fluentui/react-icons";
import { useState } from "react";
import type { ReactElement } from "react";
import type { Terminal, MonitoringStatus } from "../../mock/terminals";

const useStyles = makeStyles({
  row: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "8px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground2Hover,
    },
  },
  statusDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  online: {
    backgroundColor: tokens.colorPaletteGreenForeground1,
  },
  offline: {
    backgroundColor: tokens.colorNeutralForeground4,
  },
  name: {
    width: "140px",
    flexShrink: 0,
  },
  ip: {
    width: "130px",
    flexShrink: 0,
    color: tokens.colorNeutralForeground3,
    fontFamily: "'Cascadia Code', 'Consolas', monospace",
  },
  colStatus: {
    width: "80px",
    flexShrink: 0,
  },
  toggle: {
    width: "120px",
    flexShrink: 0,
  },
});

type Props = {
  terminal: Terminal;
  onToggleMonitoring: (id: string, next: MonitoringStatus) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
};

export function TerminalRow({ terminal, onToggleMonitoring, onRename, onDelete }: Props): ReactElement {
  const styles = useStyles();
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className={styles.row}>
      <div
        className={`${styles.statusDot} ${
          terminal.online === "online" ? styles.online : styles.offline
        }`}
      />
      <Text size={300} weight="semibold" className={styles.name}>
        {terminal.name}
      </Text>
      <Text size={200} className={styles.ip}>
        {terminal.ip}
      </Text>
      <div className={styles.colStatus}>
        <Badge
          size="small"
          appearance="tint"
          color={terminal.online === "online" ? "success" : "subtle"}
        >
          {terminal.online === "online" ? "オンライン" : "オフライン"}
        </Badge>
      </div>
      <div className={styles.toggle}>
        <Switch
          label={terminal.monitoring === "on" ? "監視中" : "停止中"}
          checked={terminal.monitoring === "on"}
          onChange={(_, d) =>
            onToggleMonitoring(terminal.id, d.checked ? "on" : "off")
          }
        />
      </div>
      <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
        <Tooltip content="名称を変更" relationship="label">
          <Button
            size="small"
            appearance="subtle"
            icon={<EditRegular />}
            onClick={() => { setEditName(terminal.name); setEditOpen(true); }}
          />
        </Tooltip>
        <Tooltip content="削除" relationship="label">
          <Button
            size="small"
            appearance="subtle"
            icon={<DeleteRegular />}
            onClick={() => setDeleteOpen(true)}
          />
        </Tooltip>
      </div>

      <Dialog open={deleteOpen} onOpenChange={(_, d) => { if (!d.open) setDeleteOpen(false); }}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>端末を削除</DialogTitle>
            <DialogContent>
              <Text>「{terminal.name}」を削除しますか？</Text>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setDeleteOpen(false)}>キャンセル</Button>
              <Button appearance="primary" onClick={() => { setDeleteOpen(false); onDelete(terminal.id); }}>削除</Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={(_, d) => { if (!d.open) setEditOpen(false); }}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>端末名を変更</DialogTitle>
            <DialogContent>
              <Field label="端末名" required>
                <Input
                  value={editName}
                  onChange={(_, d) => setEditName(d.value)}
                  placeholder={terminal.ip}
                />
              </Field>
              <Text size={200} style={{ color: tokens.colorNeutralForeground3, marginTop: "8px", display: "block" }}>
                IPアドレス: {terminal.ip}
              </Text>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setEditOpen(false)}>キャンセル</Button>
              <Button
                appearance="primary"
                disabled={editName.trim() === ""}
                onClick={() => { onRename(terminal.id, editName.trim()); setEditOpen(false); }}
              >
                変更
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
}
