---
id: TASK-005
title: Transaction usecase スケルトン実装
status: closed
---

## 概要

Transaction閲覧APIのusecase以降をスケルトンで実装する。
blueprintのスタブをusecaseに差し替えるところまでを行う。

## 作業順

- [x] `domain/transaction/transaction.py` — Transaction, TransactionFile, Section, FileContent
- [x] `usecase/transaction/port.py` — TransactionRepository (ABC)
- [x] `usecase/transaction/transaction_usecase.py` — TransactionUsecase
- [x] `tests/unit/` — usecaseのユニットテスト（Fake使用）
- [x] `infra/repository/local_transaction_repository.py` — LocalTransactionRepository スケルトン
- [x] `api/app.py` — TransactionUsecase を注入
- [x] `api/terminal/blueprint.py` — スタブをusecaseに差し替え

## 備考

6・7はinfra実装フェーズで行う（LocalTransactionRepositoryが実装されてから差し替える）

## 設計参照

- `docs/design/transaction.md` — レイヤー構成図
- `docs/decisions/ADR-001-transaction-usecase-design.md` — 設計判断
- `tests/CLAUDE.md` — テスト方針
