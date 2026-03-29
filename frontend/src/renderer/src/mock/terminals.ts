export type MonitoringStatus = "on" | "off";
export type OnlineStatus = "online" | "offline";
export type SectionType = "text" | "csv" | "json";

export type FileSection = {
  name: string;
  label: string;
  type: SectionType;
  value: string | Record<string, string>[] | object;
};

export type TransactionFile = {
  id: string;
  filename: string;
  display_name: string;
  order: number;
  data: FileSection[];
};

export type Transaction = {
  id: string;
  date: string;
  timestamp: string;
  files: TransactionFile[];
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
        date: "2026-03-21",
        transactions: [
          {
            id: "tx001",
            date: "2026-03-21",
            timestamp: "2026-03-21T09:12:34",
            files: [
              {
                id: "tx001-f1",
                filename: "file_a.dat",
                display_name: "ファイルA（テキスト・単一）",
                order: 1,
                data: [
                  {
                    name: "section_1",
                    label: "セクション1",
                    type: "text",
                    value: "Line 1: Sample text content\nLine 2: Another line\nLine 3: End of file",
                  },
                ],
              },
              {
                id: "tx001-f2",
                filename: "file_b.dat",
                display_name: "ファイルB（テキスト・複数）",
                order: 2,
                data: [
                  {
                    name: "section_1",
                    label: "セクション1",
                    type: "text",
                    value: "Section 1 line A\nSection 1 line B",
                  },
                  {
                    name: "section_2",
                    label: "セクション2",
                    type: "text",
                    value: "Section 2 line A\nSection 2 line B",
                  },
                ],
              },
              {
                id: "tx001-f3",
                filename: "file_c.dat",
                display_name: "ファイルC（CSV・単一）",
                order: 3,
                data: [
                  {
                    name: "section_1",
                    label: "セクション1",
                    type: "csv",
                    value: [
                      { col1: "val1-1", col2: "val1-2", col3: "val1-3" },
                      { col1: "val2-1", col2: "val2-2", col3: "val2-3" },
                      { col1: "val3-1", col2: "val3-2", col3: "val3-3" },
                    ],
                  },
                ],
              },
              {
                id: "tx001-f4",
                filename: "file_d.dat",
                display_name: "ファイルD（CSV・複数）",
                order: 4,
                data: [
                  {
                    name: "section_1",
                    label: "セクション1",
                    type: "csv",
                    value: [
                      { col1: "a1", col2: "a2" },
                      { col1: "a3", col2: "a4" },
                    ],
                  },
                  {
                    name: "section_2",
                    label: "セクション2",
                    type: "csv",
                    value: [
                      { col1: "b1", col2: "b2" },
                      { col1: "b3", col2: "b4" },
                    ],
                  },
                ],
              },
              {
                id: "tx001-f5",
                filename: "file_e.dat",
                display_name: "ファイルE（JSON・単一）",
                order: 5,
                data: [
                  {
                    name: "section_1",
                    label: "セクション1",
                    type: "json",
                    value: { key1: "value1", key2: 42, key3: true, key4: null },
                  },
                ],
              },
              {
                id: "tx001-f6",
                filename: "file_f.dat",
                display_name: "ファイルF（JSON・複数）",
                order: 6,
                data: [
                  {
                    name: "section_1",
                    label: "セクション1",
                    type: "json",
                    value: { type: "section1", items: [1, 2, 3] },
                  },
                  {
                    name: "section_2",
                    label: "セクション2",
                    type: "json",
                    value: { type: "section2", items: [4, 5, 6] },
                  },
                ],
              },
            ],
          },
          {
            id: "tx002",
            date: "2026-03-21",
            timestamp: "2026-03-21T10:30:22",
            files: [
              {
                id: "tx002-f1",
                filename: "file_a.dat",
                display_name: "ファイルA",
                order: 1,
                data: [
                  {
                    name: "section_1",
                    label: "セクション1",
                    type: "text",
                    value: "Transaction 002 content",
                  },
                ],
              },
            ],
          },
          {
            id: "tx003",
            date: "2026-03-21",
            timestamp: "2026-03-21T11:00:00",
            files: [],
          },
        ],
        images: [
          { id: "img001", name: "capture_001.png", time: "09:12:51", transactionNo: "tx001", size: "142KB", placeholderColor: "#4f8ef7" },
          { id: "img002", name: "capture_002.png", time: "10:30:45", transactionNo: "tx002", size: "138KB", placeholderColor: "#e87c4e" },
        ],
      },
      {
        date: "2026-03-22",
        transactions: [
          {
            id: "tx010",
            date: "2026-03-22",
            timestamp: "2026-03-22T09:00:00",
            files: [
              {
                id: "tx010-f1",
                filename: "file_a.dat",
                display_name: "ファイルA",
                order: 1,
                data: [
                  {
                    name: "section_1",
                    label: "セクション1",
                    type: "csv",
                    value: [
                      { col1: "c1", col2: "c2" },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        images: [],
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
        date: "2026-03-21",
        transactions: [
          {
            id: "tx020",
            date: "2026-03-21",
            timestamp: "2026-03-21T09:45:11",
            files: [
              {
                id: "tx020-f1",
                filename: "file_a.dat",
                display_name: "ファイルA",
                order: 1,
                data: [
                  {
                    name: "section_1",
                    label: "セクション1",
                    type: "text",
                    value: "Terminal 02 transaction content",
                  },
                ],
              },
            ],
          },
        ],
        images: [
          { id: "img020", name: "capture_001.png", time: "09:45:28", transactionNo: "tx020", size: "135KB", placeholderColor: "#27ae60" },
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
