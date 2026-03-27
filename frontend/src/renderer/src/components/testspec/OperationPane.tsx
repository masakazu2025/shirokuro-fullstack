import { makeStyles, tokens, Text, Button, Divider, Menu, MenuTrigger, MenuPopover, MenuList, MenuItem } from "@fluentui/react-components";
import { SaveRegular, DocumentSearchRegular, ArrowUpRegular, ChevronLeftRegular, ChevronRightRegular, AddRegular, FolderAddRegular, NumberSymbolRegular, ChevronRightFilled, ClockRegular } from "@fluentui/react-icons";
import type { ReactElement } from "react";
import type { TestFolder, SavedFile } from "../../mock/testspec";
import { SavedFileList } from "./SavedFileList";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    overflow: "hidden",
  },
  // パンくず
  breadcrumbBar: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "6px 8px 4px",
    backgroundColor: tokens.colorNeutralBackground2,
    flexShrink: 0,
    flexWrap: "wrap",
  },
  // フォルダ操作ボタン行
  folderActionsBar: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "2px 8px 6px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    flexShrink: 0,
  },
  breadcrumbItem: {
    cursor: "pointer",
    color: tokens.colorBrandForeground1,
    borderRadius: "4px",
    padding: "0 2px",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  breadcrumbCurrent: {
    color: tokens.colorNeutralForeground1,
    fontWeight: 600,
  },
  breadcrumbSep: {
    color: tokens.colorNeutralForeground4,
    fontSize: "10px",
  },
  breadcrumbPlaceholder: {
    color: tokens.colorNeutralForeground4,
    fontStyle: "italic",
  },
  navButtons: {
    display: "flex",
    gap: "2px",
    flexShrink: 0,
  },
  // セクションヘッダー（アコーディオン）
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    padding: "5px 8px",
    cursor: "pointer",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
    userSelect: "none",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground2Hover,
    },
  },
  sectionHeaderLabel: {
    flexGrow: 1,
    color: tokens.colorNeutralForeground3,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  sectionChevron: {
    color: tokens.colorNeutralForeground3,
  },
  // サブフォルダ
  subfolderList: {
    display: "flex",
    flexDirection: "column",
    padding: "4px 8px",
    gap: "2px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
    maxHeight: "160px",
    overflowY: "auto",
  },
  subfolderItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "5px 8px",
    cursor: "pointer",
    borderRadius: "4px",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground2Hover,
    },
  },
  subfolderIcon: {
    color: tokens.colorBrandForeground1,
    flexShrink: 0,
  },
  // 保存済み（伸縮）
  savedArea: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "12px 16px",
    flexGrow: 1,
    overflow: "hidden",
    minHeight: 0,
  },
  savedTitle: {
    color: tokens.colorNeutralForeground3,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    flexShrink: 0,
  },
  savedScroll: {
    flexGrow: 1,
    overflow: "hidden",
    minHeight: 0,
  },
  empty: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    color: tokens.colorNeutralForeground4,
  },
});

type Props = {
  featureName: string | null;
  sheetName: string | null;
  folderStack: TestFolder[];
  folder: TestFolder | null;
  canGoUp: boolean;
  prevFolder: TestFolder | null;
  nextFolder: TestFolder | null;
  onNavigateSibling: (f: TestFolder) => void;
  onGoUp: () => void;
  onJumpToFolder: (f: TestFolder) => void;
  onSelectFile: (file: SavedFile) => void;
};

export function OperationPane({
  featureName, sheetName, folderStack, folder,
  canGoUp, prevFolder, nextFolder,
  onNavigateSibling, onGoUp, onJumpToFolder, onSelectFile,
}: Props): ReactElement {
  const styles = useStyles();
  const savedFiles = folder?.savedFiles ?? [];
  const subfolders = folder?.children ?? [];

  // パンくずアイテム: 機能名 > シート名 > フォルダ1 > フォルダ2 ...
  const breadcrumbs: { label: string; onClick?: () => void }[] = [
    featureName ? { label: featureName } : { label: "機能未選択" },
    sheetName ? { label: sheetName } : null,
    ...folderStack.map((f, i) => ({
      label: f.name,
      onClick: i < folderStack.length - 1 ? () => onJumpToFolder(f) : undefined,
    })),
  ].filter(Boolean) as { label: string; onClick?: () => void }[];

  return (
    <div className={styles.root}>
      {/* パンくず */}
      <div className={styles.breadcrumbBar}>
        {breadcrumbs.map((item, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {i > 0 && <ChevronRightFilled className={styles.breadcrumbSep} fontSize={10} />}
            {item.onClick ? (
              <Text size={200} className={styles.breadcrumbItem} onClick={item.onClick}>
                {item.label}
              </Text>
            ) : (
              <Text size={200} className={i === breadcrumbs.length - 1 ? styles.breadcrumbCurrent : styles.breadcrumbItem}>
                {item.label}
              </Text>
            )}
          </span>
        ))}
      </div>

      {/* フォルダ操作ボタン行 */}
      <div className={styles.folderActionsBar}>
        <div className={styles.navButtons}>
          <Button size="small" appearance="subtle" icon={<ChevronLeftRegular />}
            disabled={!prevFolder} title={prevFolder?.name ?? ""}
            onClick={() => prevFolder && onNavigateSibling(prevFolder)} />
          <Button size="small" appearance="subtle" icon={<ArrowUpRegular />}
            disabled={!canGoUp} title="上の階層へ" onClick={onGoUp} />
          <Button size="small" appearance="subtle" icon={<ChevronRightRegular />}
            disabled={!nextFolder} title={nextFolder?.name ?? ""}
            onClick={() => nextFolder && onNavigateSibling(nextFolder)} />
        </div>
        <Menu>
          <MenuTrigger>
            <Button size="small" appearance="subtle" icon={<AddRegular />} disabled={!folder} title="フォルダを追加">
              フォルダを追加
            </Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem icon={<FolderAddRegular />}>フォルダを追加</MenuItem>
              <MenuItem icon={<NumberSymbolRegular />}>連番フォルダを一括作成</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
        <Menu>
          <MenuTrigger>
            <Button size="small" appearance="primary" icon={<SaveRegular />} disabled={!folder}>
              保存
            </Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem icon={<DocumentSearchRegular />}>取引を選んで保存</MenuItem>
              <MenuItem icon={<SaveRegular />}>閲覧しながら保存</MenuItem>
              <MenuItem icon={<ClockRegular />}>時刻範囲で一括保存</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>


{!folder ? (
        <div className={styles.empty}>
          <Text size={300}>フォルダを選択してください</Text>
        </div>
      ) : (
        <>
          {/* 保存済み */}
          <div className={styles.savedArea}>
            <div className={styles.savedScroll}>
              <SavedFileList files={savedFiles} onSelect={onSelectFile} />
            </div>
          </div>
        </>
      )}

    </div>
  );
}
