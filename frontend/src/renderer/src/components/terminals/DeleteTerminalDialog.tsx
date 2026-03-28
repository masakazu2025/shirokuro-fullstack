import {
  Dialog, DialogSurface, DialogTitle, DialogBody,
  DialogActions, DialogContent, Button, Checkbox, Text,
} from "@fluentui/react-components";
import { makeStyles, tokens } from "@fluentui/react-components";
import { useState } from "react";
import type { ReactElement } from "react";
import type { Terminal } from "../../api/terminalApi";

const useStyles = makeStyles({
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    maxHeight: "280px",
    overflowY: "auto",
    marginTop: "8px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 12px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    cursor: "pointer",
    "&:last-child": { borderBottom: "none" },
    "&:hover": { backgroundColor: tokens.colorNeutralBackground2Hover },
  },
  ip: {
    color: tokens.colorNeutralForeground3,
    fontFamily: "'Cascadia Code', 'Consolas', monospace",
  },
  selectAll: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "4px",
    cursor: "pointer",
    "&:hover": { backgroundColor: tokens.colorNeutralBackground2Hover },
    borderRadius: tokens.borderRadiusMedium,
    padding: "4px 4px",
  },
});

type Props = {
  open: boolean;
  terminals: Terminal[];
  onClose: () => void;
  onDelete: (ids: string[]) => void;
};

export function DeleteTerminalDialog({ open, terminals, onClose, onDelete }: Props): ReactElement {
  const styles = useStyles();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const allChecked = terminals.length > 0 && terminals.every((t) => selectedIds.has(t.id));
  const someChecked = terminals.some((t) => selectedIds.has(t.id));

  const handleCheckAll = (checked: boolean): void => {
    setSelectedIds(checked ? new Set(terminals.map((t) => t.id)) : new Set());
  };

  const handleCheck = (id: string, checked: boolean): void => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const handleDelete = (): void => {
    onDelete([...selectedIds]);
    setSelectedIds(new Set());
  };

  const handleClose = (): void => {
    setSelectedIds(new Set());
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(_, d) => { if (!d.open) handleClose(); }}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>端末を削除</DialogTitle>
          <DialogContent>
            <div className={styles.selectAll} onClick={() => handleCheckAll(!allChecked)}>
              <Checkbox
                checked={allChecked ? true : someChecked ? "mixed" : false}
                onChange={(_, d) => handleCheckAll(!!d.checked)}
              />
              <Text size={200}>すべて選択</Text>
            </div>
            <div className={styles.list}>
              {terminals.map((t) => (
                <div key={t.id} className={styles.item} onClick={() => handleCheck(t.id, !selectedIds.has(t.id))}>
                  <Checkbox
                    checked={selectedIds.has(t.id)}
                    onChange={(_, d) => handleCheck(t.id, !!d.checked)}
                  />
                  <Text size={300} weight="semibold" style={{ minWidth: "130px" }}>{t.name}</Text>
                  <Text size={200} className={styles.ip}>{t.ip}</Text>
                </div>
              ))}
            </div>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={handleClose}>キャンセル</Button>
            <Button
              appearance="primary"
              onClick={handleDelete}
              disabled={!someChecked}
            >
              削除 {someChecked ? `(${selectedIds.size})` : ""}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
