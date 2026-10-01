import { type ReactNode, useState } from 'react'
import { useTexto } from '../hooks/useTexto.ts'
import { campoDeEstrelas } from '../lib/estrelas.ts'
import { Menu } from './Menu.tsx'
import { Topo } from './Topo.tsx'

type Props = {
  readonly children: ReactNode
  readonly estado?: string
  readonly comVoltar?: boolean
}

const CEU_L = 1600
const CEU_A = 1000
const CEU = campoDeEstrelas(73, CEU_L, CEU_A, 220)

// o ceu em volta do aparelho so existe no desktop. no celular a tela ja ocupa
// tudo e isto seria peso a toa
const Ceu = () => (
  <svg
    viewBox={`0 0 ${CEU_L} ${CEU_A}`}
    preserveAspectRatio="xMidYMid slice"
    className="pointer-events-none absolute inset-0 hidden size-full sm:block"
    aria-hidden="true"
    shapeRendering="optimizeSpeed"
  >
    {CEU.map((e) => (
      <circle
        key={`${e.x}-${e.y}-${e.r}`}
        cx={e.x}
        cy={e.y}
        r={e.r}
        fill={e.cor}
        opacity={e.opacidade}
      />
    ))}
  </svg>
)

// no celular a moldura vira a tela inteira. no desktop ela fica centrada com
// largura de telefone, que e onde este app vive de verdade, flutuando no mesmo
// ceu da tela inicial. o aro e fino e sem entalhe: e um aparelho, nao a copia
// de um modelo que existe
export const Tela = ({ children, estado, comVoltar }: Props) => {
  const [menuAberto, setMenuAberto] = useState(false)
  const t = useTexto()

  return (
    <div className="relative flex min-h-dvh justify-center bg-[#05070c] sm:items-center sm:p-10">
      <Ceu />

      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:z-20 focus:m-3 focus:bg-[#dfe9f8] focus:px-4 focus:py-2 focus:text-sm focus:text-[#06101d]"
      >
        {t.comum.pularParaConteudo}
      </a>

      <div className="relative w-full sm:w-[414px] sm:rounded-[46px] sm:bg-[#0b1018] sm:p-3 sm:shadow-[0_40px_120px_rgba(0,0,0,.75)] sm:ring-1 sm:ring-[#28374a]">
        {/* no celular a tela ocupa a janela inteira. no desktop ela ganha
            altura fixa e rola por dentro, senao o conteudo estica o aparelho e
            ele sai pra fora da tela.
            
            o min-h-dvh do celular nao e enfeite: as telas de mapa posicionam
            tudo de forma absoluta e nao empurram altura. sem ele a tela encolhe
            pra zero e o canvas do globo nasce com height 0 */}
        <div className="telaRolante relative min-h-dvh overflow-hidden bg-[#03050a] sm:h-[min(844px,calc(100dvh-104px))] sm:min-h-0 sm:overflow-y-auto sm:rounded-[34px] sm:ring-1 sm:ring-[#101823]">
          <Topo
            estado={estado}
            comVoltar={comVoltar}
            aoAbrirMenu={() => setMenuAberto(true)}
          />
          <Menu aberto={menuAberto} aoFechar={() => setMenuAberto(false)} />
          <main id="conteudo">{children}</main>
        </div>
      </div>
    </div>
  )
}
