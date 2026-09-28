import { Component, type ErrorInfo, type ReactNode } from 'react'
import { useTexto } from '../hooks/useTexto.ts'

// esta tela nao usa Tela nem Link de proposito. se quem quebrou foi o roteador,
// tudo que depende dele quebra junto e a tela de erro sumiria tambem. aqui e
// marcacao propria e um <a> de verdade, que funciona sem react nenhum de pe
const Aviso = () => {
  const t = useTexto()

  return (
    <div className="flex min-h-dvh justify-center bg-[#1b1d22] sm:p-8">
      <div className="w-full overflow-hidden bg-[#03050a] px-6 pb-14 pt-24 text-center sm:w-[390px] sm:rounded-[28px]">
        <svg viewBox="0 0 200 200" className="mx-auto mb-8 size-[168px]" aria-hidden="true">
          <defs>
            <radialGradient id="coroaErro" cx="50%" cy="50%" r="50%">
              <stop offset="54%" stopColor="#cfe0ff" stopOpacity=".16" />
              <stop offset="100%" stopColor="#cfe0ff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="96" fill="url(#coroaErro)" />
          {/* o anel do 404 e inteiro. aqui ele vem partido, que e a diferenca
              entre nao existir e ter quebrado no meio do caminho */}
          <circle
            cx="100"
            cy="100"
            r="58"
            fill="none"
            stroke="#e4eefc"
            strokeWidth="1.6"
            strokeDasharray="34 18"
            opacity=".7"
          />
          <circle cx="100" cy="100" r="56.5" fill="#03050a" />
        </svg>

        <p className="font-mono text-[9.5px] tracking-[0.24em] text-[#6d84a8]">
          {t.erro.codigo}
        </p>
        <h1 className="mt-3 text-[27px] font-semibold tracking-tight text-[#eef3fb]">
          {t.erro.titulo}
        </h1>
        <p
          role="alert"
          className="mx-auto mt-3 max-w-[30ch] text-[13px] leading-relaxed text-[#93a4bd]"
        >
          {t.erro.texto}
        </p>

        <button
          type="button"
          onClick={() => location.reload()}
          className="mt-9 block w-full rounded-sm bg-[#dfe9f8] py-4 text-[13.5px] font-bold text-[#06101d]"
        >
          {t.erro.recarregar}
        </button>
        <a
          href="/"
          className="mt-3 block rounded-sm border border-[#3c536e] py-4 text-[13.5px] text-[#eef3fb]"
        >
          {t.comum.voltarAoInicio}
        </a>

        <p className="mt-5 text-[11.5px] leading-relaxed text-[#64738c]">
          {t.comum.demonstracao}
        </p>
      </div>
    </div>
  )
}

type Props = { readonly children: ReactNode }
type Estado = { readonly caiu: boolean }

// a unica classe do projeto. react so entrega erro de renderizacao por
// componente de classe, nao existe hook que faca isso
export class Barreira extends Component<Props, Estado> {
  state: Estado = { caiu: false }

  static getDerivedStateFromError(): Estado {
    return { caiu: true }
  }

  componentDidCatch(erro: Error, info: ErrorInfo) {
    // log so em desenvolvimento. em producao nao sai nada, nem pro console nem
    // pra servico de fora, e o texto do erro nunca aparece pro usuario
    if (import.meta.env.DEV) {
      console.error('a tela quebrou ao desenhar', erro, info.componentStack)
    }
  }

  render() {
    return this.state.caiu ? <Aviso /> : this.props.children
  }
}
