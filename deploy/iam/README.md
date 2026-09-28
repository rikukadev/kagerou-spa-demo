# CI ロールの権限

`kagerou-spa-demo-github-actions` に attach する最小権限ポリシー。

## これは生成物

手で編集しない。`kagerou iam-policy` が出したものをそのまま置いている。

```bash
kagerou iam-policy --config kagerou.yaml \
  --base-bucket kagerou-base-spa-demo-199410355960 > deploy/iam/ci-policy.json
```

`--base-bucket` を渡すのは、static driver がビルド成果物を preview base バケットへ
同期するため。渡さないと S3 の権限が出ず、`up` が 403 で落ちる。

## 適用

```bash
aws iam put-role-policy --role-name kagerou-spa-demo-github-actions \
  --policy-name spademo-deploy --policy-document file://deploy/iam/ci-policy.json
```

## 以前は AdministratorAccess だった

このロールは旧 `kagerou-setup.sh` で作られ、**`AdministratorAccess` が attach された
まま**だった。プレビュー環境を作るだけの CI が admin を持っている状態で、
`tag:GetResources` が無いのに reap が通っていたのも「admin だから」だった
(権限の問題が起きなかったのではなく、広すぎて起きようがなかった)。

## 実環境とずれていないか確かめる

```bash
kagerou iam-policy --config kagerou.yaml \
  --base-bucket kagerou-base-spa-demo-199410355960 \
  --check-role kagerou-spa-demo-github-actions
```

**このファイルを直すだけでは実環境は変わらない。** 生成器を直す・ファイルを更新する・
実ロールに適用する、の 3 つは別の操作で、最後を忘れると実行時に 403 で気づくことになる
(rikukadev/kagerou#230)。
