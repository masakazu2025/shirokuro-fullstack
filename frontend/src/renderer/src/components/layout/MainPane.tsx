import { makeStyles, tokens } from "@fluentui/react-components";
import type { ReactElement, ReactNode } from "react";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: tokens.colorNeutralBackground1,
    overflow: "hidden",
  },
});

type Props = {
  children: ReactNode;
};

export function MainPane({ children }: Props): ReactElement {
  const styles = useStyles();
  return <div className={styles.root}>{children}</div>;
}
