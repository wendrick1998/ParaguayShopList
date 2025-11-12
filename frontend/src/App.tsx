import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ProdutosPage from './pages/ProdutosPage'
import EstoquePage from './pages/EstoquePage'
import VendasPage from './pages/VendasPage'
import PDVPage from './pages/PDVPage'
import CaixaPage from './pages/CaixaPage'
import IPhonesPage from './pages/iPhonesPage'
import LeiloesPage from './pages/LeiloesPage'
import EnviosPage from './pages/EnviosPage'
import CambioPage from './pages/CambioPage'
import { ToastContainer } from './components/ui'
import { useToastStore } from './store/toastStore'

function App() {
  const toasts = useToastStore((state) => state.toasts)
  const removeToast = useToastStore((state) => state.removeToast)

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/iphones" element={<IPhonesPage />} />
        <Route path="/leiloes" element={<LeiloesPage />} />
        <Route path="/envios" element={<EnviosPage />} />
        <Route path="/cambio" element={<CambioPage />} />
        <Route path="/produtos" element={<ProdutosPage />} />
        <Route path="/estoque" element={<EstoquePage />} />
        <Route path="/vendas" element={<VendasPage />} />
        <Route path="/pdv" element={<PDVPage />} />
        <Route path="/caixa" element={<CaixaPage />} />
      </Routes>
    </div>
  )
}

export default App
