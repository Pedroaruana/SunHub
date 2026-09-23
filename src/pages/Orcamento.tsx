import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Tela } from '../components/Tela.tsx'
import { REFLETORES_EM_ORBITA } from '../domain/orbita.ts'
import { orcar } from '../domain/preco.ts'
import { useFluxo } from '../hooks/useFluxo.ts'
import { novoProtocolo, useOrcamentos } from '../hooks/useOrcamentos.ts'
import { useTexto } from '../hooks/useTexto.ts'
import { useIdioma } from '../i18n/index.ts'
import { dataHora, dinheiro, numero, preencher } from '../lib/formato.ts'

const HECTARES_DE_DEMONSTRACAO = 12.4

export const Orcamento = () => {
  const t = useTexto()
  const idioma = useIdioma((e) => e.idioma)
  const navegar = useNavigate()
  const guardar = useOrcamentos((e) => e.guardar)

  const area = useFluxo((e) => e.area)
  const passagens = useFluxo((e) => e.passagensPorNoite)
  const noites = useFluxo((e) => e.noites)

  const [aceitou, setAceitou] = useState(false)
  const [emitido, setEmitido] = useState<{ protocolo: string; quando: Date } | null>(null)

  const hectares = area?.hectares ?? HECTARES_DE_DEMONSTRACAO
  const orcamento = orcar({ hectares, passagensPorNoite: passagens, noites })

  const linhas = [
    [t.contrato.linhas.area, `${numero(idioma, hectares, 1)} ha`, false],
    [t.contrato.linhas.luzPorNoite, `${orcamento.minutosPorNoite} min`, false],
    [t.contrato.linhas.refletores, `${passagens} / ${REFLETORES_EM_ORBITA}`, false],
    [t.contrato.linhas.noites, String(noites), false],
    [t.contrato.linhas.passagens, String(orcamento.passagensTotais), false],
    [t.contrato.linhas.energia, `${numero(idioma, orcamento.kwhTotal, 1)} kWh`, false],
    [t.contrato.linhas.tarifa, `${dinheiro(idioma, orcamento.tarifa)} / kWh`, false],
    [t.contrato.linhas.valor, dinheiro(idioma, orcamento.precoTotal), true]
  ] as const

  const emitir = () => {
    const quando = new Date()
    const protocolo = novoProtocolo(quando)
    guardar({
      protocolo,
      quando: quando.toISOString(),
      hectares,
      minutosPorNoite: orcamento.minutosPorNoite,
      passagensPorNoite: passagens,
      noites,
      kwh: orcamento.kwhTotal,
      preco: orcamento.precoTotal,
      tarifa: orcamento.tarifa
    })
    setEmitido({ protocolo, quando })
  }

  return (
    <Tela estado={t.contrato.passo}>
      <p className="border-b border-[#2c3f60] bg-[#1d2942] px-4 py-2.5 pt-[max(4.5rem,calc(env(safe-area-inset-top)+3.4rem))] text-center font-mono text-[9px] tracking-[0.18em] text-[#cfe0f7]">
        {t.contrato.tarja}
      </p>

      <div className="px-6 pb-14 pt-5">
        <p className="font-mono text-[8.5px] tracking-[0.22em] text-[#6d84a8]">
          {t.contrato.passo}
        </p>
        <h1 className="mt-2 text-[26px] font-semibold leading-tight tracking-tight text-[#eef3fb]">
          {emitido ? t.contrato.gerado : t.contrato.titulo}
        </h1>

        <p className="mt-7 font-mono text-[8.5px] tracking-[0.22em] text-[#6d84a8]">
          {t.contrato.resumo}
        </p>
        <dl className="mt-3 border-t border-[#1b2a40]">
          {linhas.map(([nome, valor, forte]) => (
            <div
              key={nome}
              className="flex items-baseline justify-between gap-3 border-b border-[#1b2a40] py-3"
            >
              <dt className="text-[13px] text-[#8b9cb6]">{nome}</dt>
              <dd
                className={`whitespace-nowrap font-mono ${
                  forte ? 'text-[17px] text-[#eef3fb]' : 'text-[13.5px] text-[#e4ebf6]'
                }`}
              >
                {valor}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-7 font-mono text-[8.5px] tracking-[0.22em] text-[#6d84a8]">
          {t.contrato.regras}
        </p>
        <ol className="mt-3">
          {t.contrato.texto.map((regra, i) => (
            <li
              key={regra.slice(0, 30)}
              className="relative pb-3.5 pl-8 text-[12.5px] leading-relaxed text-[#93a4bd]"
            >
              <span className="absolute left-0 top-0.5 font-mono text-[10px] text-[#5f7a9c]">
                {String(i + 1).padStart(2, '0')}
              </span>
              {regra}
            </li>
          ))}
        </ol>

        <label className="mt-4 flex items-start gap-3 border border-[#22334a] bg-[#070d17] p-3.5">
          <input
            type="checkbox"
            checked={aceitou}
            disabled={emitido !== null}
            onChange={(e) => setAceitou(e.target.checked)}
            className="mt-0.5 size-[18px] shrink-0 appearance-none border border-[#4a648a] bg-[#03070e] checked:border-[#dfe9f8] checked:bg-[#dfe9f8]"
          />
          <span className="text-[12.5px] leading-relaxed text-[#c5d3e6]">
            {t.contrato.aceite}
          </span>
        </label>

        <button
          type="button"
          disabled={!aceitou || emitido !== null}
          onClick={emitir}
          className="mt-4 block w-full rounded-sm bg-[#dfe9f8] py-4 text-[14px] font-bold text-[#06101d] disabled:cursor-default disabled:bg-[#232c3a] disabled:text-[#6f7f95]"
        >
          {emitido ? t.contrato.jaGerado : t.contrato.gerar}
        </button>

        {emitido && (
          <div
            className="mt-4 border border-[#2c3f60] bg-[#070d17] p-4.5 px-4 py-4"
            role="status"
          >
            <p className="font-mono text-xl tracking-wider text-[#eef3fb]">
              {emitido.protocolo}
            </p>
            <p className="mt-1.5 font-mono text-[10px] tracking-[0.12em] text-[#6d84a8]">
              {preencher(t.contrato.emitido, { quando: dataHora(idioma, emitido.quando) })}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-[#93a4bd]">
              {t.contrato.guardado}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => navegar(emitido ? '/pacotes' : '/')}
          className="mt-3 block w-full py-3 text-[13px] text-[#8b9cb6]"
        >
          {emitido ? t.menu.pacotes : t.comum.voltarAoInicio}
        </button>
        <p className="mt-3 text-center text-[11.5px] leading-relaxed text-[#64738c]">
          {t.comum.demonstracao}
        </p>
      </div>
    </Tela>
  )
}
