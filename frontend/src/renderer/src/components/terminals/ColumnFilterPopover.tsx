import {
  Popover, PopoverTrigger, PopoverSurface,
  Button, Checkbox, Input, Text, Divider,
  makeStyles, tokens,
} from "@fluentui/react-components";
import { ChevronDownRegular, ArrowSortUpRegular, ArrowSortDownRegular } from "@fluentui/react-icons";
import { useState } from "react";
import type { ReactElement } from "react";

export type SortDir = "asc" | "desc";
export type Option = { value: string; label: string };

type Props = {
  label: string;
  options: Option[];
  filter: Set<string> | null; // null = フィルタなし（全表示）
  onFilterChange: (next: Set<string> | null) => void;
  sortActive: boolean;
  sortDir: SortDir;
  onSort: (dir: SortDir) => void;
};

const useStyles = makeStyles({
  trigger: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    cursor: "pointer",
    userSelect: "none",
    color: tokens.colorNeutralForeground3,
    "&:hover": { color: tokens.colorNeutralForeground1 },
  },
  chevron: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "18px",
    height: "18px",
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusSmall,
    flexShrink: 0,
    "&:hover": { backgroundColor: tokens.colorNeutralBackground2Hover },
  },
  surface: {
    padding: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    minWidth: "180px",
  },
  sortRow: {
    display: "flex",
    gap: "4px",
  },
  checkList: {
    maxHeight: "180px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
});

export function ColumnFilterPopover({
  label, options, filter, onFilterChange,
  sortActive, sortDir, onSort,
}: Props): ReactElement {
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const visibleOptions = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const isChecked = (value: string): boolean => filter === null || filter.has(value);
  const allChecked = visibleOptions.length > 0 && visibleOptions.every((o) => isChecked(o.value));
  const someChecked = visibleOptions.some((o) => isChecked(o.value));
  const isFiltered = filter !== null;

  const handleToggle = (value: string, checked: boolean): void => {
    if (checked) {
      if (filter === null) return;
      const next = new Set(filter);
      next.add(value);
      onFilterChange(options.every((o) => next.has(o.value)) ? null : next);
    } else {
      if (filter === null) {
        const next = new Set(options.map((o) => o.value));
        next.delete(value);
        onFilterChange(next);
      } else {
        const next = new Set(filter);
        next.delete(value);
        onFilterChange(next);
      }
    }
  };

  const handleSelectAll = (checked: boolean): void => {
    onFilterChange(checked ? null : new Set());
  };

  return (
    <Popover open={open} onOpenChange={(_, d) => setOpen(d.open)} positioning="below-start">
      <PopoverTrigger disableButtonEnhancement>
        <div className={styles.trigger}>
          <Text size={200} weight="semibold" style={{ color: "inherit" }}>{label}</Text>
          <div className={styles.chevron} style={{ borderColor: isFiltered ? tokens.colorBrandStroke1 : undefined, color: isFiltered ? tokens.colorBrandForeground1 : "inherit" }}>
            <ChevronDownRegular style={{ fontSize: "10px" }} />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverSurface className={styles.surface}>
        <div className={styles.sortRow}>
          <Button
            size="small"
            appearance={sortActive && sortDir === "asc" ? "primary" : "outline"}
            icon={<ArrowSortUpRegular />}
            onClick={() => onSort("asc")}
          >昇順</Button>
          <Button
            size="small"
            appearance={sortActive && sortDir === "desc" ? "primary" : "outline"}
            icon={<ArrowSortDownRegular />}
            onClick={() => onSort("desc")}
          >降順</Button>
        </div>
        <Divider />
        <Input
          size="small"
          placeholder="検索"
          value={search}
          onChange={(_, d) => setSearch(d.value)}
        />
        <Checkbox
          label="すべて選択"
          checked={allChecked ? true : someChecked ? "mixed" : false}
          onChange={(_, d) => handleSelectAll(!!d.checked)}
        />
        <div className={styles.checkList}>
          {visibleOptions.map((o) => (
            <Checkbox
              key={o.value}
              label={o.label}
              checked={isChecked(o.value)}
              onChange={(_, d) => handleToggle(o.value, !!d.checked)}
            />
          ))}
        </div>
        <Divider />
        <Button size="small" appearance="subtle" onClick={() => onFilterChange(null)}>
          クリア
        </Button>
      </PopoverSurface>
    </Popover>
  );
}
