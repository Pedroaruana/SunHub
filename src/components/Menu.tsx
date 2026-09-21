import { Link } from 'react-router'
import { useTexto } from '../hooks/useTexto.ts'
import { IDIOMAS, NOME_DO_IDIOMA, useIdioma } from '../i18n/index.ts'

type Props = {
  readonly aberto: boolean
  readonly aoFechar: () => void
}

export const Menu = ({ aberto, aoFechar }: Props) => {
  const t = useTexto()
  const idioma = useIdioma((e) => e.idioma)
  const trocar = useIdioma((e) => e.trocar)

  const destinos = [
    ['/area', t.menu.marcar],
    ['/pacotes', t.menu.pacotes],
    ['/', t.menu.comoFunciona],
    ['/privacidade', t.menu.privacidade],
    ['/termos', t.menu.termos],
    ['/cookies', t.menu.cookies]
  ] as const

  return (
    <div
      className={`absolute inset-0 z-10 flex flex-col bg-[#03050af7] px-6 py-6 backdrop-blur-lg transition-opacity duration-200 ${
        aberto ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
      aria-hidden={!aberto}
    >
      <header className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-[0.3em] text-[#eef3fb]">
          {t.marca}
        </span>
        <button
          type="button"
          onClick={aoFechar}
          aria-label={t.menu.fechar}
          className="px-1.5 text-2xl leading-none text-[#9db1cc]"
        >
          &times;
        </button>
      </header>

      <nav className="mt-10 flex flex-col">
        {destinos.map(([para, nome], i) => (
          <Link
            key={para + nome}
            to={para}
            onClick={aoFechar}
            tabIndex={aberto ? 0 : -1}
            className="border-b border-[#16233a] py-4 text-xl font-medium text-[#e4ebf6]"
          >
            <span className="mb-1 block font-mono text-[9px] tracking-[0.18em] text-[#5f7a9c]">
              {String(i + 1).padStart(2, '0')}
            </span>
            {nome}
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t border-[#16233a] pt-5">
        <p className="font-mono text-[8.5px] tracking-[0.22em] text-[#6d84a8]">
          {t.menu.idioma}
        </p>
        <div className="mt-3 flex gap-px border border-[#22334a] bg-[#22334a]">
          {IDIOMAS.map((cada) => (
            <button
              key={cada}
              type="button"
              onClick={() => trocar(cada)}
              tabIndex={aberto ? 0 : -1}
              aria-pressed={idioma === cada}
              className={`flex-1 py-3 text-[13px] ${
                idioma === cada
                  ? 'bg-[#dfe9f8] font-semibold text-[#06101d]'
                  : 'bg-[#070d17] text-[#8b9cb6]'
              }`}
            >
              {NOME_DO_IDIOMA[cada]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
