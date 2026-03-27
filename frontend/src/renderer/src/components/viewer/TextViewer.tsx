import { makeStyles, tokens } from "@fluentui/react-components";
import type { ReactElement } from "react";

const useStyles = makeStyles({
  root: {
    height: "100%",
    overflow: "auto",
    padding: "16px",
  },
  pre: {
    fontFamily: "'Cascadia Code', 'Consolas', monospace",
    fontSize: "13px",
    lineHeight: "1.6",
    color: tokens.colorNeutralForeground1,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    margin: 0,
  },
});

type Props = {
  content: string;
};

export function TextViewer({ content }: Props): ReactElement {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <pre className={styles.pre}>{content}</pre>
    </div>
  );
}
