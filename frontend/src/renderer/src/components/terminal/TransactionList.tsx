import { makeStyles, tokens, Text, Badge } from "@fluentui/react-components";
import type { ReactElement } from "react";
import type { Transaction } from "../../mock/terminals";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "140px",
    minWidth: "140px",
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
    overflowX: "hidden",
  },
  item: {
    display: "flex",
    flexDirection: "column",
    padding: "6px 10px",
    cursor: "pointer",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    gap: "2px",
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
  itemLatest: {
    borderLeft: `3px solid ${tokens.colorBrandForeground1}`,
  },
  no: {
    fontFamily: "'Cascadia Code', 'Consolas', monospace",
    fontWeight: 600,
  },
  time: {
    color: tokens.colorNeutralForeground4,
  },
});

type Props = {
  transactions: Transaction[];
  selectedId: string | null;
  onSelect: (tx: Transaction) => void;
};

export function TransactionList({ transactions, selectedId, onSelect }: Props): ReactElement {
  const styles = useStyles();
  const latestId = transactions[transactions.length - 1]?.id;

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Text size={100} weight="semibold" style={{ textTransform: "uppercase", letterSpacing: "0.05em", color: tokens.colorNeutralForeground3 }}>
          取引一覧
        </Text>
      </div>
      <div className={styles.list}>
        {[...transactions].reverse().map((tx) => (
          <div
            key={tx.id}
            className={[
              styles.item,
              selectedId === tx.id ? styles.itemSelected : "",
              tx.id === latestId ? styles.itemLatest : "",
            ].join(" ")}
            onClick={() => onSelect(tx)}
          >
            <Text size={200} weight="semibold" className={styles.no}>
              {tx.no}
            </Text>
            <Text size={100} className={styles.time}>
              {tx.time}
            </Text>
            {tx.id === latestId && (
              <Badge size="small" color="brand" appearance="tint">最新</Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
