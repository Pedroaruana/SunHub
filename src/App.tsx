import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Carregando } from './components/Carregando.tsx'
import { useSeo } from './hooks/useSeo.ts'
import { Inicio } from './pages/Inicio.tsx'
import { Legal } from './pages/Legal.tsx'
import { NaoAchou } from './pages/NaoAchou.tsx'
import { Orcamento } from './pages/Orcamento.tsx'
import { Pacote } from './pages/Pacote.tsx'
import { Pacotes } from './pages/Pacotes.tsx'

// as tres telas de mapa puxam o Cesium, que sozinho e a maior parte do peso.
// carregadas sob demanda, quem so abre o Inicio nao baixa nada disso
const Area = lazy(() => import('./pages/Area.tsx').then((m) => ({ default: m.Area })))
const Sol = lazy(() => import('./pages/Sol.tsx').then((m) => ({ default: m.Sol })))
const Passagem = lazy(() =>
  import('./pages/Passagem.tsx').then((m) => ({ default: m.Passagem }))
)

const Rotas = () => {
  useSeo()

  return (
    <Suspense fallback={<Carregando />}>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/area" element={<Area />} />
        <Route path="/sol" element={<Sol />} />
        <Route path="/passagem" element={<Passagem />} />
        <Route path="/pacote" element={<Pacote />} />
        <Route path="/orcamento" element={<Orcamento />} />
        <Route path="/pacotes" element={<Pacotes />} />
        <Route path="/privacidade" element={<Legal qual="privacidade" />} />
        <Route path="/termos" element={<Legal qual="termos" />} />
        <Route path="/cookies" element={<Legal qual="cookies" />} />
        <Route path="*" element={<NaoAchou />} />
      </Routes>
    </Suspense>
  )
}

export const App = () => (
  <BrowserRouter>
    <Rotas />
  </BrowserRouter>
)
