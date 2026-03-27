export type SavedFileCategory = "transaction" | "image" | "log";

export type SavedFile = {
  id: string;
  name: string;
  category: SavedFileCategory;
  source: string;
  savedAt: string;
  content: string;
};

export type TestFolder = {
  id: string;
  name: string;
  children: TestFolder[];
  savedFiles?: SavedFile[];
};

export type Sheet = {
  id: string;
  name: string;
  folders: TestFolder[];
};

export type Feature = {
  id: string;
  name: string;
  sheets: Sheet[];
};

export type TestSpec = {
  id: string;
  fileName: string;
  features: Feature[];
};

export const mockTestSpec: TestSpec = {
  id: "spec1",
  fileName: "結合テスト仕様書_v3.xlsx",
  features: [
    {
      id: "f1",
      name: "売上処理",
      sheets: [
        {
          id: "f1s1",
          name: "通常売上",
          folders: [
            {
              id: "f1s1-1", name: "1. バーコードスキャン", children: [
                {
                  id: "f1s1-1-1", name: "1.1 正常系", children: [],
                  savedFiles: [
                    { id: "sf1", name: "transaction.log", category: "transaction", source: "POS-01 / TX_001", savedAt: "2024-01-15 09:12", content: "取引開始: 2024-01-15 09:12:34\n端末ID: POS-01\nオペレータ: 001\n\n[売上登録]\n商品コード: 4901234567890\n商品名: サンプル商品A\n単価: 980\n数量: 2\n小計: 1960\n\n[合計]\n税抜: 1960\n消費税(10%): 196\n税込合計: 2156\n\n取引終了: 2024-01-15 09:12:51" },
                    { id: "sf2", name: "detail.csv", category: "transaction", source: "POS-01 / TX_001", savedAt: "2024-01-15 09:12", content: "商品コード,商品名,単価,数量,小計\n4901234567890,サンプル商品A,980,2,1960" },
                    { id: "sf3", name: "scan_error.log", category: "log", source: "POS-01 / TX_002", savedAt: "2024-01-15 10:31", content: "[WARN] 2024-01-15 10:31:02 バーコード読み取り失敗\nコード: E_SCAN_001\n試行回数: 3\n最終エラー: タイムアウト" },
                  ],
                },
                {
                  id: "f1s1-1-2", name: "1.2 読み取りエラー", children: [
                    {
                      id: "f1s1-1-2-1", name: "1.2.1 タイムアウト", children: [
                        { id: "f1s1-1-2-1-1", name: "1.2.1.1 リトライ成功", children: [] },
                        { id: "f1s1-1-2-1-2", name: "1.2.1.2 リトライ失敗", children: [] },
                      ],
                    },
                    { id: "f1s1-1-2-2", name: "1.2.2 コード不正", children: [] },
                    { id: "f1s1-1-2-3", name: "1.2.3 通信エラー", children: [] },
                  ],
                },
              ],
            },
            {
              id: "f1s1-2", name: "2. 合計処理", children: [
                {
                  id: "f1s1-2-1", name: "2.1 税込計算", children: [
                    { id: "f1s1-2-1-1", name: "2.1.1 10%課税", children: [] },
                    { id: "f1s1-2-1-2", name: "2.1.2 軽減税率8%", children: [] },
                    { id: "f1s1-2-1-3", name: "2.1.3 非課税", children: [] },
                  ],
                },
                {
                  id: "f1s1-2-2", name: "2.2 値引き適用", children: [
                    { id: "f1s1-2-2-1", name: "2.2.1 定率値引き", children: [] },
                    { id: "f1s1-2-2-2", name: "2.2.2 定額値引き", children: [] },
                  ],
                },
              ],
            },
            { id: "f1s1-3", name: "3. レシート印刷", children: [] },
          ],
        },
        {
          id: "f1s2",
          name: "まとめ買い割引",
          folders: [
            { id: "f1s2-1", name: "1. 割引条件判定", children: [] },
            { id: "f1s2-2", name: "2. 割引適用後合計", children: [] },
          ],
        },
      ],
    },
    {
      id: "f2",
      name: "返品処理",
      sheets: [
        {
          id: "f2s1",
          name: "当日返品",
          folders: [
            { id: "f2s1-1", name: "1. レシート照合", children: [] },
            { id: "f2s1-2", name: "2. 返金処理", children: [
              { id: "f2s1-2-1", name: "2.1 現金返金", children: [] },
              { id: "f2s1-2-2", name: "2.2 カード返金", children: [] },
            ]},
          ],
        },
        {
          id: "f2s2",
          name: "翌日以降返品",
          folders: [
            { id: "f2s2-1", name: "1. 管理者承認", children: [] },
            { id: "f2s2-2", name: "2. 返品登録", children: [] },
          ],
        },
      ],
    },
    {
      id: "f3",
      name: "日次締め処理",
      sheets: [
        {
          id: "f3s1",
          name: "日計集計",
          folders: [
            { id: "f3s1-1", name: "1. 売上集計", children: [] },
            { id: "f3s1-2", name: "2. 点検レポート", children: [] },
            { id: "f3s1-3", name: "3. 本締め", children: [] },
          ],
        },
      ],
    },
  ],
};
