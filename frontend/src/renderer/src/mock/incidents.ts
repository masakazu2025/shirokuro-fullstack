export type IncidentStatus = "未提出" | "提出済";

export type AttachedFile = {
  id: string;
  name: string;
  category: "log" | "transaction" | "image";
  checked: boolean;
};

export type Incident = {
  id: string;
  timestamp: string; // yyyymmddhhmmss
  title: string;
  content: string;
  status: IncidentStatus;
  attachments: AttachedFile[];
};

export const mockIncidents: Incident[] = [
  {
    id: "20240115091234",
    timestamp: "20240115091234",
    title: "決済完了後に画面が固まる",
    content: "決済完了ボタン押下後、約3秒後に画面が応答なしになる。\n再現手順：\n1. 商品を登録\n2. 現金決済を選択\n3. 決済完了ボタンを押す",
    status: "未提出",
    attachments: [
      { id: "a1", name: "transaction.log", category: "log", checked: true },
      { id: "a2", name: "TX_003 (11:45:10)", category: "transaction", checked: true },
      { id: "a3", name: "error_screen.png", category: "image", checked: true },
      { id: "a4", name: "display_003.png", category: "image", checked: false },
    ],
  },
  {
    id: "20240115143022",
    timestamp: "20240115143022",
    title: "レシート印字が途中で止まる",
    content: "レシート印字中に用紙切れではないのに印字が止まる。\nエラーメッセージは表示されない。",
    status: "未提出",
    attachments: [
      { id: "b1", name: "transaction.log", category: "log", checked: true },
      { id: "b2", name: "receipt_004.png", category: "image", checked: true },
    ],
  },
  {
    id: "20240110120000",
    timestamp: "20240110120000",
    title: "ログイン後に端末IDが空白になる",
    content: "ログイン直後、端末IDが空白で表示される。一度別画面に遷移すると正常に表示される。",
    status: "提出済",
    attachments: [
      { id: "c1", name: "transaction.log", category: "log", checked: true },
    ],
  },
];
