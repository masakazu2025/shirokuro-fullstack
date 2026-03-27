import { makeStyles, tokens, Text } from "@fluentui/react-components";
import type { ReactElement } from "react";

const useStyles = makeStyles({
  root: {
    height: "100%",
    overflow: "auto",
    padding: "16px",
  },
  table: {
    borderCollapse: "collapse",
    width: "100%",
    fontSize: "13px",
  },
  th: {
    backgroundColor: tokens.colorNeutralBackground3,
    borderBottom: `2px solid ${tokens.colorNeutralStroke1}`,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: "6px 12px",
    textAlign: "left",
    whiteSpace: "nowrap",
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  td: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: "5px 12px",
    color: tokens.colorNeutralForeground1,
    whiteSpace: "nowrap",
  },
  trEven: {
    backgroundColor: tokens.colorNeutralBackground1,
  },
  trOdd: {
    backgroundColor: tokens.colorNeutralBackground2,
  },
});

type Props = {
  content: string;
};

function parseCsv(raw: string): string[][] {
  return raw
    .trim()
    .split("\n")
    .map((line) => line.split(","));
}

export function CsvViewer({ content }: Props): ReactElement {
  const styles = useStyles();
  const rows = parseCsv(content);
  const [header, ...body] = rows;

  if (!header) return <></>;

  return (
    <div className={styles.root}>
      <table className={styles.table}>
        <thead>
          <tr>
            {header.map((cell, i) => (
              <th key={i} className={styles.th}>
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? styles.trEven : styles.trOdd}>
              {row.map((cell, ci) => (
                <td key={ci} className={styles.td}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
