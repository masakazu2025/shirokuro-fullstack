import {
  Dialog, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions,
  Button, Badge, Text,
} from "@fluentui/react-components";
import { DismissRegular } from "@fluentui/react-icons";
import { makeStyles, tokens } from "@fluentui/react-components";
import type { ReactElement } from "react";
import type { SavedFile } from "../../mock/testspec";
import { TextViewer } from "../viewer/TextViewer";
import { CsvViewer } from "../viewer/CsvViewer";

const useStyles = makeStyles({
  surface: {
    width: "80vw",
    maxWidth: "900px",
    height: "70vh",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    paddingBottom: "8px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  source: {
    color: tokens.colorNeutralForeground3,
  },
  content: {
    flexGrow: 1,
    overflow: "hidden",
    marginTop: "8px",
  },
});

const CATEGORY_LABELS = { transaction: "取引", image: "画像", log: "ログ" };
const CATEGORY_COLORS = { transaction: "brand", image: "warning", log: "informative" } as const;

function detectType(file: SavedFile): "text" | "csv" {
  if (file.name.endsWith(".csv")) return "csv";
  return "text";
}

type Props = {
  file: SavedFile | null;
  onClose: () => void;
};

export function FileViewerModal({ file, onClose }: Props): ReactElement {
  const styles = useStyles();

  return (
    <Dialog open={file !== null} onOpenChange={(_, d) => { if (!d.open) onClose(); }}>
      <DialogSurface className={styles.surface}>
        <DialogBody className={styles.body}>
          <DialogTitle
            action={
              <Button appearance="subtle" icon={<DismissRegular />} onClick={onClose} />
            }
          >
            {file && (
              <div className={styles.meta}>
                <Badge color={CATEGORY_COLORS[file.category]} appearance="filled" size="small">
                  {CATEGORY_LABELS[file.category]}
                </Badge>
                <Text weight="semibold">{file.name}</Text>
                <Text size={200} className={styles.source}>{file.source} · {file.savedAt}</Text>
              </div>
            )}
          </DialogTitle>
          <DialogContent>
            {file && (
              <div className={styles.content}>
                {detectType(file) === "csv"
                  ? <CsvViewer content={file.content} />
                  : <TextViewer content={file.content} />
                }
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>閉じる</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
