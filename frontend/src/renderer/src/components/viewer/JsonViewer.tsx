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
    margin: 0,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
});

// シンプルなシンタックスハイライト
function highlight(json: string): string {
  return json
    .replace(/("(\\u[\dA-Fa-f]{4}|\\[^u]|[^\\"])*"(\s*:)?)/g, (match) => {
      if (/:$/.test(match)) {
        return `<span style="color:#0070c1">${match}</span>`; // key
      }
      return `<span style="color:#a31515">${match}</span>`; // string value
    })
    .replace(/\b(true|false)\b/g, `<span style="color:#0000ff">$1</span>`)
    .replace(/\bnull\b/g, `<span style="color:#808080">null</span>`)
    .replace(/\b(\d+\.?\d*)\b/g, `<span style="color:#098658">$1</span>`);
}

type Props = {
  value: unknown;
};

export function JsonViewer({ value }: Props): ReactElement {
  const styles = useStyles();
  const formatted = JSON.stringify(value, null, 2);

  return (
    <div className={styles.root}>
      <pre
        className={styles.pre}
        dangerouslySetInnerHTML={{ __html: highlight(formatted) }}
      />
    </div>
  );
}
