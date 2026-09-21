export type Estrela = {
  readonly x: number
  readonly y: number
  readonly r: number
  readonly opacidade: number
  readonly cor: string
}

const CORES = ['#dfe8f5', '#b9c9e2', '#8fa6c4', '#f0ecdf', '#a9bcd8']

// semente fixa de proposito: o ceu precisa ser o mesmo entre telas e entre
// recargas, senao a marca pisca de lugar toda vez que a pagina carrega
const sorteio = (semente: number) => {
  let estado = semente
  return () => {
    estado = (estado * 1664525 + 1013904223) >>> 0
    return estado / 4294967296
  }
}

export const campoDeEstrelas = (
  semente: number,
  largura: number,
  altura: number,
  quantidade: number
): Estrela[] => {
  const proximo = sorteio(semente)
  const estrelas: Estrela[] = []

  for (let i = 0; i < quantidade; i++) {
    const x = proximo() * largura
    const y = proximo() * altura
    const sorte = proximo()
    const r =
      sorte > 0.97
        ? 1.4 + proximo() * 0.8
        : sorte > 0.84
          ? 0.85 + proximo() * 0.35
          : 0.3 + proximo() * 0.4

    estrelas.push({
      x: +x.toFixed(1),
      y: +y.toFixed(1),
      r: +r.toFixed(2),
      opacidade: +(0.22 + proximo() * 0.72).toFixed(2),
      cor: CORES[Math.floor(proximo() * CORES.length)]
    })
  }

  return estrelas
}
