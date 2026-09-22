import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Carregando } from './components/Carregando.tsx'
import { Inicio } from './pages/Inicio.tsx'

// as telas de mapa puxam o Cesium, que sozinho e a maior parte do peso.
// carregadas sob demanda, quem so abre o Inicio nao baixa nada disso
const Area = lazy(() => import('./pages/Area.tsx').then((m) => ({ default: m.Area })))
const Sol = lazy(() => import('./pages/Sol.tsx').then((m) => ({ default: m.Sol })))

export const App = () => (
  <BrowserRouter>
    <Suspense fallback={<Carregando />}>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/area" element={<Area />} />
        <Route path="/sol" element={<Sol />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
)
