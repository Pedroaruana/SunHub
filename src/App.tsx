import { BrowserRouter, Route, Routes } from 'react-router'
import { Inicio } from './pages/Inicio.tsx'

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Inicio />} />
    </Routes>
  </BrowserRouter>
)
