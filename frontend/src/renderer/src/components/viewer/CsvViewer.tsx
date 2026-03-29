import { makeStyles, tokens } from "@fluentui/react-components";
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
  value: Record<string, string>[];
};

export function CsvViewer({ value }: Props): ReactElement {
  const styles = useStyles();

  if (value.length === 0) return <></>;

  const headers = Object.keys(value[0]);

  return (
    <div className={styles.root}>
      <table className={styles.table}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} className={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {value.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? styles.trEven : styles.trOdd}>
              {headers.map((h) => (
                <td key={h} className={styles.td}>{row[h]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
