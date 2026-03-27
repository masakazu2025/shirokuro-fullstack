import { makeStyles, tokens, Text } from "@fluentui/react-components";
import type { ReactElement } from "react";
import type { ImageFile } from "../../mock/terminals";

const useStyles = makeStyles({
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    padding: "12px",
    overflowY: "auto",
    alignContent: "flex-start",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    width: "280px",
    cursor: "pointer",
    borderRadius: "6px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    overflow: "hidden",
    "&:hover": {
      borderColor: tokens.colorBrandStroke1,
      boxShadow: tokens.shadow4,
    },
  },
  cardSelected: {
    borderColor: tokens.colorBrandStroke1,
    boxShadow: tokens.shadow4,
  },
  thumb: {
    width: "280px",
    height: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    padding: "6px 8px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  name: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  meta: {
    color: tokens.colorNeutralForeground4,
  },
});

type Props = {
  images: ImageFile[];
  onSelect: (img: ImageFile) => void;
  selectedId?: string;
};

export function ImageGrid({ images, onSelect, selectedId }: Props): ReactElement {
  const styles = useStyles();
  return (
    <div className={styles.grid}>
      {images.map((img) => (
        <div
          key={img.id}
          className={`${styles.card}${img.id === selectedId ? ` ${styles.cardSelected}` : ""}`}
          onClick={() => onSelect(img)}
        >
          <div className={styles.thumb} style={{ backgroundColor: img.placeholderColor }}>
            <Text style={{ color: "#fff", fontSize: "11px", opacity: 0.8 }}>{img.name}</Text>
          </div>
          <div className={styles.info}>
            <Text size={200} className={styles.name} title={img.name}>{img.name}</Text>
            <Text size={100} className={styles.meta}>{img.transactionNo} · {img.time}</Text>
            <Text size={100} className={styles.meta}>{img.size}</Text>
          </div>
        </div>
      ))}
    </div>
  );
}
