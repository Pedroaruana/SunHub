import { useTexto } from '../hooks/useTexto.ts'

// o eclipse girando devagar enquanto o Cesium desce. estado de carregando
// desenhado, nao um retangulo em branco
export const Carregando = () => {
  const t = useTexto()

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-[#03050a]">
      <svg
        viewBox="0 0 80 80"
        className="size-16 animate-[girar_2.4s_linear_infinite]"
        aria-hidden="true"
      >
        <circle cx="40" cy="40" r="26" fill="none" stroke="#2c3f60" strokeWidth="1.5" />
        <path d="M40 14 A26 26 0 0 1 40 66 Z" fill="#dfe9f8" opacity=".85" />
      </svg>
      <p className="font-mono text-[9px] tracking-[0.22em] text-[#6d84a8]" role="status">
        {t.comum.carregando}
      </p>
    </div>
  )
}
