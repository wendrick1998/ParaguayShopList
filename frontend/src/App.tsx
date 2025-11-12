import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ProdutosPage from './pages/ProdutosPage'
import EstoquePage from './pages/EstoquePage'
import VendasPage from './pages/VendasPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/produtos" element={<ProdutosPage />} />
        <Route path="/estoque" element={<EstoquePage />} />
        <Route path="/vendas" element={<VendasPage />} />
      </Routes>
    </div>
  )
}

export default App
