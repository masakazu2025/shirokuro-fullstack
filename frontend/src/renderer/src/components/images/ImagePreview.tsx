import { makeStyles, tokens, Text } from "@fluentui/react-components";
import type { ReactElement } from "react";
import type { ImageFile } from "../../mock/terminals";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "480px",
    flexShrink: 0,
    borderLeft: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    overflow: "hidden",
  },
  header: {
    padding: "8px 12px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    flexShrink: 0,
  },
  imageArea: {
    flexGrow: 1,
    overflowY: "auto",
    padding: "16px",
  },
  placeholder: {
    width: "100%",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: "3 / 4",
  },
  meta: {
    flexShrink: 0,
    padding: "12px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  metaRow: {
    display: "flex",
    gap: "8px",
  },
  metaLabel: {
    color: tokens.colorNeutralForeground3,
    minWidth: "60px",
  },
  empty: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    color: tokens.colorNeutralForeground4,
  },
});

type Props = {
  image: ImageFile | null;
};

export function ImagePreview({ image }: Props): ReactElement {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Text size={200} weight="semibold">プレビュー</Text>
      </div>
      {image == null ? (
        <div className={styles.empty}>
          <Text size={200} style={{ color: "inherit" }}>画像を選択してください</Text>
        </div>
      ) : (
        <>
          <div className={styles.imageArea}>
            <div
              className={styles.placeholder}
              style={{ backgroundColor: image.placeholderColor }}
            >
              <Text style={{ color: "#fff", fontSize: "13px", opacity: 0.8 }}>{image.name}</Text>
            </div>
          </div>
          <div className={styles.meta}>
            <div className={styles.metaRow}>
              <Text size={200} className={styles.metaLabel}>ファイル名</Text>
              <Text size={200}>{image.name}</Text>
            </div>
            <div className={styles.metaRow}>
              <Text size={200} className={styles.metaLabel}>取引No</Text>
              <Text size={200}>{image.transactionNo}</Text>
            </div>
            <div className={styles.metaRow}>
              <Text size={200} className={styles.metaLabel}>時刻</Text>
              <Text size={200}>{image.time}</Text>
            </div>
            <div className={styles.metaRow}>
              <Text size={200} className={styles.metaLabel}>サイズ</Text>
              <Text size={200}>{image.size}</Text>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
