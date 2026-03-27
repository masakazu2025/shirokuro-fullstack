import { makeStyles, tokens, Text } from "@fluentui/react-components";
import type { ReactElement } from "react";
import type { ImageFile } from "../../mock/terminals";

const useStyles = makeStyles({
  root: {
    overflowY: "auto",
    flexGrow: 1,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "6px 12px",
    borderBottom: `2px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    position: "sticky",
    top: 0,
    color: tokens.colorNeutralForeground3,
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    whiteSpace: "nowrap",
  },
  tr: {
    cursor: "pointer",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground2Hover,
    },
  },
  trSelected: {
    backgroundColor: tokens.colorBrandBackground2,
    "&:hover": {
      backgroundColor: tokens.colorBrandBackground2Hover,
    },
  },
  td: {
    padding: "7px 12px",
    verticalAlign: "middle",
  },
  thumb: {
    width: "32px",
    height: "24px",
    borderRadius: "3px",
    flexShrink: 0,
    display: "inline-block",
  },
});

type Props = {
  images: ImageFile[];
  onSelect: (img: ImageFile) => void;
  selectedId?: string;
};

export function ImageTable({ images, onSelect, selectedId }: Props): ReactElement {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}></th>
            <th className={styles.th}>ファイル名</th>
            <th className={styles.th}>取引No</th>
            <th className={styles.th}>時刻</th>
            <th className={styles.th}>サイズ</th>
          </tr>
        </thead>
        <tbody>
          {images.map((img) => (
            <tr
              key={img.id}
              className={img.id === selectedId ? `${styles.tr} ${styles.trSelected}` : styles.tr}
              onClick={() => onSelect(img)}
            >
              <td className={styles.td}>
                <span className={styles.thumb} style={{ backgroundColor: img.placeholderColor }} />
              </td>
              <td className={styles.td}>
                <Text size={200}>{img.name}</Text>
              </td>
              <td className={styles.td}>
                <Text size={200}>{img.transactionNo}</Text>
              </td>
              <td className={styles.td}>
                <Text size={200}>{img.time}</Text>
              </td>
              <td className={styles.td}>
                <Text size={200}>{img.size}</Text>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
