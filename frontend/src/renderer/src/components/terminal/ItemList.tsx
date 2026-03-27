import { makeStyles, tokens, Text } from "@fluentui/react-components";
import {
  DocumentRegular,
  TableSimpleRegular,
  BracesRegular,
  ImageRegular,
} from "@fluentui/react-icons";
import type { ReactElement } from "react";
import type { TransactionItem, ItemType } from "../../mock/terminals";

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

const TYPE_ICONS: Record<ItemType, ReactElement> = {
  text: <DocumentRegular />,
  csv: <TableSimpleRegular />,
  json: <BracesRegular />,
  image: <ImageRegular />,
};

type Props = {
  items: TransactionItem[];
  selectedId: string | null;
  onSelect: (item: TransactionItem) => void;
};

export function ItemList({ items, selectedId, onSelect }: Props): ReactElement {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Text size={100} weight="semibold" style={{ textTransform: "uppercase", letterSpacing: "0.05em", color: tokens.colorNeutralForeground3 }}>
          項目
        </Text>
      </div>
      <div className={styles.list}>
        {items.length === 0 && (
          <div className={styles.empty}>
            <Text size={200}>取引を選択してください</Text>
          </div>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className={`${styles.item} ${selectedId === item.id ? styles.itemSelected : ""}`}
            onClick={() => onSelect(item)}
          >
            <span className={styles.icon}>{TYPE_ICONS[item.type]}</span>
            <Text size={200} className={styles.name} title={item.name}>
              {item.name}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}
