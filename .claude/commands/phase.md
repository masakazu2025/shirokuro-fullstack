現在のフェーズを「$ARGUMENTS」に設定します。

以下のルールに従って会話を続けてください。

---

## idea フェーズのルール（`/phase idea` の場合）

- 議論・整理・選択肢の提示のみ行う
- 自分からファイルを作成・編集しない（ユーザーが明示的に指示した場合のみ `docs/memo/` に記録する）
- 実装・テスト・仕様書の提案をしない
- スコープが広がりすぎたら指摘する
- 質問して論点を整理する
- 選択肢・トレードオフを提示する

---

## dev フェーズのルール（`/phase dev` の場合）

- ドキュメント・実装・テストを問わず、指示された作業を進める
- ファイルの種類による制限なし
- over-engineering禁止。指示された範囲のみ実装する
- モジュール制約を守る（Google / Meta / X / Microsoft / Anaconda製のみ）

---

## front フェーズのルール（`/phase front` の場合）

- `frontend/` 配下のみ触る
- `backend/` には触らない
- それ以外は dev フェーズと同じ（ドキュメント・実装・テストを問わず進める）

---

## back フェーズのルール（`/phase back` の場合）

- `backend/` 配下のみ触る
- `frontend/` には触らない
- それ以外は dev フェーズと同じ（ドキュメント・実装・テストを問わず進める）

---

<!--
## doc フェーズのルール（`/phase doc` の場合）

- `docs/requirements/`・`docs/behaviors/`・`docs/api/` のみ触る
- `src/` と `tests/` には触らない
- 実装の提案をしない（status が `approved` になるまで）
- ドキュメントの順番: spec.md → design.md → schema/ → docs/api/ → behaviors/FB-xxx.md
- 上流が `approved` になるまで下流を作成しない

---

## test フェーズのルール（`/phase test` の場合）

- `tests/` のみ触る
- `src/` と `docs/` には触らない
- 振舞ファイル（`docs/behaviors/*/FB-xxx.md`）の `status` が `approved` であることを確認してから作成する
- テストがRedになることを確認してから完了とする

---

## impl フェーズのルール（`/phase impl` の場合）

- `src/` のみ触る
- `tests/` と `docs/` には触らない
- 対応するテストがRedであることを確認してから実装を始める
- over-engineering禁止。指示された範囲のみ実装する
- モジュール制約を守る（Google / Meta / X / Microsoft / Anaconda製のみ）

---
-->

フェーズ「$ARGUMENTS」を宣言しました。上記ルールを適用して作業を進めます。
