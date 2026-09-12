# kagerou-spa-demo

[kagerou](https://github.com/rikukadev/kagerou) の `static` driver の検証用アプリ。
**compute を持たない環境**(Vite + React の SPA)が、共有 CloudFront 配下の
S3 プレフィックスとして生えて消えることを確かめる。

## 何を確かめられるか

| 確認したいこと | 見る場所 |
|---|---|
| この URL は**その環境か**(取り違え・古い成果物) | 画面の環境名 + commit + built at |
| **環境固有の値**がビルド成果物と分離できているか | `config.json`(post_up が環境ごとに書く) |
| **https** で配れているか(S3 website だと http のまま) | URL のスキーム |
| 外部 API を**環境ごとに差し替え**られるか | 「呼んでみる」ボタン |

## 手元で

```bash
npm install && npm run dev     # config.json は public/ のローカル版が使われる
npm run build                  # dist/ を作る(kagerou が同期する対象)
```

## kagerou から

```bash
npm run build
kagerou up --name pr-1         # dist を s3://<base>/pr-1/ へ同期
kagerou url --name pr-1
kagerou down --name pr-1
```

環境 URL は `https://<name>.spa-demo.rikuka.dev`。preview base(共有 CloudFront +
ワイルドカード証明書 + DNS)はアプリごとに 1 回だけ作る。

## 関連

- [kagerou](https://github.com/rikukadev/kagerou) — ephemeral environments on AWS
- [kagerou-ssr-demo](https://github.com/rikukadev/kagerou-ssr-demo) — SSR を 1 Lambda で
- [kagerou-3tier-demo](https://github.com/rikukadev/kagerou-3tier-demo) — SPA + API + RDB
