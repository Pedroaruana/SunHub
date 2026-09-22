import type { Viewer } from 'cesium'
import { type RefObject, useEffect, useRef, useState } from 'react'
import { criarViewer } from '../scene/cesium.ts'

type Retorno = {
  readonly caixa: RefObject<HTMLDivElement | null>
  readonly viewer: Viewer | null
}

// o viewer e criado uma vez e destruido no desmonte. sem o destroy o Cesium
// deixa o contexto WebGL aberto e o navegador derruba a segunda tela que abrir
export const useCesium = (): Retorno => {
  const caixa = useRef<HTMLDivElement>(null)
  const [viewer, setViewer] = useState<Viewer | null>(null)

  useEffect(() => {
    if (!caixa.current) return

    const criado = criarViewer(caixa.current)
    setViewer(criado)

    return () => {
      setViewer(null)
      if (!criado.isDestroyed()) criado.destroy()
    }
  }, [])

  return { caixa, viewer }
}
