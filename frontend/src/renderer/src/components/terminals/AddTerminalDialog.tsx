import {
  Dialog, DialogSurface, DialogTitle, DialogBody,
  DialogActions, DialogContent, Button, Field, Input,
  Tab, TabList, Text, Badge,
} from "@fluentui/react-components";
import { makeStyles, tokens } from "@fluentui/react-components";
import { useState, useEffect, useRef } from "react";
import type { ReactElement } from "react";

const useStyles = makeStyles({
  octetRow: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    marginTop: "4px",
  },
  octetInput: {
    width: "60px",
  },
  dot: {
    color: tokens.colorNeutralForeground3,
    fontWeight: 600,
    flexShrink: 0,
  },
  preview: {
    marginTop: "12px",
    maxHeight: "160px",
    overflowY: "auto",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  previewRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "4px 10px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    "&:last-child": { borderBottom: "none" },
  },
  rangeInputs: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "12px",
  },
});

type AddEntry = { name: string; ip: string };

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (entries: AddEntry[]) => void;
  existingIps: string[];
};

type Mode = "single" | "bulk";

function parsePrefix(existingIps: string[]): [string, string, string] {
  if (existingIps.length === 0) return ["", "", ""];
  const parts = existingIps[0].split(".");
  return [parts[0] ?? "", parts[1] ?? "", parts[2] ?? ""];
}

function isValidOctet(v: string): boolean {
  if (v === "") return false;
  const n = parseInt(v, 10);
  return !isNaN(n) && n >= 0 && n <= 255 && String(n) === v;
}

function octetError(v: string): string | null {
  if (v === "") return null;
  const n = parseInt(v, 10);
  if (isNaN(n)) return "数値を入力してください";
  if (n < 0 || n > 255) return "0〜255の範囲で入力してください";
  if (String(n) !== v) return "先頭の0は不要です";
  return null;
}

function rangeNumError(v: string, startV?: string): string | null {
  if (v === "") return null;
  const n = parseInt(v, 10);
  if (isNaN(n)) return "数値を入力してください";
  if (n < 0 || n > 255) return "0〜255の範囲で入力してください";
  if (startV !== undefined) {
    const start = parseInt(startV, 10);
    if (!isNaN(start) && n < start) return "開始番号以上の値を入力してください";
  }
  return null;
}

