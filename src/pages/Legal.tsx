import { Link } from 'react-router'
import { Tela } from '../components/Tela.tsx'
import { useTexto } from '../hooks/useTexto.ts'

type Secao = { readonly titulo: string; readonly textos: readonly string[] }
type Chave = { readonly chave: string; readonly texto: string }

type Props = {
  readonly qual: 'privacidade' | 'termos' | 'cookies'
}

export const Legal = ({ qual }: Props) => {
  const t = useTexto()
  const pagina = t.legais[qual]
  const chaves: readonly Chave[] = qual === 'cookies' ? t.legais.cookies.chaves : []

  return (
    <Tela estado={pagina.passo}>
      <div className="px-6 pb-14 pt-24">
        <p className="font-mono text-[8.5px] tracking-[0.22em] text-[#6d84a8]">
          {pagina.passo}
        </p>
        <h1 className="mt-2 text-[27px] font-semibold leading-tight tracking-tight text-[#eef3fb]">
          {pagina.titulo}
        </h1>
        <p className="mt-3 font-mono text-[9.5px] tracking-[0.12em] text-[#5f7a9c]">
          {t.legais.atualizado}
        </p>
        <p className="mt-5 text-sm leading-relaxed text-[#b4c3d8]">{pagina.abertura}</p>

        {(pagina.secoes as readonly Secao[]).map((secao) => (
          <section key={secao.titulo} className="mt-8">
            <h2 className="border-b border-[#1b2a40] pb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#6d84a8]">
              {secao.titulo}
            </h2>
            {secao.textos.map((texto) => (
              <p
                key={texto.slice(0, 40)}
                className="mt-3 text-[13px] leading-relaxed text-[#93a4bd]"
              >
                {texto}
              </p>
            ))}
          </section>
        ))}

        {chaves.length > 0 && (
          <section className="mt-8">
            <h2 className="border-b border-[#1b2a40] pb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#6d84a8]">
              {t.legais.cookies.guardado}
            </h2>
            <dl className="mt-3 border-t border-[#1b2a40]">
              {chaves.map((linha) => (
                <div key={linha.chave} className="border-b border-[#1b2a40] py-3">
                  <dt className="font-mono text-xs text-[#d5e4f7]">{linha.chave}</dt>
                  <dd className="mt-1.5 text-xs leading-relaxed text-[#7f90a9]">
                    {linha.texto}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <Link
          to="/"
          className="mt-8 block rounded-sm border border-[#3c536e] py-4 text-center text-[13.5px] text-[#eef3fb]"
        >
          {t.comum.voltarAoInicio}
        </Link>
        <p className="mt-4 text-center text-[11.5px] leading-relaxed text-[#64738c]">
          {t.comum.demonstracao}
        </p>
      </div>
    </Tela>
  )
}
