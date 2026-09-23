import { useNavigate } from 'react-router'
import { Tela } from '../components/Tela.tsx'
import { areaDePlacasM2, PREMISSAS_PADRAO } from '../domain/energia.ts'
import { DURACAO_DA_PASSAGEM_S, REFLETORES_EM_ORBITA } from '../domain/orbita.ts'
import { orcar, TARIFA_DE_REFERENCIA } from '../domain/preco.ts'
import { NOITES_OFERECIDAS } from '../domain/validacao.ts'
import { useFluxo } from '../hooks/useFluxo.ts'
import { useTexto } from '../hooks/useTexto.ts'
import { useIdioma } from '../i18n/index.ts'
import { dinheiro, numero, preencher } from '../lib/formato.ts'

const MINUTOS = DURACAO_DA_PASSAGEM_S / 60
const OPCOES_DE_FROTA = [1, 3, 5, 7] as const
const HECTARES_DE_DEMONSTRACAO = 12.4

export const Pacote = () => {
  const t = useTexto()
  const idioma = useIdioma((e) => e.idioma)
  const navegar = useNavigate()

  const area = useFluxo((e) => e.area)
  const passagens = useFluxo((e) => e.passagensPorNoite)
  const noites = useFluxo((e) => e.noites)
  const definirPacote = useFluxo((e) => e.definirPacote)

  const hectares = area?.hectares ?? HECTARES_DE_DEMONSTRACAO
  const orcamento = orcar({ hectares, passagensPorNoite: passagens, noites })
  const { irradiancia, ocupacao, eficiencia } = PREMISSAS_PADRAO

  const d = t.pacote.degraus
  const degraus = [
    [d.area, `${numero(idioma, hectares, 1)} ha`, d.areaPorque],
    [
      d.placas,
      `${numero(idioma, areaDePlacasM2(hectares, ocupacao) / 10_000, 1)} ha`,
      preencher(d.placasPorque, { ocu: Math.round(ocupacao * 100) })
    ],
    [d.luz, `${irradiancia} W/m²`, d.luzPorque],
    [d.ar, '1 / sen(elev)', d.arPorque],
    [d.eficiencia, `${Math.round(eficiencia * 100)}%`, d.eficienciaPorque],
    [
      d.energia,
      `${numero(idioma, orcamento.kwhPorPassagem, 1)} kWh`,
      preencher(d.energiaPorque, { min: MINUTOS })
    ],
    [
      d.teto,
      `${REFLETORES_EM_ORBITA * MINUTOS} min`,
      preencher(d.tetoPorque, { total: REFLETORES_EM_ORBITA })
    ],
    [d.tarifa, `${dinheiro(idioma, TARIFA_DE_REFERENCIA)} / kWh`, d.tarifaPorque],
    [d.preco, dinheiro(idioma, orcamento.precoPorPassagem), d.precoPorque]
  ] as const

  const rotuloNoites = [t.pacote.umaNoite, t.pacote.umaSemana, t.pacote.umMes]

  return (
    <Tela estado={`${t.comum.areaMarcada} ${numero(idioma, hectares, 1)} ha`}>
      <div className="px-6 pb-14 pt-24">
        <p className="font-mono text-[8.5px] tracking-[0.22em] text-[#6d84a8]">
          {t.pacote.passo}
        </p>
        <h1 className="mt-2 text-[26px] font-semibold leading-tight tracking-tight text-[#eef3fb]">
          {t.pacote.titulo}
        </h1>
        <p className="mt-3 text-[13px] leading-relaxed text-[#8b9cb6]">
          {preencher(t.pacote.resumo, { min: MINUTOS })}
        </p>

        <p className="mt-8 font-mono text-[8.5px] tracking-[0.22em] text-[#6d84a8]">
          {t.pacote.minutosPorNoite}
        </p>
        <div className="mt-3 grid grid-cols-4 gap-px border border-[#22334a] bg-[#22334a]">
          {OPCOES_DE_FROTA.map((quantos) => (
            <button
              key={quantos}
              type="button"
              aria-pressed={passagens === quantos}
              onClick={() => definirPacote(quantos, noites)}
              className={`flex flex-col items-center gap-1 px-1 py-3 ${
                passagens === quantos ? 'bg-[#dfe9f8]' : 'bg-[#070d17]'
              }`}
            >
              <b
                className={`font-mono text-[15px] font-medium ${
                  passagens === quantos ? 'text-[#06101d]' : 'text-[#d5e4f7]'
                }`}
              >
                {quantos * MINUTOS} min
              </b>
              <span
                className={`text-[9.5px] ${passagens === quantos ? 'text-[#06101d]' : 'text-[#66788f]'}`}
              >
                {quantos} {quantos === 1 ? t.pacote.refletor : t.pacote.refletores}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-[11.5px] leading-relaxed text-[#7386a1]">
          {preencher(
            passagens === REFLETORES_EM_ORBITA ? t.pacote.frotaCheia : t.pacote.frota,
            {
              min: passagens * MINUTOS,
              n: passagens,
              total: REFLETORES_EM_ORBITA
            }
          )}
        </p>

        <p className="mt-8 font-mono text-[8.5px] tracking-[0.22em] text-[#6d84a8]">
          {t.pacote.noites}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-px border border-[#22334a] bg-[#22334a]">
          {NOITES_OFERECIDAS.map((quantas, i) => (
            <button
              key={quantas}
              type="button"
              aria-pressed={noites === quantas}
              onClick={() => definirPacote(passagens, quantas)}
              className={`flex flex-col items-center gap-1 px-2 py-3.5 ${
                noites === quantas ? 'bg-[#dfe9f8]' : 'bg-[#070d17]'
              }`}
            >
              <b
                className={`font-mono text-[17px] font-medium ${
                  noites === quantas ? 'text-[#06101d]' : 'text-[#d5e4f7]'
                }`}
              >
                {quantas}
              </b>
              <span
                className={`text-[9.5px] ${noites === quantas ? 'text-[#06101d]' : 'text-[#66788f]'}`}
              >
                {rotuloNoites[i]}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 border border-[#22334a] bg-[#070d17] px-5 py-4">
          <p className="font-mono text-[34px] tracking-tight text-[#eef3fb]">
            {dinheiro(idioma, orcamento.precoTotal)}
          </p>
          <p className="mt-1.5 text-[13px] text-[#8b9cb6]">
            {preencher(
              orcamento.passagensTotais === 1 ? t.pacote.estimadoUm : t.pacote.estimados,
              { kwh: numero(idioma, orcamento.kwhTotal, 1), n: orcamento.passagensTotais }
            )}
          </p>
        </div>

        <p className="mt-8 font-mono text-[8.5px] tracking-[0.22em] text-[#6d84a8]">
          {t.pacote.deOndeSai}
        </p>
        <ol className="mt-3 border-l border-[#22334a] pl-5">
          {degraus.map(([nome, valor, porque], i) => (
            <li
              key={nome}
              className={`relative py-3 ${i > 0 ? 'border-t border-[#101b2c]' : ''} before:absolute before:-left-5 before:top-5 before:h-px before:w-3 before:content-[''] ${
                i === degraus.length - 1
                  ? 'before:h-0.5 before:w-4 before:bg-[#dfe9f8]'
                  : 'before:bg-[#44618a]'
              }`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[13.5px] font-medium text-[#e4ebf6]">{nome}</span>
                <span
                  className={`whitespace-nowrap font-mono ${
                    i === degraus.length - 1
                      ? 'text-[16px] text-[#eef3fb]'
                      : 'text-[14px] text-[#d5e4f7]'
                  }`}
                >
                  {valor}
                </span>
              </div>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-[#7386a1]">
                {porque}
              </p>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={() => navegar('/orcamento')}
          className="mt-6 block w-full rounded-sm bg-[#dfe9f8] py-4 text-[14px] font-bold text-[#06101d]"
        >
          {t.pacote.gerar}
        </button>
        <button
          type="button"
          onClick={() => navegar('/area')}
          className="mt-3 block w-full py-3 text-[13px] text-[#8b9cb6]"
        >
          {t.pacote.outraArea}
        </button>
        <p className="mt-4 text-center text-[11.5px] leading-relaxed text-[#64738c]">
          {t.comum.demonstracao}
        </p>
      </div>
    </Tela>
  )
}
