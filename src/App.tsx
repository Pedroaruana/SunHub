import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Carregando } from './components/Carregando.tsx'
import { Inicio } from './pages/Inicio.tsx'

// a tela do mapa puxa o Cesium, que sozinho e a maior parte do peso. carregada
// sob demanda, quem so abre o Inicio nao baixa nada disso
const Area = lazy(() => import('./pages/Area.tsx').then((m) => ({ default: m.Area })))

export const App = () => (
  <BrowserRouter>
    <Suspense fallback={<Carregando />}>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/area" element={<Area />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
)
