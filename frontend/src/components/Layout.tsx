import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary-800 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">SEC+</h1>
        </div>
        <nav className="mt-6">
          <Link
            to="/dashboard"
            className="block px-6 py-3 hover:bg-primary-700 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/produtos"
            className="block px-6 py-3 hover:bg-primary-700 transition-colors"
          >
            Produtos
          </Link>
          <Link
            to="/estoque"
            className="block px-6 py-3 hover:bg-primary-700 transition-colors"
          >
            Estoque
          </Link>
          <Link
            to="/vendas"
            className="block px-6 py-3 hover:bg-primary-700 transition-colors"
          >
            Vendas
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-8 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Sistema de Gestão
            </h2>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-800"
            >
              Sair
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
