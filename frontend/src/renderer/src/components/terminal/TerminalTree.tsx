import {
  makeStyles,
  tokens,
  Text,
  Badge,
  Tooltip,
} from "@fluentui/react-components";
import {
  ChevronRightRegular,
  ChevronDownRegular,
  DesktopRegular,
  FolderRegular,
  DocumentRegular,
  TableSimpleRegular,
  BracesRegular,
} from "@fluentui/react-icons";
import { useState } from "react";
import type { ReactElement } from "react";
import type { Terminal, Transaction, TransactionType } from "../../mock/terminals";

const useStyles = makeStyles({
  root: {
    padding: "4px 0",
  },
  terminalItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 12px",
    cursor: "pointer",
    userSelect: "none",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground2Hover,
    },
  },
  chevron: {
    fontSize: "12px",
    color: tokens.colorNeutralForeground3,
    flexShrink: 0,
  },
  terminalIcon: {
    fontSize: "16px",
    flexShrink: 0,
  },
  terminalLabel: {
    flexGrow: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  dateItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 12px 4px 28px",
    cursor: "pointer",
    userSelect: "none",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground2Hover,
    },
  },
  txItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "3px 12px 3px 44px",
    cursor: "pointer",
    userSelect: "none",
    borderRadius: "0",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground2Hover,
    },
  },
  txItemSelected: {
    backgroundColor: tokens.colorBrandBackground2,
    "&:hover": {
      backgroundColor: tokens.colorBrandBackground2Hover,
    },
  },
  typeIcon: {
    fontSize: "14px",
    flexShrink: 0,
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  online: {
    backgroundColor: tokens.colorPaletteGreenForeground1,
  },
  offline: {
    backgroundColor: tokens.colorNeutralForeground4,
  },
});

const TYPE_ICONS: Record<TransactionType, ReactElement> = {
  text: <DocumentRegular />,
  csv: <TableSimpleRegular />,
  json: <BracesRegular />,
};

type Props = {
  terminals: Terminal[];
  onSelectTransaction: (tx: Transaction) => void;
  selectedTransactionId: string | null;
};

export function TerminalTree({ terminals, onSelectTransaction, selectedTransactionId }: Props): ReactElement {
  const styles = useStyles();
  const [expandedTerminals, setExpandedTerminals] = useState<Set<string>>(new Set(["t1"]));
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set(["t1-2024-01-15"]));

  const toggleTerminal = (id: string): void => {
    setExpandedTerminals((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleDate = (key: string): void => {
    setExpandedDates((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className={styles.root}>
      {terminals.map((terminal) => {
        const isExpanded = expandedTerminals.has(terminal.id);
        return (
          <div key={terminal.id}>
            {/* 端末行 */}
            <div className={styles.terminalItem} onClick={() => toggleTerminal(terminal.id)}>
              <span className={styles.chevron}>
                {isExpanded ? <ChevronDownRegular /> : <ChevronRightRegular />}
              </span>
              <span
                className={styles.terminalIcon}
                style={{ color: terminal.online === "online" ? tokens.colorPaletteGreenForeground1 : tokens.colorNeutralForeground4 }}
              >
                <DesktopRegular />
              </span>
              <Text size={200} className={styles.terminalLabel} title={terminal.ip}>
                {terminal.name}
              </Text>
              <Tooltip
                content={terminal.monitoring === "on" ? "自動監視ON" : "自動監視OFF"}
                relationship="label"
              >
                <Badge
                  size="small"
                  color={terminal.monitoring === "on" ? "success" : "subtle"}
                  appearance="filled"
                >
                  {terminal.monitoring === "on" ? "監視中" : "停止"}
                </Badge>
              </Tooltip>
            </div>

            {/* 日付フォルダ */}
            {isExpanded &&
              terminal.dateFolders.map((df) => {
                const dateKey = `${terminal.id}-${df.date}`;
                const isDateExpanded = expandedDates.has(dateKey);
                return (
                  <div key={dateKey}>
                    <div className={styles.dateItem} onClick={() => toggleDate(dateKey)}>
                      <span className={styles.chevron}>
                        {isDateExpanded ? <ChevronDownRegular /> : <ChevronRightRegular />}
                      </span>
                      <span style={{ fontSize: "14px", color: tokens.colorNeutralForeground3 }}>
                        <FolderRegular />
                      </span>
                      <Text size={200}>{df.date}</Text>
                      <Text size={100} style={{ color: tokens.colorNeutralForeground4, marginLeft: "4px" }}>
                        ({df.transactions.length})
                      </Text>
                    </div>

                    {/* 取引 */}
                    {isDateExpanded &&
                      df.transactions.map((tx) => (
                        <div
                          key={tx.id}
                          className={`${styles.txItem} ${selectedTransactionId === tx.id ? styles.txItemSelected : ""}`}
                          onClick={() => onSelectTransaction(tx)}
                        >
                          <span
                            className={styles.typeIcon}
                            style={{ color: tokens.colorNeutralForeground3 }}
                          >
                            {TYPE_ICONS[tx.type]}
                          </span>
                          <Text size={200}>{tx.name}</Text>
                        </div>
                      ))}
                  </div>
                );
              })}

            {isExpanded && terminal.dateFolders.length === 0 && (
              <div style={{ padding: "4px 12px 4px 44px" }}>
                <Text size={100} style={{ color: tokens.colorNeutralForeground4 }}>
                  データなし
                </Text>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
