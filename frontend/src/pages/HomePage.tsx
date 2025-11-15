import { Link } from 'react-router-dom'
import { ShoppingCart, Package, TrendingUp, Wallet } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary-600 to-primary-800">
      <div className="text-center text-white mb-12">
        <h1 className="text-6xl font-bold mb-4">SEC+</h1>
        <p className="text-2xl text-primary-100">Sistema de Gestão de Estoque e Vendas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl px-4">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-white">
          <ShoppingCart className="mb-3" size={32} />
          <h3 className="text-lg font-semibold mb-2">Controle de Vendas</h3>
          <p className="text-sm text-primary-100">PDV completo e gestão de vendas</p>
        </div>
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-white">
          <Package className="mb-3" size={32} />
          <h3 className="text-lg font-semibold mb-2">Gestão de Estoque</h3>
          <p className="text-sm text-primary-100">Controle total do seu inventário</p>
        </div>
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-white">
          <TrendingUp className="mb-3" size={32} />
          <h3 className="text-lg font-semibold mb-2">Relatórios</h3>
          <p className="text-sm text-primary-100">Dashboards e métricas em tempo real</p>
        </div>
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-white">
          <Wallet className="mb-3" size={32} />
          <h3 className="text-lg font-semibold mb-2">Controle de Caixa</h3>
          <p className="text-sm text-primary-100">Abertura, fechamento e sangria</p>
        </div>
      </div>

      <Link
        to="/login"
        className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors shadow-lg"
      >
        Acessar Sistema
      </Link>
    </div>
  )
}
