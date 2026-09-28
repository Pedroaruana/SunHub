import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import './index.css'
import { App } from './App.tsx'
import { Barreira } from './components/Barreira.tsx'

const raiz = document.getElementById('root')
if (!raiz) throw new Error('faltou a div#root no index.html')

createRoot(raiz).render(
  <StrictMode>
    <Barreira>
      <App />
    </Barreira>
  </StrictMode>
)
