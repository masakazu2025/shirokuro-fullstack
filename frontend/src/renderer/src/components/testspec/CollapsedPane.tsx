import { makeStyles, tokens, Text } from "@fluentui/react-components";
import type { ReactElement } from "react";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "44px",
    minWidth: "44px",
    flexShrink: 0,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    cursor: "pointer",
    paddingTop: "10px",
    gap: "6px",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground2Hover,
    },
  },
  label: {
    writingMode: "vertical-rl",
    textOrientation: "mixed",
    color: tokens.colorNeutralForeground3,
    letterSpacing: "0.05em",
    userSelect: "none",
  },
  value: {
    writingMode: "vertical-rl",
    textOrientation: "mixed",
    color: tokens.colorBrandForeground1,
    fontWeight: 600,
    userSelect: "none",
    overflow: "hidden",
    maxHeight: "160px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
});

type Props = {
  label: string;
  selectedValue: string;
  onExpand: () => void;
};

export function CollapsedPane({ label, selectedValue, onExpand }: Props): ReactElement {
  const styles = useStyles();
  return (
    <div className={styles.root} onClick={onExpand} title={`${label}: ${selectedValue}（クリックで展開）`}>
      <Text size={100} className={styles.label}>{label}</Text>
      <Text size={200} className={styles.value}>{selectedValue}</Text>
    </div>
  );
}
