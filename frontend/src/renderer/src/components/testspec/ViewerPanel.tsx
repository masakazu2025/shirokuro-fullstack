import { makeStyles, tokens, Text, Button } from "@fluentui/react-components";
import { DismissRegular } from "@fluentui/react-icons";
import type { ReactElement } from "react";
import type { SavedFile } from "../../mock/testspec";
import { TextViewer } from "../viewer/TextViewer";
import { CsvViewer } from "../viewer/CsvViewer";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "420px",
    flexShrink: 0,
    borderLeft: `1px solid ${tokens.colorNeutralStroke2}`,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 8px 8px 14px",
    backgroundColor: tokens.colorNeutralBackground2,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  title: {
    flexGrow: 1,
    overflow: "hidden",
  },
  name: {
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  content: {
    flexGrow: 1,
    overflow: "hidden",
  },
});

type Props = {
  file: SavedFile;
  onClose: () => void;
};

export function ViewerPanel({ file, onClose }: Props): ReactElement {
  const styles = useStyles();
  const isCsv = file.name.endsWith(".csv");

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.title}>
          <Text size={200} weight="semibold" className={styles.name}>{file.name}</Text>
          <Text size={100} style={{ color: tokens.colorNeutralForeground4 }}>
            {file.source} · {file.savedAt}
          </Text>
        </div>
        <Button appearance="subtle" size="small" icon={<DismissRegular />} onClick={onClose} />
      </div>
      <div className={styles.content}>
        {isCsv ? <CsvViewer content={file.content} /> : <TextViewer content={file.content} />}
      </div>
    </div>
  );
}
