import { makeStyles, tokens, Text } from "@fluentui/react-components";
import type { ReactElement } from "react";

const useStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: tokens.colorNeutralForeground4,
  },
});

type Props = {
  label: string;
};

export function PlaceholderPane({ label }: Props): ReactElement {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <Text size={300}>{label}</Text>
    </div>
  );
}
