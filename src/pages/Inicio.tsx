import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { Tela } from '../components/Tela.tsx'
import {
  ALTITUDE_DO_REFLETOR_M,
  DURACAO_DA_PASSAGEM_S,
  REFLETORES_EM_ORBITA
} from '../domain/orbita.ts'
import { useTexto } from '../hooks/useTexto.ts'
import { campoDeEstrelas } from '../lib/estrelas.ts'

const LARGURA = 390
const ALTURA_HERO = 620
// 340 estrelas travavam a abertura no celular. 150 lê igual e desenha em metade
// do tempo, e o optimizeSpeed tira o antialias de cada circulo
const ESTRELAS = campoDeEstrelas(41, LARGURA, ALTURA_HERO, 150)

const Hero = () => {
  const t = useTexto()
  const svg = useRef<SVGSVGElement>(null)

  // o SMIL que move o satelite nao escuta prefers-reduced-motion, entao paro na mao
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches)
      svg.current?.pauseAnimations()
  }, [])

  return (
    <svg
      ref={svg}
      viewBox={`0 0 ${LARGURA} ${ALTURA_HERO}`}
      className="absolute inset-x-0 top-0 h-[620px] w-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="brilhoAnel" cx="50%" cy="50%" r="50%">
          <stop offset="38%" stopColor="#bcd6fb" stopOpacity=".5" />
          <stop offset="100%" stopColor="#bcd6fb" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="brilhoSol" cx="50%" cy="50%" r="50%">
          <stop offset="52%" stopColor="#e9f1ff" stopOpacity=".55" />
          <stop offset="100%" stopColor="#e9f1ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="feixe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dce9fb" stopOpacity=".34" />
          <stop offset="100%" stopColor="#dce9fb" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="saida" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#03050a" stopOpacity="0" />
          <stop offset="100%" stopColor="#03050a" />
        </linearGradient>

        {/* a mesma animacao do disco escuro roda aqui dentro. e o que faz a letra
            virar preta exatamente na borda da sombra, e nao antes */}
        <mask
          id="sombra"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width={LARGURA}
          height={ALTURA_HERO}
        >
          <rect width={LARGURA} height={ALTURA_HERO} fill="#000" />
          <circle className="eclipseMascara" cx="195" cy="292" r="97.5" fill="#fff" />
        </mask>
      </defs>

      <rect width={LARGURA} height={ALTURA_HERO} fill="#03050a" />

      <g className="estrelas" shapeRendering="optimizeSpeed">
        {ESTRELAS.map((e) => (
          <circle
            key={`${e.x}-${e.y}-${e.r}`}
            cx={e.x}
            cy={e.y}
            r={e.r}
            fill={e.cor}
            opacity={e.opacidade}
          />
        ))}
      </g>

      <g className="sol">
        <circle cx="195" cy="292" r="186" fill="url(#brilhoSol)" />
        <circle cx="195" cy="292" r="97.5" fill="#f4f6fb" />
      </g>

      <g className="coroa">
        <circle cx="195" cy="292" r="168" fill="url(#brilhoAnel)" />
        <circle
          cx="195"
          cy="292"
          r="100"
          fill="none"
          stroke="#e4eefc"
          strokeWidth="2.4"
          opacity=".92"
        />
      </g>

      <circle className="eclipse" cx="195" cy="292" r="97.5" fill="#03050a" />

      <g className="marca">
        <text
          x="195"
          y="304"
          textAnchor="middle"
          fontSize="41"
          fontWeight="800"
          letterSpacing="-1.6"
          fill="#0a0d12"
        >
          {t.marca}
        </text>
        <text
          x="195"
          y="328"
          textAnchor="middle"
          className="font-mono"
          fontSize="8.5"
          letterSpacing="3.4"
          fill="#0a0d12"
        >
          {t.desde}
        </text>
      </g>

      <g className="marca" mask="url(#sombra)">
        <text
          x="195"
          y="304"
          textAnchor="middle"
          fontSize="41"
          fontWeight="800"
          letterSpacing="-1.6"
          fill="#eef3fb"
        >
          {t.marca}
        </text>
        <text
          x="195"
          y="328"
          textAnchor="middle"
          className="font-mono"
          fontSize="8.5"
          letterSpacing="3.4"
          fill="#7b93b8"
        >
          {t.desde}
        </text>
      </g>

      {/* a rota entra e sai fora da tela. o satelite passa por baixo do sol,
          que e de onde ele reflete a luz pra baixo */}
      <path id="rota" d="M-52 498 C 92 462, 298 462, 442 498" fill="none" stroke="none" />

      <g className="sat">
        <g>
          <path d="M0 8 L40 150 L-40 150 Z" fill="url(#feixe)" />
          <rect x="-3.6" y="-7.5" width="7.2" height="15" fill="#eef3fb" />
          <rect
            x="-27"
            y="-4.2"
            width="20"
            height="8.4"
            fill="#5f7ea6"
            stroke="#dce9fb"
            strokeWidth=".6"
          />
          <rect
            x="7"
            y="-4.2"
            width="20"
            height="8.4"
            fill="#5f7ea6"
            stroke="#dce9fb"
            strokeWidth=".6"
          />
          {/* begin negativo: a rota nasce fora da tela, entao ele ja entra com um
              pedaco do caminho andado, senao some nos primeiros segundos */}
          <animateMotion dur="30s" repeatCount="indefinite" rotate="auto" begin="-6s">
            <mpath href="#rota" />
          </animateMotion>
        </g>
      </g>

      <rect y={ALTURA_HERO - 130} width={LARGURA} height="130" fill="url(#saida)" />
    </svg>
  )
}

