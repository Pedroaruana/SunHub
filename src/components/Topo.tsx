import { useNavigate } from 'react-router'
import { useTexto } from '../hooks/useTexto.ts'

type Props = {
  readonly estado?: string
  readonly comVoltar?: boolean
  readonly aoAbrirMenu: () => void
}

export const Topo = ({ estado, comVoltar = true, aoAbrirMenu }: Props) => {
  const t = useTexto()
  const navegar = useNavigate()

  return (
    <div className="absolute inset-x-5 top-[max(1.4rem,env(safe-area-inset-top))] z-[5] flex items-center gap-2.5">
      {comVoltar && (
        <button
          type="button"
          onClick={() => navegar(-1)}
          aria-label={t.comum.voltar}
          className="flex shrink-0 py-1 pr-2"
        >
          <svg
            viewBox="0 0 9 15"
            fill="none"
            className="h-[15px] w-[9px]"
            aria-hidden="true"
          >
            <path
              d="M7.5 1 L1.5 7.5 L7.5 14"
              stroke="#eef3fb"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      <span className="flex flex-1 items-center gap-2 font-mono text-[8.5px] tracking-[0.18em] text-[#dce8f8] [text-shadow:0_1px_8px_rgba(0,0,0,.9)]">
        <i className="pulso relative size-[5px] shrink-0 rounded-full bg-[#cfe2fa]" />
        {estado ?? t.comum.proximaPassagem}
      </span>

      <button
        type="button"
        onClick={aoAbrirMenu}
        aria-label={t.menu.abrir}
        className="flex flex-col items-end gap-1 px-0.5 py-1.5"
      >
        <i className="block h-px w-5 bg-[#eef3fb]" />
        <i className="block h-px w-5 bg-[#eef3fb]" />
        <i className="block h-px w-3 bg-[#eef3fb]" />
      </button>
    </div>
  )
}
