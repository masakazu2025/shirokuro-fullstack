import { makeStyles } from "@fluentui/react-components";
import { useState, useMemo, useEffect } from "react";
import type { ReactElement } from "react";
import { FilterBar } from "./FilterBar";
import { TransactionList } from "../terminal/TransactionList";
import { ItemList } from "../terminal/ItemList";
import { MainPane } from "../layout/MainPane";
import { TransactionViewer } from "../viewer/TransactionViewer";
import { terminalApi } from "../../api/terminalApi";
import type { Terminal } from "../../api/terminalApi";
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

  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [selectedTerminalId, setSelectedTerminalId] = useState("");
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [files, setFiles] = useState<TransactionFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<TransactionFileContent | null>(null);

  // 端末一覧を取得
  useEffect(() => {
    terminalApi.list().then((list) => {
      setTerminals(list);
      if (list.length > 0) setSelectedTerminalId(list[0].id);
    });
  }, []);

  // 端末が変わったら日付一覧を取得
  useEffect(() => {
    if (!selectedTerminalId) return;
    transactionApi.listAll(selectedTerminalId).then((txs) => {
      const unique = [...new Set(txs.map((tx) => tx.date))].sort().reverse();
      setDates(unique);
      setSelectedDate(unique[0] ?? "");
    });
  }, [selectedTerminalId]);

  // 日付が変わったら取引一覧を取得
  useEffect(() => {
    if (!selectedTerminalId || !selectedDate) return;
    transactionApi.listByDate(selectedTerminalId, selectedDate).then(setTransactions);
  }, [selectedTerminalId, selectedDate]);

  useEffect(() => {
    if (!selectedTransaction) { setFiles([]); return; }
    transactionApi.listFiles(selectedTerminalId, selectedTransaction.date, selectedTransaction.id)
      .then((entries) =>
        entries.map((e) => ({
          id: `${selectedTransaction.id}-${e.filename}`,
          filename: e.filename,
          display_name: e.display_name,
          order: e.order,
          data: [],
        } as TransactionFile))
      )
      .then(setFiles);
  }, [selectedTransaction, selectedTerminalId]);

  const currentDate = selectedDate || dates[0] || "";

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
        terminals={terminals}
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
