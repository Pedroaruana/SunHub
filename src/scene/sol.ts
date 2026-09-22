import {
  Cartesian3,
  type JulianDate,
  Matrix3,
  Matrix4,
  Simon1994PlanetaryPositions,
  Transforms
} from 'cesium'

// o computeIcrfToFixedMatrix devolve undefined enquanto os dados de orientacao da
// Terra nao chegam. o reserva tem que ser o TEME: com matriz identidade o vetor
// fica no referencial inercial, o teste de horizonte nunca passa e o caminho do
// Sol sai vazio. foi exatamente o que aconteceu
export const direcaoDoSol = (quando: JulianDate, paraLocal: Matrix4): Cartesian3 => {
  const inercial = Simon1994PlanetaryPositions.computeSunPositionInEarthInertialFrame(
    quando,
    new Cartesian3()
  )
  const giro =
    Transforms.computeIcrfToFixedMatrix(quando, new Matrix3()) ??
    Transforms.computeTemeToPseudoFixedMatrix(quando, new Matrix3())

  const fixo = Matrix3.multiplyByVector(giro, inercial, new Cartesian3())
  const local = Matrix4.multiplyByPoint(paraLocal, fixo, new Cartesian3())
  return Cartesian3.normalize(local, new Cartesian3())
}

export const elevacaoDe = (direcao: Cartesian3): number =>
  Math.asin(Math.max(-1, Math.min(1, direcao.z)))

// graus a partir do norte, no sentido horario. a sombra vai pro lado oposto ao Sol
export const rumoDaSombraDe = (direcao: Cartesian3): number =>
  (Math.atan2(-direcao.x, -direcao.y) * (180 / Math.PI) + 360) % 360

export const NOMES_DE_RUMO = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'] as const

export const nomeDoRumo = (graus: number): string =>
  NOMES_DE_RUMO[Math.round(graus / 45) % 8]

// o fuso sai da longitude porque o que importa pra sombra e a hora solar, nao o
// fuso politico do pais
export const horaSolarDe = (longitudeEmGraus: number): number => longitudeEmGraus / 15

export const noDomo = (direcao: Cartesian3, enu: Matrix4, raio: number): Cartesian3 =>
  Matrix4.multiplyByPoint(
    enu,
    Cartesian3.multiplyByScalar(direcao, raio, new Cartesian3()),
    new Cartesian3()
  )
