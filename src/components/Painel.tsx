import { type ReactNode, useEffect, useRef } from 'react'

// o canvas precisa terminar onde o painel comeca, senao o Cesium centra a cena no
// meio da tela inteira e metade dela fica escondida atras do painel. a altura e
// medida em vez de chutada porque o texto do painel muda de tamanho entre etapas
export const Painel = ({ children }: { readonly children: ReactNode }) => {
  const painel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const alvo = painel.current
    if (!alvo) return

    const medir = () => {
      alvo.parentElement?.style.setProperty('--painel', `${alvo.offsetHeight}px`)
    }

    const observador = new ResizeObserver(medir)
    observador.observe(alvo)
    medir()

    return () => observador.disconnect()
  }, [])

  return (
    <div
      ref={painel}
      className="absolute inset-x-0 bottom-0 z-[4] border-t border-[#22334a] bg-[#04070deb] px-6 pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+1.5rem))] pt-5 backdrop-blur-lg"
    >
      {children}
    </div>
  )
}
