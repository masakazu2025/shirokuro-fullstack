import { makeStyles } from "@fluentui/react-components";
import { useState, useMemo, useEffect } from "react";
import type { ReactElement } from "react";
import { FilterBar } from "./FilterBar";
import { TransactionList } from "../terminal/TransactionList";
import { ItemList } from "../terminal/ItemList";
import { MainPane } from "../layout/MainPane";
import { TransactionViewer } from "../viewer/TransactionViewer";
import { mockTerminals } from "../../mock/terminals";
import { transactionApi } from "../../api/transactionApi";
import type { Transaction } from "../../api/transactionApi";
import type { TransactionFile } from "../../mock/terminals";
import type { TransactionFileContent } from "../../api/transactionApi";

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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [files, setFiles] = useState<TransactionFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<TransactionFileContent | null>(null);

  const terminal = useMemo(
    () => mockTerminals.find((t) => t.id === selectedTerminalId) ?? mockTerminals[0],
    [selectedTerminalId]
  );

  const dates = useMemo(() => terminal.dateFolders.map((d) => d.date), [terminal]);
  const currentDate = selectedDate || dates[0] || "";

  useEffect(() => {
    if (!currentDate) return;
    transactionApi.listByDate(selectedTerminalId, currentDate).then(setTransactions);
  }, [selectedTerminalId, currentDate]);

  useEffect(() => {
    if (!selectedTransaction) { setFiles([]); return; }
    transactionApi.listFiles(selectedTerminalId, selectedTransaction.date, selectedTransaction.id)
      .then((entries) =>
        entries.map((e, i) => ({
          id: `${selectedTransaction.id}-${e.filename}`,
          filename: e.filename,
          display_name: e.display_name,
          order: e.order,
          data: [],
        } as TransactionFile))
      )
      .then(setFiles);
  }, [selectedTransaction, selectedTerminalId]);

  const handleTerminalChange = (id: string): void => {
    setSelectedTerminalId(id);
    setSelectedDate("");
    setSelectedTransaction(null);
    setFiles([]);
    setSelectedFile(null);
  };

  const handleDateChange = (date: string): void => {
    setSelectedDate(date);
    setSelectedTransaction(null);
    setFiles([]);
    setSelectedFile(null);
  };

  const handleSelectTransaction = (tx: Transaction): void => {
    setSelectedTransaction(tx);
    setSelectedFile(null);
  };

  const handleSelectFile = (file: TransactionFile): void => {
    transactionApi.getFile(selectedTerminalId, selectedTransaction!.date, selectedTransaction!.id, file.filename)
      .then(setSelectedFile);
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
          files={files}
          selectedId={selectedFile?.filename ?? null}
          onSelect={handleSelectFile}
          transactionSelected={selectedTransaction !== null}
        />
        <MainPane>
          <TransactionViewer
            file={selectedFile}
            noFiles={selectedTransaction !== null && files.length === 0}
          />
        </MainPane>
      </div>
    </div>
  );
}
