# Source Directory Structure

## Overview

このディレクトリは、Feature-Sliced Design (FSD) アーキテクチャに従って構成されています。FSDは、大規模なフロントエンドアプリケーションを保守しやすく、拡張しやすい構造に整理するための設計手法です。

## Architecture Layers

このプロジェクトは以下の6つのレイヤーで構成されています：

```
src/
├── app/          # App Layer - Next.jsルーティング層
├── pages/         # Pages Layer - ページ単位のコンポーネント
├── widgets/       # Widgets Layer - 複合UIブロック
├── features/      # Features Layer - ユーザー機能
├── entities/      # Entities Layer - ビジネスエンティティ
└── shared/        # Shared Layer - 共通部品
```

## Layer Dependencies

各レイヤーは以下の依存関係に従います：

```
app → pages → widgets → features → entities → shared
```

上位のレイヤーは下位のレイヤーのみを参照でき、逆方向の参照は禁止されています。これにより、循環依存を防ぎ、コードの保守性を向上させます。

## Directory Structure Details

各レイヤーの詳細な責務については、各ディレクトリのREADME.mdを参照してください：

- [app/README.md](./app/README.md) - App Layerの責務
- [pages/README.md](./pages/README.md) - Pages Layerの責務
- [widgets/README.md](./widgets/README.md) - Widgets Layerの責務
- [features/README.md](./features/README.md) - Features Layerの責務
- [entities/README.md](./entities/README.md) - Entities Layerの責務
- [shared/README.md](./shared/README.md) - Shared Layerの責務

## Benefits of FSD

- **明確な責務分離**: 各レイヤーが明確な役割を持ち、コードの目的が理解しやすい
- **再利用性**: 下位レイヤーのコンポーネントは上位レイヤーで再利用可能
- **テスト容易性**: 各レイヤーを独立してテストできる
- **スケーラビリティ**: 新しい機能を追加する際の影響範囲が限定的
- **チーム開発**: 複数の開発者が同時に作業してもコンフリクトが少ない
