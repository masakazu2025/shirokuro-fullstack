import { makeStyles, tokens, Text, Badge } from "@fluentui/react-components";
import type { ReactElement } from "react";
import type { TransactionItem } from "../../mock/terminals";
import { TextViewer } from "./TextViewer";
import { CsvViewer } from "./CsvViewer";
import { JsonViewer } from "./JsonViewer";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  content: {
    flexGrow: 1,
    overflow: "hidden",
  },
  empty: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: tokens.colorNeutralForeground4,
  },
});

const TYPE_LABELS = { text: "テキスト", csv: "CSV", json: "JSON", image: "画像" };
const TYPE_COLORS = {
  text: "informative",
  csv: "success",
  json: "brand",
  image: "warning",
} as const;

type Props = {
  item: TransactionItem | null;
};

export function TransactionViewer({ item }: Props): ReactElement {
  const styles = useStyles();

  if (!item) {
    return (
      <div className={styles.empty}>
        <Text size={300}>項目を選択してください</Text>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Badge color={TYPE_COLORS[item.type]} appearance="filled" size="small">
          {TYPE_LABELS[item.type]}
        </Badge>
        <Text size={300} weight="semibold">{item.name}</Text>
      </div>
      <div className={styles.content}>
        {item.type === "text" && <TextViewer content={item.content} />}
        {item.type === "csv" && <CsvViewer content={item.content} />}
        {item.type === "json" && <JsonViewer content={item.content} />}
      </div>
    </div>
  );
}
