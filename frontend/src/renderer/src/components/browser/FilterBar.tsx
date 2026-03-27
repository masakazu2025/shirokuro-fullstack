import { makeStyles, tokens, Select, Text } from "@fluentui/react-components";
import type { ReactElement } from "react";
import type { Terminal } from "../../mock/terminals";

const useStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 12px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    flexShrink: 0,
  },
  label: {
    color: tokens.colorNeutralForeground3,
  },
});

type Props = {
  terminals: Terminal[];
  selectedTerminalId: string;
  onTerminalChange: (id: string) => void;
  dates: string[];
  selectedDate: string;
  onDateChange: (date: string) => void;
};

export function FilterBar({
  terminals,
  selectedTerminalId,
  onTerminalChange,
  dates,
  selectedDate,
  onDateChange,
}: Props): ReactElement {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Text size={200} weight="semibold" className={styles.label}>端末</Text>
      <Select
        size="small"
        value={selectedTerminalId}
        onChange={(_, d) => onTerminalChange(d.value)}
        style={{ minWidth: "160px" }}
      >
        {terminals.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name} ({t.ip})
          </option>
        ))}
      </Select>

      <Text size={200} weight="semibold" className={styles.label}>日付</Text>
      <Select
        size="small"
        value={selectedDate}
        onChange={(_, d) => onDateChange(d.value)}
        style={{ minWidth: "120px" }}
        disabled={dates.length === 0}
      >
        {dates.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </Select>
    </div>
  );
}
