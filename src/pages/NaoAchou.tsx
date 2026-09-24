import { useEffect } from 'react'
import { Link } from 'react-router'
import { Tela } from '../components/Tela.tsx'
import { useTexto } from '../hooks/useTexto.ts'

export const NaoAchou = () => {
  const t = useTexto()

  // pagina de erro nao entra em indice de busca
  useEffect(() => {
    const tag = document.createElement('meta')
    tag.name = 'robots'
    tag.content = 'noindex'
    document.head.appendChild(tag)
    return () => tag.remove()
  }, [])

  return (
    <Tela estado={t.naoAchou.codigo}>
      <div className="px-6 pb-14 pt-24 text-center">
        <svg viewBox="0 0 200 200" className="mx-auto mb-8 size-[168px]" aria-hidden="true">
          <defs>
            <radialGradient id="coroa404" cx="50%" cy="50%" r="50%">
              <stop offset="54%" stopColor="#cfe0ff" stopOpacity=".2" />
              <stop offset="100%" stopColor="#cfe0ff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="96" fill="url(#coroa404)" />
          <circle
            cx="100"
            cy="100"
            r="58"
            fill="none"
            stroke="#e4eefc"
            strokeWidth="1.6"
            opacity=".8"
          />
          <circle cx="100" cy="100" r="56.5" fill="#03050a" />
        </svg>

        <p className="font-mono text-[9.5px] tracking-[0.24em] text-[#6d84a8]">
          {t.naoAchou.codigo}
        </p>
        <h1 className="mt-3 text-[27px] font-semibold tracking-tight text-[#eef3fb]">
          {t.naoAchou.titulo}
        </h1>
        <p className="mx-auto mt-3 max-w-[28ch] text-[13px] leading-relaxed text-[#93a4bd]">
          {t.naoAchou.texto}
        </p>

        <Link
          to="/"
          className="mt-9 block rounded-sm border border-[#3c536e] py-4 text-[13.5px] text-[#eef3fb]"
        >
          {t.comum.voltarAoInicio}
        </Link>
        <Link
          to="/area"
          className="mt-3 block rounded-sm border border-[#3c536e] py-4 text-[13.5px] text-[#eef3fb]"
        >
          {t.menu.marcar}
        </Link>

        <p className="mt-5 text-[11.5px] leading-relaxed text-[#64738c]">
          {t.comum.demonstracao}
        </p>
      </div>
    </Tela>
  )
}
