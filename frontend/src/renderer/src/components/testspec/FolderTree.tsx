import { makeStyles, tokens, Text } from "@fluentui/react-components";
import { FolderRegular, FolderOpenRegular, ChevronRightRegular, ChevronDownRegular, PanelLeftContractRegular, PinRegular, PinOffRegular } from "@fluentui/react-icons";
import { useState } from "react";
import type { ReactElement } from "react";
import type { TestFolder } from "../../mock/testspec";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "220px",
    minWidth: "220px",
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
    padding: "4px 0",
  },
  empty: {
    padding: "12px 10px",
    color: tokens.colorNeutralForeground4,
  },
});

const useNodeStyles = makeStyles({
  node: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 8px",
    cursor: "pointer",
    borderRadius: "4px",
    margin: "1px 4px",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground2Hover,
    },
  },
  nodeSelected: {
    backgroundColor: tokens.colorBrandBackground2,
    "&:hover": {
      backgroundColor: tokens.colorBrandBackground2Hover,
    },
  },
  chevron: {
    width: "12px",
    flexShrink: 0,
    color: tokens.colorNeutralForeground3,
  },
  icon: {
    color: tokens.colorBrandForeground1,
    flexShrink: 0,
  },
  children: {
    paddingLeft: "16px",
  },
});

type NodeProps = {
  folder: TestFolder;
  selectedId: string | null;
  depth: number;
  onSelect: (f: TestFolder) => void;
};

function FolderNode({ folder, selectedId, depth, onSelect }: NodeProps): ReactElement {
  const styles = useNodeStyles();
  const [open, setOpen] = useState(depth === 0);
  const hasChildren = folder.children.length > 0;
  const isSelected = selectedId === folder.id;

  return (
    <div>
      <div
        className={`${styles.node} ${isSelected ? styles.nodeSelected : ""}`}
        onClick={() => {
          if (hasChildren) setOpen((o) => !o);
          onSelect(folder);
        }}
      >
        <span className={styles.chevron}>
          {hasChildren ? (open ? <ChevronDownRegular fontSize={12} /> : <ChevronRightRegular fontSize={12} />) : null}
        </span>
        <span className={styles.icon}>
          {isSelected || open ? <FolderOpenRegular fontSize={16} /> : <FolderRegular fontSize={16} />}
        </span>
        <Text size={200}>{folder.name}</Text>
      </div>
      {open && hasChildren && (
        <div className={styles.children}>
          {folder.children.map((child) => (
            <FolderNode key={child.id} folder={child} selectedId={selectedId} depth={depth + 1} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

type Props = {
  folders: TestFolder[];
  selectedId: string | null;
  onSelect: (f: TestFolder) => void;
  onCollapse: () => void;
  autoCollapse: boolean;
  onToggleAutoCollapse: () => void;
};

export function FolderTree({ folders, selectedId, onSelect, onCollapse, autoCollapse, onToggleAutoCollapse }: Props): ReactElement {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Text size={100} weight="semibold" style={{ textTransform: "uppercase", letterSpacing: "0.05em", color: tokens.colorNeutralForeground3 }}>
          フォルダ
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
        {folders.length === 0 && (
          <div className={styles.empty}><Text size={200}>シートを選択してください</Text></div>
        )}
        {folders.map((f) => (
          <FolderNode key={f.id} folder={f} selectedId={selectedId} depth={0} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}
