export type MonitoringStatus = "on" | "off";
export type OnlineStatus = "online" | "offline";
export type ItemType = "text" | "csv" | "json" | "image";

export type TransactionItem = {
  id: string;
  name: string;
  type: ItemType;
  content: string;
};

export type Transaction = {
  id: string;
  no: string;
  time: string;
  items: TransactionItem[];
};

export type ImageFile = {
  id: string;
  name: string;
  time: string;
  transactionNo: string;
  size: string;
  placeholderColor: string;
};

export type DateFolder = {
  date: string;
  transactions: Transaction[];
  images: ImageFile[];
};

export type Terminal = {
  id: string;
  name: string;
  ip: string;
  monitoring: MonitoringStatus;
  online: OnlineStatus;
  dateFolders: DateFolder[];
};

export const mockTerminals: Terminal[] = [
  {
    id: "t1",
    name: "POS端末-01",
    ip: "192.168.1.101",
    monitoring: "on",
    online: "online",
    dateFolders: [
      {
        date: "2024-01-15",
        transactions: [
          {
            id: "tx001", no: "TX_001", time: "09:12:34",
            items: [
              {
                id: "tx001-log", name: "transaction.log", type: "text",
                content: "取引開始: 2024-01-15 09:12:34\n端末ID: POS-01\nオペレータ: 001\n\n[売上登録]\n商品コード: 4901234567890\n商品名: サンプル商品A\n単価: 980\n数量: 2\n小計: 1960\n\n[合計]\n税抜: 1960\n消費税(10%): 196\n税込合計: 2156\n\n取引終了: 2024-01-15 09:12:51",
              },
              {
                id: "tx001-detail", name: "detail.csv", type: "csv",
                content: "商品コード,商品名,単価,数量,小計\n4901234567890,サンプル商品A,980,2,1960",
              },
            ],
          },
          {
            id: "tx002", no: "TX_002", time: "10:30:22",
            items: [
              {
                id: "tx002-log", name: "transaction.log", type: "text",
                content: "取引開始: 2024-01-15 10:30:22\n端末ID: POS-01\nオペレータ: 002\n\n[返品処理]\n元取引番号: TX_001\n商品コード: 4901234567890\n商品名: サンプル商品A\n返品数量: 1\n返品金額: -1078\n\n取引終了: 2024-01-15 10:30:45",
              },
            ],
          },
          {
            id: "tx003", no: "TX_003", time: "11:45:10",
            items: [
              {
                id: "tx003-log", name: "transaction.log", type: "text",
                content: "取引開始: 2024-01-15 11:45:10\n端末ID: POS-01\nオペレータ: 001\n\n[売上登録]\n商品コード: 4902345678901\n商品名: サンプル商品B\n単価: 4500\n数量: 1\n小計: 4500\n\n[合計]\n税抜: 4500\n消費税(10%): 450\n税込合計: 4950\n\n取引終了: 2024-01-15 11:45:28",
              },
              {
                id: "tx003-config", name: "pos_config.json", type: "json",
                content: JSON.stringify({ terminalId: "POS-01", operatorId: "001", taxRate: 0.1, receiptPrinter: "EPSON-TM88" }, null, 2),
              },
            ],
          },
          {
            id: "tx004", no: "TX_004", time: "13:20:05",
            items: [
              {
                id: "tx004-log", name: "transaction.log", type: "text",
                content: "取引開始: 2024-01-15 13:20:05\n端末ID: POS-01\nオペレータ: 003\n\n[売上登録]\n商品コード: 4903456789012\n商品名: サンプル商品C\n単価: 2300\n数量: 1\n小計: 2300\n\n[合計]\n税抜: 2300\n消費税(10%): 230\n税込合計: 2530\n\n取引終了: 2024-01-15 13:20:19",
              },
              {
                id: "tx004-summary", name: "daily_summary.csv", type: "csv",
                content: "取引番号,時刻,種別,金額,消費税,合計\nTX_001,09:12:34,売上,1960,196,2156\nTX_002,10:30:22,返品,-980,-98,-1078\nTX_003,11:45:10,売上,4500,450,4950\nTX_004,13:20:05,売上,2300,230,2530",
              },
            ],
          },
          {
            id: "tx005", no: "TX_005", time: "14:55:30",
            items: [
              {
                id: "tx005-log", name: "transaction.log", type: "text",
                content: "取引開始: 2024-01-15 14:55:30\n端末ID: POS-01\nオペレータ: 001\n\n[売上登録]\n商品コード: 4901234567890\n商品名: サンプル商品A\n単価: 980\n数量: 1\n小計: 980\n\n[合計]\n税抜: 980\n消費税(10%): 98\n税込合計: 1078\n\n取引終了: 2024-01-15 14:55:44",
              },
            ],
          },
        ],
        images: [
          { id: "img001", name: "receipt_001.png",   time: "09:12:51", transactionNo: "TX_001", size: "142KB", placeholderColor: "#4f8ef7" },
          { id: "img002", name: "receipt_002.png",   time: "10:30:45", transactionNo: "TX_002", size: "138KB", placeholderColor: "#e87c4e" },
          { id: "img003", name: "display_003.png",   time: "11:45:28", transactionNo: "TX_003", size: "256KB", placeholderColor: "#5cb85c" },
          { id: "img004", name: "receipt_003.png",   time: "11:45:30", transactionNo: "TX_003", size: "141KB", placeholderColor: "#9b59b6" },
          { id: "img005", name: "error_screen.png",  time: "12:03:10", transactionNo: "TX_003", size: "89KB",  placeholderColor: "#e74c3c" },
          { id: "img006", name: "receipt_004.png",   time: "13:20:19", transactionNo: "TX_004", size: "145KB", placeholderColor: "#1abc9c" },
          { id: "img007", name: "display_004.png",   time: "13:20:21", transactionNo: "TX_004", size: "231KB", placeholderColor: "#f39c12" },
          { id: "img008", name: "receipt_005.png",   time: "14:55:44", transactionNo: "TX_005", size: "139KB", placeholderColor: "#3498db" },
        ],
      },
    ],
  },
  {
    id: "t2",
    name: "POS端末-02",
    ip: "192.168.1.102",
    monitoring: "on",
    online: "online",
    dateFolders: [
      {
        date: "2024-01-15",
        transactions: [
          {
            id: "tx020", no: "TX_001", time: "09:45:11",
            items: [
              {
                id: "tx020-log", name: "transaction.log", type: "text",
                content: "取引開始: 2024-01-15 09:45:11\n端末ID: POS-02\nオペレータ: 003\n\n[売上登録]\n商品コード: 4902345678901\n商品名: サンプル商品B\n単価: 1500\n数量: 1\n小計: 1500\n\n[合計]\n税抜: 1500\n消費税(10%): 150\n税込合計: 1650\n\n取引終了: 2024-01-15 09:45:28",
              },
            ],
          },
        ],
        images: [
          { id: "img020", name: "receipt_001.png", time: "09:45:28", transactionNo: "TX_001", size: "135KB", placeholderColor: "#27ae60" },
        ],
      },
    ],
  },
  {
    id: "t3",
    name: "POS端末-03",
    ip: "192.168.1.103",
    monitoring: "off",
    online: "offline",
    dateFolders: [],
  },
];
