import { makeStyles, tokens, Text } from "@fluentui/react-components";
import { PanelLeftContractRegular, PinRegular, PinOffRegular } from "@fluentui/react-icons";
import type { ReactElement } from "react";
import type { Sheet } from "../../mock/testspec";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "180px",
    minWidth: "180px",
    flexShrink: 0,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "6px 6px 6px 10px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  collapseBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: tokens.colorNeutralForeground3,
    padding: "2px 4px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground2Hover,
      color: tokens.colorNeutralForeground1,
    },
  },
  list: {
    flexGrow: 1,
    overflowY: "auto",
  },
  item: {
    padding: "8px 10px",
    cursor: "pointer",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground2Hover,
    },
  },
  itemSelected: {
    backgroundColor: tokens.colorBrandBackground2,
    borderLeft: `3px solid ${tokens.colorBrandForeground1}`,
    paddingLeft: "7px",
    "&:hover": {
      backgroundColor: tokens.colorBrandBackground2Hover,
    },
  },
  empty: {
    padding: "12px 10px",
    color: tokens.colorNeutralForeground4,
  },
});

type Props = {
  sheets: Sheet[];
  selectedId: string | null;
  onSelect: (s: Sheet) => void;
  onCollapse: () => void;
  autoCollapse: boolean;
  onToggleAutoCollapse: () => void;
};

export function SheetList({ sheets, selectedId, onSelect, onCollapse, autoCollapse, onToggleAutoCollapse }: Props): ReactElement {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Text size={100} weight="semibold" style={{ textTransform: "uppercase", letterSpacing: "0.05em", color: tokens.colorNeutralForeground3 }}>
          シート名
        </Text>
        <div style={{ display: "flex", gap: "2px" }}>
          <button className={styles.collapseBtn} onClick={onToggleAutoCollapse} title={autoCollapse ? "自動折りたたみ ON（クリックでOFF）" : "自動折りたたみ OFF（クリックでON）"}>
            {autoCollapse ? <PinOffRegular fontSize={18} /> : <PinRegular fontSize={18} />}
          </button>
          <button className={styles.collapseBtn} onClick={onCollapse} title="折りたたむ">
            <PanelLeftContractRegular fontSize={18} />
          </button>
        </div>
      </div>
      <div className={styles.list}>
        {sheets.length === 0 && (
          <div className={styles.empty}><Text size={200}>機能を選択してください</Text></div>
        )}
        {sheets.map((s) => (
          <div
            key={s.id}
            className={`${styles.item} ${selectedId === s.id ? styles.itemSelected : ""}`}
            onClick={() => onSelect(s)}
          >
            <Text size={200}>{s.name}</Text>
          </div>
        ))}
      </div>
    </div>
  );
}
