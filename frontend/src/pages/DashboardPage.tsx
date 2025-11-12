import Layout from '@/components/Layout'

export default function DashboardPage() {
  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-700">Vendas Hoje</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">R$ 0,00</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-700">Produtos</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">0</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-700">Estoque Baixo</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">0</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-700">Caixa</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">R$ 0,00</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Últimas Vendas</h2>
        <p className="text-gray-500">Nenhuma venda registrada</p>
      </div>
    </Layout>
  )
}
