import { makeStyles, tokens, Text } from "@fluentui/react-components";
import type { ReactElement, ReactNode } from "react";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "260px",
    minWidth: "180px",
    maxWidth: "400px",
    backgroundColor: tokens.colorNeutralBackground2,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    overflow: "hidden",
    flexShrink: 0,
  },
  header: {
    padding: "8px 12px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  content: {
    flexGrow: 1,
    overflowY: "auto",
    overflowX: "hidden",
  },
});

type Props = {
  title: string;
  children: ReactNode;
};

export function SidePane({ title, children }: Props): ReactElement {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Text size={200} weight="semibold" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {title}
        </Text>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
