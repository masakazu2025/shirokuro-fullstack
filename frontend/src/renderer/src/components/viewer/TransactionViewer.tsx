import { makeStyles, tokens, Text, TabList, Tab } from "@fluentui/react-components";
import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import type { TransactionFile, FileSection } from "../../mock/terminals";
import { TextViewer } from "./TextViewer";
import { CsvViewer } from "./CsvViewer";
import { JsonViewer } from "./JsonViewer";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    padding: "8px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  tabs: {
    flexShrink: 0,
    paddingLeft: "8px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  content: {
    flexGrow: 1,
    overflow: "hidden",
  },
  empty: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: tokens.colorNeutralForeground4,
  },
});

function SectionContent({ section }: { section: FileSection }): ReactElement {
  if (section.type === "text") {
    return <TextViewer value={section.value as string} />;
  }
  if (section.type === "csv") {
    return <CsvViewer value={section.value as Record<string, string>[]} />;
  }
  return <JsonViewer value={section.value} />;
}

type Props = {
  file: TransactionFile | null;
  noFiles?: boolean;
};

export function TransactionViewer({ file, noFiles }: Props): ReactElement {
  const styles = useStyles();
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    if (file && file.data.length > 0) {
      setActiveTab(file.data[0].name);
    }
  }, [file]);

  if (!file) {
    const message = noFiles ? "項目が存在しません" : "項目を選択してください";
    return (
      <div className={styles.empty}>
        <Text size={300}>{message}</Text>
      </div>
    );
  }

  const activeSection = file.data.find((s) => s.name === activeTab) ?? file.data[0];
  const hasMultipleSections = file.data.length > 1;

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Text size={300} weight="semibold">{file.display_name}</Text>
      </div>
      {hasMultipleSections && (
        <div className={styles.tabs}>
          <TabList
            selectedValue={activeTab}
            onTabSelect={(_, d) => setActiveTab(d.value as string)}
            size="small"
          >
            {file.data.map((section) => (
              <Tab key={section.name} value={section.name}>
                {section.label}
              </Tab>
            ))}
          </TabList>
        </div>
      )}
      <div className={styles.content}>
        {activeSection && <SectionContent section={activeSection} />}
      </div>
    </div>
  );
}
