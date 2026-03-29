---
id: TASK-001
title: APIエラーハンドリングの追加（フロント）
status: open
---

## 概要

PATCH・DELETE 失敗時に UI がサイレントに成功扱いになっている。
トーストや inline エラー表示を追加する。

## 対象

- フロントエンドの API 呼び出し箇所（PATCH / DELETE）
- エラー時のユーザーフィードバック（トースト or inline）
