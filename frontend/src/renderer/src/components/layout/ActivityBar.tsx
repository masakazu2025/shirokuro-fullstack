import { makeStyles, tokens, Tooltip } from "@fluentui/react-components";
import {
  DesktopRegular,
  SettingsRegular,
} from "@fluentui/react-icons";
import type { ReactElement } from "react";

export type ActivityKey =
  | "terminals"
  | "settings";

type ActivityItem = {
  key: ActivityKey;
  icon: ReactElement;
  label: string;
};

const ACTIVITIES: ActivityItem[] = [
  { key: "terminals", icon: <DesktopRegular />, label: "端末管理" },
  { key: "settings",  icon: <SettingsRegular />, label: "設定" },
];

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "60px",
    backgroundColor: tokens.colorNeutralBackground3,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    alignItems: "center",
    paddingTop: "8px",
    paddingBottom: "8px",
    gap: "2px",
    flexShrink: 0,
  },
  item: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "44px",
    height: "44px",
    borderRadius: tokens.borderRadiusMedium,
    cursor: "pointer",
    color: tokens.colorNeutralForeground3,
    fontSize: "24px",
    border: "none",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground3Hover,
      color: tokens.colorNeutralForeground1,
    },
  },
  itemActive: {
    color: tokens.colorBrandForeground1,
    backgroundColor: tokens.colorBrandBackground2,
    "&:hover": {
      backgroundColor: tokens.colorBrandBackground2Hover,
    },
  },
  spacer: {
    flexGrow: 1,
  },
});

type Props = {
  active: ActivityKey;
  onChange: (key: ActivityKey) => void;
};

export function ActivityBar({ active, onChange }: Props): ReactElement {
  const styles = useStyles();

  const mainItems = ACTIVITIES.filter((a) => a.key !== "settings");
  const bottomItems = ACTIVITIES.filter((a) => a.key === "settings");

  return (
    <div className={styles.root}>
      {mainItems.map((item) => (
        <Tooltip key={item.key} content={item.label} relationship="label" positioning="after">
          <button
            className={`${styles.item} ${active === item.key ? styles.itemActive : ""}`}
            onClick={() => onChange(item.key)}
          >
            {item.icon}
          </button>
        </Tooltip>
      ))}
      <div className={styles.spacer} />
      {bottomItems.map((item) => (
        <Tooltip key={item.key} content={item.label} relationship="label" positioning="after">
          <button
            className={`${styles.item} ${active === item.key ? styles.itemActive : ""}`}
            onClick={() => onChange(item.key)}
          >
            {item.icon}
          </button>
        </Tooltip>
      ))}
    </div>
  );
}
