import { makeStyles } from "@fluentui/react-components";
import { useState } from "react";
import type { ReactElement } from "react";
import { ActivityBar } from "./ActivityBar";
import type { ActivityKey } from "./ActivityBar";
import { MainPane } from "./MainPane";
import { PlaceholderPane } from "./PlaceholderPane";
import { TerminalManagementView } from "../terminals/TerminalManagementView";
import { TransactionBrowserView } from "../browser/TransactionBrowserView";

const useStyles = makeStyles({
  root: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
  },
});

export function AppShell(): ReactElement {
  const styles = useStyles();
  const [activity, setActivity] = useState<ActivityKey>("terminals");

  return (
    <div className={styles.root}>
      <ActivityBar active={activity} onChange={setActivity} />
      {activity === "terminals" ? (
        <TerminalManagementView />
      ) : activity === "browser" ? (
        <TransactionBrowserView />
      ) : (
        <MainPane>
          <PlaceholderPane label={activity} />
        </MainPane>
      )}
    </div>
  );
}
