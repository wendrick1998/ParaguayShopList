import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-primary-600 mb-4">SEC+</h1>
      <p className="text-xl text-gray-600 mb-8">Sistema de Gestão de Estoque e Vendas</p>
      <Link to="/login" className="btn-primary">
        Acessar Sistema
      </Link>
    </div>
  )
}
