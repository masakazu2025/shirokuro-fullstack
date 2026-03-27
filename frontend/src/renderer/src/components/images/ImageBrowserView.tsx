import { makeStyles, tokens, Button, Tooltip } from "@fluentui/react-components";
import { GridRegular, TableSimpleRegular } from "@fluentui/react-icons";
import { useState, useMemo } from "react";
import type { ReactElement } from "react";
import { FilterBar } from "../browser/FilterBar";
import { ImageGrid } from "./ImageGrid";
import { ImageTable } from "./ImageTable";
import { ImagePreview } from "./ImagePreview";
import { mockTerminals } from "../../mock/terminals";
import type { ImageFile } from "../../mock/terminals";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    overflow: "hidden",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "4px",
    padding: "4px 12px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    flexShrink: 0,
  },
  body: {
    display: "flex",
    flexGrow: 1,
    overflow: "hidden",
  },
  list: {
    flexGrow: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  empty: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    color: tokens.colorNeutralForeground4,
  },
});

type ViewMode = "grid" | "table";

export function ImageBrowserView(): ReactElement {
  const styles = useStyles();
  const [selectedTerminalId, setSelectedTerminalId] = useState(mockTerminals[0].id);
  const [selectedDate, setSelectedDate] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);

  const terminal = useMemo(
    () => mockTerminals.find((t) => t.id === selectedTerminalId) ?? mockTerminals[0],
    [selectedTerminalId]
  );
  const dates = useMemo(() => terminal.dateFolders.map((d) => d.date), [terminal]);
  const images = useMemo((): ImageFile[] => {
    const date = selectedDate || dates[0] || "";
    return terminal.dateFolders.find((d) => d.date === date)?.images ?? [];
  }, [terminal, selectedDate, dates]);

  const handleTerminalChange = (id: string): void => {
    setSelectedTerminalId(id);
    setSelectedDate("");
    setSelectedImage(null);
  };

  const handleDateChange = (date: string): void => {
    setSelectedDate(date);
    setSelectedImage(null);
  };

  return (
    <div className={styles.root}>
      <FilterBar
        terminals={mockTerminals}
        selectedTerminalId={selectedTerminalId}
        onTerminalChange={handleTerminalChange}
        dates={dates}
        selectedDate={selectedDate || dates[0] || ""}
        onDateChange={handleDateChange}
      />
      <div className={styles.toolbar}>
        <Tooltip content="グリッド表示" relationship="label">
          <Button
            size="small"
            appearance={viewMode === "grid" ? "primary" : "subtle"}
            icon={<GridRegular />}
            onClick={() => setViewMode("grid")}
          />
        </Tooltip>
        <Tooltip content="テーブル表示" relationship="label">
          <Button
            size="small"
            appearance={viewMode === "table" ? "primary" : "subtle"}
            icon={<TableSimpleRegular />}
            onClick={() => setViewMode("table")}
          />
        </Tooltip>
      </div>
      <div className={styles.body}>
        <div className={styles.list}>
          {images.length === 0 ? (
            <div className={styles.empty}>画像がありません</div>
          ) : viewMode === "grid" ? (
            <ImageGrid images={images} onSelect={setSelectedImage} selectedId={selectedImage?.id} />
          ) : (
            <ImageTable images={images} onSelect={setSelectedImage} selectedId={selectedImage?.id} />
          )}
        </div>
        <ImagePreview image={selectedImage} />
      </div>
    </div>
  );
}
