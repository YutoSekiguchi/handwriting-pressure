# 卒論システム

**〜概要〜**

- 自信度や重要度に応じて筆圧に強弱をつけることによって重要度や自信度に応じたUndo/Redoを行えるシステムの実現

**システム構成**

- 開発環境
  - Docker
    - Docker上でNext.js + TypeScript，Go，MySQL，PHPMyAdminを動かしてる
- フロントエンド
  - [Next.js](https://nextjs.org/)
    - version: ^12.2.5
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/)
- バックエンド
  - [Go](https://golang.org/)
    - フレームワーク：[Echo](https://echo.labstack.com/)
- データベース
  - MySQL
    - 実験用とその他でテーブルを変える可能性あり

### 設定ファイル
- `./.env`
  - ```
    MYSQL_USER=note
    MYSQL_PASSWORD=note++1234 // 本番環境ではここを変更
    MYSQL_ROOT_PASSWORD=note++1234 // 本番環境ではここを変更
    MYSQL_HOST=tcp(mysql:3306)
    MYSQL_DATABASE=pressure_note_db
    PMA_HOST=mysql
    PMA_USER=note // 本番環境ではこの行を書かない
    PMA_PASSWORD=note++1234 // 本番環境ではこの行を書かない
    MODE=exam // 実験用はexam
    ```

- `./client/.env`
  - ```
    API_URL_DEV=http://localhost:7151 // 開発環境のAPIのURL
    API_URL_PROD=https://xxx.com/api // 本番環境のAPIのURL
    ```

### 開発で使用するポート一覧

|     | port | 説明                           | docker container 名 |
| :-: | ---- | :----------------------------- | ------------------- |
|     | 7150 | クライアント, Next.js          | note-client         |
|     | 7151 | API, Go                        | note-api            |
|     | 7152 | データベース，   MySQL         | note-mysql          |
|     | 7153 | データベースの操作, PHPMyAdmin | note-phpmyadmin     |

> 今は開発環境ではクライアントは`npm run dev`を実行してdocker上では実行しない方法の方がいいかも
  > `npm run dev`での実行だとhttp://localhost:3000/api/〜は働かないので注意.（http://localhost:7151）にアクセスしよう 