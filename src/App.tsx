import { useEffect, useState } from 'react'
import './App.css'

// 環境ごとに中身が変わる設定は、ビルド成果物に焼き込まず config.json で配る。
// kagerou の post_up フックが環境ごとに書き出す(static driver はビルド時に
// 環境を知らないので、この分離が要る)。
type Config = {
  env: string
  apiBaseUrl: string
  builtAt: string
  commit: string
}

type ApiState = { status: 'idle' | 'loading' | 'ok' | 'error'; detail: string }

export default function App() {
  const [config, setConfig] = useState<Config | null>(null)
  const [configError, setConfigError] = useState<string>('')
  const [api, setApi] = useState<ApiState>({ status: 'idle', detail: '' })

  useEffect(() => {
    fetch('config.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then(setConfig)
      .catch((e) => setConfigError(String(e)))
  }, [])

  const callApi = async () => {
    if (!config?.apiBaseUrl) return
    setApi({ status: 'loading', detail: '' })
    try {
      const res = await fetch(config.apiBaseUrl, { cache: 'no-store' })
      const body = await res.text()
      setApi({
        status: res.ok ? 'ok' : 'error',
        detail: `HTTP ${res.status} · ${body.slice(0, 120)}`,
      })
    } catch (e) {
      // CORS 拒否もここに落ちる(プレビュー環境で最初に踏む壁)
      setApi({ status: 'error', detail: String(e) })
    }
  }

  return (
    <main>
      <h1>kagerou SPA demo</h1>
      <p className="lead">
        compute を持たない環境の確認用。ビルド成果物は共有 CloudFront 配下の
        S3 プレフィックスに置かれ、環境固有の値は <code>config.json</code> で届く。
      </p>

      <section>
        <h2>この環境</h2>
        {configError && (
          <p className="bad">
            config.json を読めませんでした({configError})。
            kagerou 経由でないか、post_up が走っていません。
          </p>
        )}
        {config && (
          <table>
            <tbody>
              <tr>
                <th>環境名</th>
                <td>
                  <code>{config.env}</code>
                </td>
              </tr>
              <tr>
                <th>URL</th>
                <td>
                  <code>{location.origin}</code>
                </td>
              </tr>
              <tr>
                <th>commit</th>
                <td>
                  <code>{config.commit}</code>
                </td>
              </tr>
              <tr>
                <th>built at</th>
                <td>
                  <code>{config.builtAt}</code>
                </td>
              </tr>
            </tbody>
          </table>
        )}
        <p className="hint">
          URL のサブドメインと環境名が一致していれば、取り違えや古い成果物の
          使い回しではない。
        </p>
      </section>

      <section>
        <h2>外部 API</h2>
        <p>
          呼び先: <code>{config?.apiBaseUrl ?? '(config 待ち)'}</code>
        </p>
        <button onClick={callApi} disabled={!config?.apiBaseUrl || api.status === 'loading'}>
          {api.status === 'loading' ? '呼び出し中…' : '呼んでみる'}
        </button>
        {api.status !== 'idle' && (
          <p className={api.status === 'ok' ? 'good' : 'bad'}>{api.detail}</p>
        )}
        <p className="hint">
          環境ごとに呼び先を差し替えられるのが config.json 方式の利点。
          失敗するときは CORS の許可元に この URL が入っているかを疑う。
        </p>
      </section>
    </main>
  )
}
