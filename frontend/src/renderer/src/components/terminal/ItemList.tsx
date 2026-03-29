import { makeStyles, tokens, Text } from "@fluentui/react-components";
import {
  DocumentRegular,
  TableSimpleRegular,
  BracesRegular,
} from "@fluentui/react-icons";
import type { ReactElement } from "react";
import type { TransactionFile, SectionType } from "../../mock/terminals";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "180px",
    minWidth: "180px",
    backgroundColor: tokens.colorNeutralBackground2,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    overflow: "hidden",
    flexShrink: 0,
  },
  header: {
    padding: "6px 10px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  list: {
    flexGrow: 1,
    overflowY: "auto",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 10px",
    cursor: "pointer",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground2Hover,
    },
  },
  itemSelected: {
    backgroundColor: tokens.colorBrandBackground2,
    "&:hover": {
      backgroundColor: tokens.colorBrandBackground2Hover,
    },
  },
  icon: {
    fontSize: "16px",
    flexShrink: 0,
    color: tokens.colorNeutralForeground3,
  },
  name: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  empty: {
    padding: "12px 10px",
    color: tokens.colorNeutralForeground4,
  },
});

const TYPE_ICONS: Record<SectionType, ReactElement> = {
  text: <DocumentRegular />,
  csv: <TableSimpleRegular />,
  json: <BracesRegular />,
};

type Props = {
  files: TransactionFile[];
  selectedId: string | null;
  onSelect: (file: TransactionFile) => void;
  transactionSelected: boolean;
};

export function ItemList({ files, selectedId, onSelect, transactionSelected }: Props): ReactElement {
  const styles = useStyles();

  const emptyMessage = transactionSelected ? "項目が存在しません" : "取引を選択してください";

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Text size={100} weight="semibold" style={{ textTransform: "uppercase", letterSpacing: "0.05em", color: tokens.colorNeutralForeground3 }}>
          項目
        </Text>
      </div>
      <div className={styles.list}>
        {files.length === 0 && (
          <div className={styles.empty}>
            <Text size={200}>{emptyMessage}</Text>
          </div>
        )}
        {files.map((file) => {
          const firstType = file.data[0]?.type ?? "text";
          return (
            <div
              key={file.id}
              className={`${styles.item} ${selectedId === file.id ? styles.itemSelected : ""}`}
              onClick={() => onSelect(file)}
            >
              <span className={styles.icon}>{TYPE_ICONS[firstType]}</span>
              <Text size={200} className={styles.name} title={file.display_name}>
                {file.display_name}
              </Text>
            </div>
          );
        })}
      </div>
    </div>
  );
}
