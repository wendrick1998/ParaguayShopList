import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import {
  LayoutDashboard,
  Package,
  PackageCheck,
  ShoppingCart,
  CreditCard,
  Wallet,
  LogOut
} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/pdv', label: 'PDV (F2)', icon: CreditCard },
    { path: '/produtos', label: 'Produtos', icon: Package },
    { path: '/estoque', label: 'Estoque', icon: PackageCheck },
    { path: '/vendas', label: 'Vendas', icon: ShoppingCart },
    { path: '/caixa', label: 'Caixa', icon: Wallet }
  ]

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary-800 text-white flex flex-col">
        <div className="p-6 border-b border-primary-700">
          <h1 className="text-2xl font-bold">SEC+</h1>
          <p className="text-xs text-primary-200 mt-1">Gestão de Estoque</p>
        </div>
        <nav className="flex-1 mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-3 transition-colors ${isActive ? 'bg-primary-700 border-l-4 border-white' : 'hover:bg-primary-700'
                  }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-primary-700">
          <p className="text-xs text-primary-200 mb-1">Usuário</p>
          <p className="text-sm font-medium">Admin Sistema</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-8 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Sistema de Gestão de Estoque e Vendas
            </h2>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut size={18} />
              <span>Sair</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
