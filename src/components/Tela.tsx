import { type ReactNode, useState } from 'react'
import { useTexto } from '../hooks/useTexto.ts'
import { Menu } from './Menu.tsx'
import { Topo } from './Topo.tsx'

type Props = {
  readonly children: ReactNode
  readonly estado?: string
  readonly comVoltar?: boolean
}

// no celular a moldura vira a tela inteira. no desktop ela fica centrada com
// largura de telefone, que e onde este app vive de verdade
export const Tela = ({ children, estado, comVoltar }: Props) => {
  const [menuAberto, setMenuAberto] = useState(false)
  const t = useTexto()

  return (
    <div className="flex min-h-dvh justify-center bg-[#1b1d22] sm:p-8">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:z-20 focus:m-3 focus:bg-[#dfe9f8] focus:px-4 focus:py-2 focus:text-sm focus:text-[#06101d]"
      >
        {t.comum.pularParaConteudo}
      </a>

      <div className="relative w-full overflow-hidden bg-[#03050a] sm:w-[390px] sm:rounded-[28px] sm:shadow-[0_22px_60px_rgba(0,0,0,.65)]">
        <Topo
          estado={estado}
          comVoltar={comVoltar}
          aoAbrirMenu={() => setMenuAberto(true)}
        />
        <Menu aberto={menuAberto} aoFechar={() => setMenuAberto(false)} />
        <main id="conteudo">{children}</main>
      </div>
    </div>
  )
}
