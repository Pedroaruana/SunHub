export const COEFICIENTE_DE_EXTINCAO = 0.22

const MINIMO_SENO = 0.05

// quantas atmosferas a luz atravessa. no zenite e 1 e cresce sem limite no
// rasante, dai o piso: sem ele a conta estoura na hora que o refletor nasce
export const massaDeAr = (elevacao: number): number => {
  const seno = Math.sin(elevacao)
  if (seno <= 0) return Number.POSITIVE_INFINITY
  return 1 / Math.max(seno, MINIMO_SENO)
}

export const transmissaoAtmosferica = (
  elevacao: number,
  coeficiente = COEFICIENTE_DE_EXTINCAO
): number => {
  if (Math.sin(elevacao) <= 0) return 0
  return Math.exp(-coeficiente * massaDeAr(elevacao))
}

export const fatorDeIncidencia = (elevacao: number): number =>
  Math.max(0, Math.sin(elevacao))

// os dois fatores multiplicam e sao coisas diferentes: um e quanto sobrevive ao
// ar, o outro e quanto a placa deitada consegue pegar. ja troquei um pelo outro
// por engano e a potencia no rasante ficou 6 vezes maior do que devia
export const aproveitamento = (
  elevacao: number,
  coeficiente = COEFICIENTE_DE_EXTINCAO
): number => transmissaoAtmosferica(elevacao, coeficiente) * fatorDeIncidencia(elevacao)

export const comprimentoDaSombra = (alturaM: number, elevacao: number): number => {
  const tangente = Math.tan(elevacao)
  if (tangente <= 0) return Number.POSITIVE_INFINITY
  return alturaM / tangente
}

// graus a partir do norte, no sentido horario
export const rumoDaSombra = (azimuteDaLuz: number): number => (azimuteDaLuz + 180) % 360