export const Inicio = () => {
  const t = useTexto()

  const numeros = [
    [String(REFLETORES_EM_ORBITA), t.inicio.refletores],
    [`${DURACAO_DA_PASSAGEM_S / 60} min`, t.inicio.passagemMedia],
    [`${ALTITUDE_DO_REFLETOR_M / 1000} km`, t.inicio.altitude]
  ] as const

  return (
    <Tela comVoltar={false}>
      <div className="abertura relative">
        <Hero />

        <div className="relative px-6 pb-14 pt-[620px]">
          <h1 className="sobe sobe-1 text-[31px] font-semibold leading-tight tracking-tight text-[#eef3fb]">
            {t.inicio.titulo}{' '}
            <span className="text-[#a8c6e8]">{t.inicio.tituloDestaque}</span>
          </h1>

          <p className="sobe sobe-2 mt-4 text-sm leading-relaxed text-[#8b9cb6]">
            {t.inicio.resumo}
          </p>

          <div className="sobe sobe-3 mt-7 grid grid-cols-3 gap-px border border-[#1c2a3c] bg-[#1c2a3c]">
            {numeros.map(([valor, rotulo]) => (
              <div key={rotulo} className="flex flex-col gap-1.5 bg-[#070c15] px-3 py-3.5">
                <span className="font-mono text-[17px] text-[#d5e4f7]">{valor}</span>
                <span className="text-[10px] leading-tight text-[#66788f]">{rotulo}</span>
              </div>
            ))}
          </div>

          <p className="sobe sobe-4 mt-10 font-mono text-[10px] uppercase tracking-[0.24em] text-[#6d7f9c]">
            {t.inicio.comoFunciona}
          </p>

          <ol className="sobe sobe-4 mt-4 border-l border-[#22334a]">
            {t.inicio.passos.map((passo, i) => (
              <li
                key={passo.titulo}
                className="relative grid grid-cols-[30px_1fr] gap-3 py-4 pl-5 before:absolute before:-left-px before:top-6 before:h-px before:w-3 before:bg-[#55749b] before:content-['']"
              >
                <span className="pt-0.5 font-mono text-[11px] text-[#5f7a9c]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h2 className="text-[15px] font-semibold text-[#e4ebf6]">
                    {passo.titulo}
                  </h2>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#7f90a9]">
                    {passo.texto}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <Link
            to="/area"
            className="sobe sobe-5 mt-7 block rounded-sm bg-[#dfe9f8] py-4 text-center text-[14.5px] font-bold text-[#06101d]"
          >
            {t.inicio.comecar}
          </Link>

          <p className="sobe sobe-5 mt-4 text-center text-[11.5px] leading-relaxed text-[#64738c]">
            {t.comum.demonstracao}
          </p>
        </div>
      </div>
    </Tela>
  )
}
