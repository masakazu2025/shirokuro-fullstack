import { makeStyles, tokens, Text } from "@fluentui/react-components";
import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import { FeatureList } from "./FeatureList";
import { SheetList } from "./SheetList";
import { FolderTree } from "./FolderTree";
import { OperationPane } from "./OperationPane";
import { CollapsedPane } from "./CollapsedPane";
import { ViewerPanel } from "./ViewerPanel";
import { mockTestSpec } from "../../mock/testspec";
import type { Feature, Sheet, TestFolder, SavedFile } from "../../mock/testspec";

function findFolderPath(folders: TestFolder[], targetId: string, path: TestFolder[] = []): TestFolder[] | null {
  for (const folder of folders) {
    const current = [...path, folder];
    if (folder.id === targetId) return current;
    const found = findFolderPath(folder.children, targetId, current);
    if (found) return found;
  }
  return null;
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 12px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    flexShrink: 0,
  },
  fileName: {
    color: tokens.colorNeutralForeground2,
    fontFamily: "'Cascadia Code', 'Consolas', monospace",
  },
  columns: {
    display: "flex",
    flexGrow: 1,
    overflow: "hidden",
  },
});

export function TestSpecView(): ReactElement {
  const styles = useStyles();
  const spec = mockTestSpec;

  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [selectedSheet, setSelectedSheet] = useState<Sheet | null>(null);
  const [folderStack, setFolderStack] = useState<TestFolder[]>([]);
  const selectedFolder = folderStack[folderStack.length - 1] ?? null;

  const [featureCollapsed, setFeatureCollapsed] = useState(false);
  const [sheetCollapsed, setSheetCollapsed] = useState(false);
  const [folderCollapsed, setFolderCollapsed] = useState(false);

  const [featureWidthCollapsed, setFeatureWidthCollapsed] = useState(false);
  const [sheetWidthCollapsed, setSheetWidthCollapsed] = useState(false);

  const [featureAutoCollapse, setFeatureAutoCollapse] = useState(false);
  const [sheetAutoCollapse, setSheetAutoCollapse] = useState(false);
  const [folderAutoCollapse, setFolderAutoCollapse] = useState(false);

  const [viewingFile, setViewingFile] = useState<SavedFile | null>(null);

  // ウィンドウ幅に応じて左ペインを自動折り畳み
  // 閾値: Feature < 1040px, Sheet < 904px (Feature折り畳み済み想定)
  useEffect(() => {
    const FEATURE_THRESHOLD = 1040;
    const SHEET_THRESHOLD = 904;

    const update = (): void => {
      const w = window.innerWidth;
      setFeatureWidthCollapsed(w < FEATURE_THRESHOLD);
      setSheetWidthCollapsed(w < SHEET_THRESHOLD);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleSelectFeature = (f: Feature): void => {
    setSelectedFeature(f);
    setSelectedSheet(null);
    setFolderStack([]);
    if (featureAutoCollapse) setFeatureCollapsed(true);
  };

  const handleSelectSheet = (s: Sheet): void => {
    setSelectedSheet(s);
    setFolderStack([]);
    if (sheetAutoCollapse) setSheetCollapsed(true);
  };

  // FolderTreeから選択 → パスを解決してスタックにセット
  const handleSelectFolder = (f: TestFolder): void => {
    const path = findFolderPath(selectedSheet?.folders ?? [], f.id);
    setFolderStack(path ?? [f]);
    if (folderAutoCollapse) setFolderCollapsed(true);
  };

  // OperationPaneのサブフォルダ選択 → スタックに積む
  const handleDrillIntoFolder = (f: TestFolder): void => {
    setFolderStack((prev) => [...prev, f]);
  };

  const handleGoUp = (): void => {
    setFolderStack((prev) => prev.slice(0, -1));
  };

  const handleNavigateSibling = (f: TestFolder): void => {
    setFolderStack((prev) => [...prev.slice(0, -1), f]);
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Text size={100} weight="semibold" style={{ color: tokens.colorNeutralForeground3, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          仕様書
        </Text>
        <Text size={200} className={styles.fileName}>{spec.fileName}</Text>
      </div>
      <div className={styles.columns}>

        {(featureCollapsed || featureWidthCollapsed) && selectedFeature ? (
          <CollapsedPane
            label="機能"
            selectedValue={selectedFeature.name}
            onExpand={() => { setFeatureCollapsed(false); setFeatureWidthCollapsed(false); }}
          />
        ) : (
          <FeatureList
            features={spec.features}
            selectedId={selectedFeature?.id ?? null}
            onSelect={handleSelectFeature}
            onCollapse={() => setFeatureCollapsed(true)}
            autoCollapse={featureAutoCollapse}
            onToggleAutoCollapse={() => setFeatureAutoCollapse((v) => !v)}
          />
        )}

        {(sheetCollapsed || sheetWidthCollapsed) && selectedSheet ? (
          <CollapsedPane
            label="シート"
            selectedValue={selectedSheet.name}
            onExpand={() => { setSheetCollapsed(false); setSheetWidthCollapsed(false); }}
          />
        ) : (
          <SheetList
            sheets={selectedFeature?.sheets ?? []}
            selectedId={selectedSheet?.id ?? null}
            onSelect={handleSelectSheet}
            onCollapse={() => setSheetCollapsed(true)}
            autoCollapse={sheetAutoCollapse}
            onToggleAutoCollapse={() => setSheetAutoCollapse((v) => !v)}
          />
        )}

        {folderCollapsed && selectedFolder ? (
          <CollapsedPane
            label="フォルダ"
            selectedValue={selectedFolder.name}
            onExpand={() => setFolderCollapsed(false)}
          />
        ) : (
          <FolderTree
            folders={selectedSheet?.folders ?? []}
            selectedId={selectedFolder?.id ?? null}
            onSelect={handleSelectFolder}
            onCollapse={() => setFolderCollapsed(true)}
            autoCollapse={folderAutoCollapse}
            onToggleAutoCollapse={() => setFolderAutoCollapse((v) => !v)}
          />
        )}

        {(() => {
          const siblings = folderStack.length === 1
            ? (selectedSheet?.folders ?? [])
            : (folderStack[folderStack.length - 2]?.children ?? []);
          const currentIdx = siblings.findIndex((s) => s.id === selectedFolder?.id);
          return (
            <OperationPane
              featureName={selectedFeature?.name ?? null}
              sheetName={selectedSheet?.name ?? null}
              folderStack={folderStack}
              folder={selectedFolder}
              canGoUp={folderStack.length > 1}
              prevFolder={currentIdx > 0 ? siblings[currentIdx - 1] : null}
              nextFolder={currentIdx >= 0 && currentIdx < siblings.length - 1 ? siblings[currentIdx + 1] : null}
              onNavigateSibling={handleNavigateSibling}
              onGoUp={handleGoUp}
              onJumpToFolder={(f) => setFolderStack((prev) => prev.slice(0, prev.findIndex((p) => p.id === f.id) + 1))}
              onSelectFile={setViewingFile}
            />
          );
        })()}

        {viewingFile && (
          <ViewerPanel file={viewingFile} onClose={() => setViewingFile(null)} />
        )}
      </div>
    </div>
  );
}
