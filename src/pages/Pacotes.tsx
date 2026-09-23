import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { Tela } from '../components/Tela.tsx'
import { useOrcamentos } from '../hooks/useOrcamentos.ts'
import { useTexto } from '../hooks/useTexto.ts'
import { useIdioma } from '../i18n/index.ts'
import { salvarArquivo } from '../lib/aparelho.ts'
import { dataHora, dinheiro, numero, preencher } from '../lib/formato.ts'

export const Pacotes = () => {
  const t = useTexto()
  const idioma = useIdioma((e) => e.idioma)
  const lista = useOrcamentos((e) => e.lista)
  const apagarUm = useOrcamentos((e) => e.apagarUm)

  const [aApagar, setAApagar] = useState<string | null>(null)
  const dialogo = useRef<HTMLDialogElement>(null)

  const pedirConfirmacao = (protocolo: string) => {
    setAApagar(protocolo)
    dialogo.current?.showModal()
  }

  const confirmar = () => {
    if (aApagar) apagarUm(aApagar)
    setAApagar(null)
    dialogo.current?.close()
  }

  const exportar = () => {
    salvarArquivo('sunhub-meus-pacotes.json', JSON.stringify(lista, null, 2))
  }

  return (
    <Tela estado={t.pacotes.passo}>
      <div className="flex min-h-dvh flex-col px-6 pb-14 pt-24">
        <p className="font-mono text-[8.5px] tracking-[0.22em] text-[#6d84a8]">
          {t.pacotes.passo}
        </p>
        <h1 className="mt-2 text-[26px] font-semibold leading-tight tracking-tight text-[#eef3fb]">
          {t.pacotes.titulo}
        </h1>
        {lista.length > 0 && (
          <p className="mt-3 text-[13px] leading-relaxed text-[#8b9cb6]">
            {t.pacotes.resumo}
          </p>
        )}

        {lista.length > 0 ? (
          <ul className="mt-6">
            {lista.map((v) => (
              <li
                key={v.protocolo}
                className="border-t border-[#1b2a40] py-4 last:border-b"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-[13px] tracking-wide text-[#e4ebf6]">
                    {v.protocolo}
                  </span>
                  <span className="whitespace-nowrap font-mono text-[15px] text-[#eef3fb]">
                    {dinheiro(idioma, v.preco)}
                  </span>
                </div>
                <p className="mt-1.5 font-mono text-[9.5px] tracking-[0.1em] text-[#5f7a9c]">
                  {preencher(t.contrato.emitido, {
                    quando: dataHora(idioma, new Date(v.quando))
                  })}
                </p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-[#8b9cb6]">
                  {preencher(t.pacotes.detalhe, {
                    ha: numero(idioma, v.hectares, 1),
                    min: v.minutosPorNoite,
                    noites:
                      v.noites === 1
                        ? t.pacotes.umaNoite
                        : preencher(t.pacotes.varias, { n: v.noites }),
                    kwh: numero(idioma, v.kwh, 1)
                  })}
                </p>
                <button
                  type="button"
                  onClick={() => pedirConfirmacao(v.protocolo)}
                  className="pt-1.5 text-xs text-[#7d8fa8] underline underline-offset-2"
                >
                  {t.pacotes.apagar}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="my-auto py-10 text-center">
            <svg
              viewBox="0 0 76 76"
              fill="none"
              className="mx-auto mb-5 size-[76px]"
              aria-hidden="true"
            >
              <circle cx="38" cy="38" r="26" stroke="#2c3f60" strokeWidth="1.5" />
              <path d="M38 12 A26 26 0 0 1 38 64 Z" fill="#131e30" />
              <circle
                cx="38"
                cy="38"
                r="37"
                stroke="#1b2a40"
                strokeWidth="1"
                strokeDasharray="3 6"
              />
            </svg>
            <h2 className="text-[19px] font-semibold text-[#e4ebf6]">
              {t.pacotes.vazioTitulo}
            </h2>
            <p className="mt-2.5 text-[13px] leading-relaxed text-[#7f90a9]">
              {t.pacotes.vazioTexto}
            </p>
          </div>
        )}

        <div className="mt-7">
          <Link
            to="/area"
            className="block rounded-sm bg-[#dfe9f8] py-4 text-center text-[13.5px] font-bold text-[#06101d]"
          >
            {t.pacotes.marcarArea}
          </Link>
          {lista.length > 0 && (
            <button
              type="button"
              onClick={exportar}
              className="mt-2.5 block w-full rounded-sm border border-[#3c536e] py-4 text-[13.5px] text-[#eef3fb]"
            >
              {t.pacotes.exportar}
            </button>
          )}
          <p className="mt-4 text-center text-[11.5px] leading-relaxed text-[#64738c]">
            {t.comum.demonstracao}
          </p>
        </div>
      </div>

      <dialog
        ref={dialogo}
        className="w-[300px] rounded-sm border border-[#2c3f60] bg-[#070d17] p-5 text-[#e4ebf6] backdrop:bg-[#020409b8]"
      >
        <h2 className="text-base font-semibold">{t.pacotes.confirmarTitulo}</h2>
        <p className="mt-2.5 text-[12.5px] leading-relaxed text-[#93a4bd]">
          {preencher(t.pacotes.confirmarTexto, { protocolo: aApagar ?? '' })}
        </p>
        <div className="mt-4 flex gap-2.5">
          <button
            type="button"
            onClick={() => {
              setAApagar(null)
              dialogo.current?.close()
            }}
            className="flex-1 rounded-sm border border-[#3c536e] py-3 text-[13px] text-[#c5d3e6]"
          >
            {t.pacotes.manter}
          </button>
          <button
            type="button"
            onClick={confirmar}
            className="flex-1 rounded-sm bg-[#e8d3d3] py-3 text-[13px] font-bold text-[#2a1010]"
          >
            {t.pacotes.confirmarApagar}
          </button>
        </div>
      </dialog>
    </Tela>
  )
}
