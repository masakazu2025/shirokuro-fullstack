import { makeStyles, tokens, Text, TabList, Tab } from "@fluentui/react-components";
import { DocumentRegular, ImageRegular, SlideTextRegular } from "@fluentui/react-icons";
import { useState } from "react";
import type { ReactElement } from "react";
import type { SavedFile, SavedFileCategory } from "../../mock/testspec";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    maxHeight: "200px",
    overflowY: "auto",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: "4px",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 10px",
    cursor: "pointer",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    "&:last-child": {
      borderBottom: "none",
    },
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground2Hover,
    },
  },
  icon: {
    color: tokens.colorNeutralForeground3,
    flexShrink: 0,
  },
  info: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    overflow: "hidden",
  },
  name: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  source: {
    color: tokens.colorNeutralForeground4,
  },
  empty: {
    padding: "12px",
    textAlign: "center",
    color: tokens.colorNeutralForeground4,
  },
});

const TABS: { key: SavedFileCategory; label: string; icon: ReactElement }[] = [
  { key: "transaction", label: "取引", icon: <DocumentRegular /> },
  { key: "image",       label: "画像", icon: <ImageRegular /> },
  { key: "log",         label: "ログ", icon: <SlideTextRegular /> },
];

type Props = {
  files: SavedFile[];
  onSelect: (file: SavedFile) => void;
};

export function SavedFileList({ files, onSelect }: Props): ReactElement {
  const styles = useStyles();
  const [activeTab, setActiveTab] = useState<SavedFileCategory>("transaction");

  const filtered = files.filter((f) => f.category === activeTab);

  return (
    <div className={styles.root}>
      <TabList
        size="small"
        selectedValue={activeTab}
        onTabSelect={(_, d) => setActiveTab(d.value as SavedFileCategory)}
      >
        {TABS.map((t) => {
          const count = files.filter((f) => f.category === t.key).length;
          return (
            <Tab key={t.key} value={t.key} icon={t.icon}>
              {t.label}{count > 0 ? ` (${count})` : ""}
            </Tab>
          );
        })}
      </TabList>

      <div className={styles.list}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <Text size={200}>保存されていません</Text>
          </div>
        ) : (
          filtered.map((file) => (
            <div key={file.id} className={styles.item} onClick={() => onSelect(file)}>
              <span className={styles.icon}>
                {TABS.find((t) => t.key === file.category)?.icon}
              </span>
              <div className={styles.info}>
                <Text size={200} className={styles.name}>{file.name}</Text>
                <Text size={100} className={styles.source}>{file.source} · {file.savedAt}</Text>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
