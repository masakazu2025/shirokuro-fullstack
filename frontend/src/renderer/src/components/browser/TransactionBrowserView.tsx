import { makeStyles } from "@fluentui/react-components";
import { useState, useMemo } from "react";
import type { ReactElement } from "react";
import { FilterBar } from "./FilterBar";
import { TransactionList } from "../terminal/TransactionList";
import { ItemList } from "../terminal/ItemList";
import { MainPane } from "../layout/MainPane";
import { TransactionViewer } from "../viewer/TransactionViewer";
import { mockTerminals } from "../../mock/terminals";
import type { Transaction, TransactionFile } from "../../mock/terminals";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    overflow: "hidden",
  },
  columns: {
    display: "flex",
    flexGrow: 1,
    overflow: "hidden",
  },
});

export function TransactionBrowserView(): ReactElement {
  const styles = useStyles();

  const [selectedTerminalId, setSelectedTerminalId] = useState(mockTerminals[0].id);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedFile, setSelectedFile] = useState<TransactionFile | null>(null);

  const terminal = useMemo(
    () => mockTerminals.find((t) => t.id === selectedTerminalId) ?? mockTerminals[0],
    [selectedTerminalId]
  );

  const dates = useMemo(() => terminal.dateFolders.map((d) => d.date), [terminal]);

  const currentDate = selectedDate || dates[0] || "";

  const transactions = useMemo(
    () => terminal.dateFolders.find((d) => d.date === currentDate)?.transactions ?? [],
    [terminal, currentDate]
  );

  const handleTerminalChange = (id: string): void => {
    setSelectedTerminalId(id);
    setSelectedDate("");
    setSelectedTransaction(null);
    setSelectedFile(null);
  };

  const handleDateChange = (date: string): void => {
    setSelectedDate(date);
    setSelectedTransaction(null);
    setSelectedFile(null);
  };

  const handleSelectTransaction = (tx: Transaction): void => {
    setSelectedTransaction(tx);
    setSelectedFile(null);
  };

  const handleSelectFile = (file: TransactionFile): void => {
    setSelectedFile(file);
  };

  return (
    <div className={styles.root}>
      <FilterBar
        terminals={mockTerminals}
        selectedTerminalId={selectedTerminalId}
        onTerminalChange={handleTerminalChange}
        dates={dates}
        selectedDate={currentDate}
        onDateChange={handleDateChange}
      />
      <div className={styles.columns}>
        <TransactionList
          transactions={transactions}
          selectedId={selectedTransaction?.id ?? null}
          onSelect={handleSelectTransaction}
        />
        <ItemList
          files={selectedTransaction?.files ?? []}
          selectedId={selectedFile?.id ?? null}
          onSelect={handleSelectFile}
          transactionSelected={selectedTransaction !== null}
        />
        <MainPane>
          <TransactionViewer
            file={selectedFile}
            noFiles={selectedTransaction !== null && selectedTransaction.files.length === 0}
          />
        </MainPane>
      </div>
    </div>
  );
}