export function AddTerminalDialog({ open, onClose, onAdd, existingIps }: Props): ReactElement {
  const styles = useStyles();
  const [mode, setMode] = useState<Mode>("single");

  // oct1〜oct3 は単体・一括で共有（プレフィックス部分）
  const [oct1, setOct1] = useState("");
  const [oct2, setOct2] = useState("");
  const [oct3, setOct3] = useState("");

  // 単体のみ
  const [name, setName] = useState("");
  const [oct4, setOct4] = useState("");

  // 一括のみ
  const [startNum, setStartNum] = useState("");
  const [endNum, setEndNum] = useState("");
  const [namePrefix, setNamePrefix] = useState("");

  // 単体用フォーカス ref
  const ref2 = useRef<HTMLInputElement>(null);
  const ref3 = useRef<HTMLInputElement>(null);
  const ref4 = useRef<HTMLInputElement>(null);

  // 一括用フォーカス ref
  const bulkRef2 = useRef<HTMLInputElement>(null);
  const bulkRef3 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setMode("single");
      const [p1, p2, p3] = parsePrefix(existingIps);
      setOct1(p1); setOct2(p2); setOct3(p3); setOct4("");
      setStartNum(""); setEndNum(""); setNamePrefix("");
    }
  }, [open]);

  // ---- 単体バリデーション ----
  const singleIp = `${oct1}.${oct2}.${oct3}.${oct4}`;
  const singleIpFilled = isValidOctet(oct1) && isValidOctet(oct2) && isValidOctet(oct3) && isValidOctet(oct4);
  const anyOctetTouched = oct1 !== "" || oct2 !== "" || oct3 !== "" || oct4 !== "";
  const firstOctetErr = octetError(oct1) ?? octetError(oct2) ?? octetError(oct3) ?? octetError(oct4);
  const singleIpError = singleIpFilled && existingIps.includes(singleIp)
    ? "このIPアドレスは既に登録されています"
    : firstOctetErr !== null
    ? firstOctetErr
    : anyOctetTouched && !singleIpFilled
    ? "すべての項目を入力してください"
    : "";

  // ---- 一括バリデーション ----
  const bulkPrefixFilled = isValidOctet(oct1) && isValidOctet(oct2) && isValidOctet(oct3);
  const anyPrefixTouched = oct1 !== "" || oct2 !== "" || oct3 !== "";
  const firstPrefixErr = octetError(oct1) ?? octetError(oct2) ?? octetError(oct3);
  const bulkPrefixError = firstPrefixErr !== null
    ? firstPrefixErr
    : anyPrefixTouched && !bulkPrefixFilled
    ? "すべての項目を入力してください"
    : "";

  const startNumError = rangeNumError(startNum) ?? "";
  const endNumError = rangeNumError(endNum, startNum) ?? "";

  const bulkPrefix = `${oct1}.${oct2}.${oct3}.`;
  const bulkEntries: Array<AddEntry & { duplicate: boolean }> = (() => {
    const start = parseInt(startNum, 10);
    const end = parseInt(endNum, 10);
    if (!bulkPrefixFilled || isNaN(start) || isNaN(end) || start > end) return [];
    return Array.from({ length: end - start + 1 }, (_, i) => {
      const num = start + i;
      const entryIp = `${bulkPrefix}${num}`;
      const entryName = namePrefix.trim() ? `${namePrefix.trim()}${num}` : entryIp;
      return { ip: entryIp, name: entryName, duplicate: existingIps.includes(entryIp) };
    });
  })();

  const newBulkEntries = bulkEntries.filter((e) => !e.duplicate);

  const handleAdd = (): void => {
    if (mode === "single") {
      if (!singleIpFilled || singleIpError !== "") return;
      onAdd([{ name: name.trim() || singleIp, ip: singleIp }]);
    } else {
      if (newBulkEntries.length === 0) return;
      onAdd(newBulkEntries);
    }
    handleClose();
  };

  const handleClose = (): void => {
    setName(""); setOct1(""); setOct2(""); setOct3(""); setOct4("");
    setStartNum(""); setEndNum(""); setNamePrefix("");
    onClose();
  };

  const handleOctet = (
    val: string,
    set: (v: string) => void,
    nextRef?: React.RefObject<HTMLInputElement>
  ): void => {
    const clean = val.replace(/\D/g, "").slice(0, 3);
    set(clean);
    if (clean.length === 3 && nextRef?.current) nextRef.current.focus();
  };

  const canAdd = mode === "single"
    ? singleIpFilled && singleIpError === ""
    : newBulkEntries.length > 0;

  return (
    <Dialog open={open} onOpenChange={(_, d) => { if (!d.open) handleClose(); }}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>端末を追加</DialogTitle>
          <DialogContent>
            <TabList
              size="small"
              selectedValue={mode}
              onTabSelect={(_, d) => setMode(d.value as Mode)}
            >
              <Tab value="single">1件追加</Tab>
              <Tab value="bulk">一括追加</Tab>
            </TabList>

            {mode === "single" ? (
              <>
                <Field label="端末名" hint="省略するとIPアドレスが端末名になります" style={{ marginTop: "12px" }}>
                  <Input
                    value={name}
                    onChange={(_, d) => setName(d.value)}
                    placeholder="例: POS端末-04"
                  />
                </Field>
                <Field
                  label="IPアドレス"
                  required
                  validationState={singleIpError ? "error" : "none"}
                  validationMessage={singleIpError}
                  style={{ marginTop: "12px" }}
                >
                  <div className={styles.octetRow}>
                    <Input className={styles.octetInput} value={oct1} onChange={(_, d) => handleOctet(d.value, setOct1, ref2)} placeholder="192" />
                    <span className={styles.dot}>.</span>
                    <Input ref={ref2} className={styles.octetInput} value={oct2} onChange={(_, d) => handleOctet(d.value, setOct2, ref3)} placeholder="168" />
                    <span className={styles.dot}>.</span>
                    <Input ref={ref3} className={styles.octetInput} value={oct3} onChange={(_, d) => handleOctet(d.value, setOct3, ref4)} placeholder="1" />
                    <span className={styles.dot}>.</span>
                    <Input ref={ref4} className={styles.octetInput} value={oct4} onChange={(_, d) => handleOctet(d.value, setOct4)} placeholder="101" />
                  </div>
                </Field>
              </>
            ) : (
              <>
                <Field
                  label="IPプレフィックス"
                  required
                  validationState={bulkPrefixError ? "error" : "none"}
                  validationMessage={bulkPrefixError}
                  style={{ marginTop: "12px" }}
                >
                  <div className={styles.octetRow}>
                    <Input className={styles.octetInput} value={oct1} onChange={(_, d) => handleOctet(d.value, setOct1, bulkRef2)} placeholder="192" />
                    <span className={styles.dot}>.</span>
                    <Input ref={bulkRef2} className={styles.octetInput} value={oct2} onChange={(_, d) => handleOctet(d.value, setOct2, bulkRef3)} placeholder="168" />
                    <span className={styles.dot}>.</span>
                    <Input ref={bulkRef3} className={styles.octetInput} value={oct3} onChange={(_, d) => handleOctet(d.value, setOct3)} placeholder="1" />
                    <span className={styles.dot}>.</span>
                  </div>
                </Field>
                <div className={styles.rangeInputs}>
                  <Field
                    label="開始番号"
                    required
                    style={{ flex: 1 }}
                    validationState={startNumError ? "error" : "none"}
                    validationMessage={startNumError}
                  >
                    <Input
                      value={startNum}
                      onChange={(_, d) => setStartNum(d.value.replace(/\D/g, "").slice(0, 3))}
                      placeholder="101"
                    />
                  </Field>
                  <Text style={{ marginTop: "20px" }}>〜</Text>
                  <Field
                    label="終了番号"
                    required
                    style={{ flex: 1 }}
                    validationState={endNumError ? "error" : "none"}
                    validationMessage={endNumError}
                  >
                    <Input
                      value={endNum}
                      onChange={(_, d) => setEndNum(d.value.replace(/\D/g, "").slice(0, 3))}
                      placeholder="105"
                    />
                  </Field>
                </div>
                <Field label="端末名プレフィックス" hint="省略するとIPアドレスが端末名になります" style={{ marginTop: "12px" }}>
                  <Input
                    value={namePrefix}
                    onChange={(_, d) => setNamePrefix(d.value)}
                    placeholder="例: POS端末-"
                  />
                </Field>
                {bulkEntries.length > 0 && (
                  <div className={styles.preview}>
                    {bulkEntries.map((e) => (
                      <div key={e.ip} className={styles.previewRow}>
                        <Text size={200} style={{ color: e.duplicate ? tokens.colorNeutralForeground4 : tokens.colorNeutralForeground1 }}>
                          {e.name} ({e.ip})
                        </Text>
                        {e.duplicate && <Badge size="small" color="warning" appearance="tint">重複</Badge>}
                      </div>
                    ))}
                  </div>
                )}
                {newBulkEntries.length > 0 && (
                  <Text size={200} style={{ marginTop: "6px", color: tokens.colorNeutralForeground3 }}>
                    {newBulkEntries.length}件追加されます
                  </Text>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={handleClose}>キャンセル</Button>
            <Button appearance="primary" onClick={handleAdd} disabled={!canAdd}>追加</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
