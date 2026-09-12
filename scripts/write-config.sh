#!/usr/bin/env sh
# 環境ごとの config.json を dist に書く。kagerou の post_up から呼ばれ、
# KAGEROU_* が環境変数で届く(CONTRACT §7)。
set -eu
: "${KAGEROU_NAME:?}"
cat > dist/config.json <<JSON
{
  "env": "${KAGEROU_NAME}",
  "apiBaseUrl": "https://api.github.com/repos/rikukadev/kagerou",
  "builtAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "commit": "${GITHUB_SHA:-local}"
}
JSON
echo "wrote dist/config.json for ${KAGEROU_NAME}"
