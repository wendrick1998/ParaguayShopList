import Layout from '../components/Layout'
import { TrendingUp, Package, AlertTriangle, DollarSign } from 'lucide-react'
import { mockDashboardStats, mockVendas, mockProdutos } from '../data/mockData'

export default function DashboardPage() {
  const stats = mockDashboardStats
  const ultimasVendas = mockVendas.slice(0, 5)
  const produtosEstoqueBaixo = mockProdutos.filter(p => p.estoque.quantidade < p.estoque.quantidadeMinima)

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Vendas Hoje</p>
              <p className="text-3xl font-bold text-primary-600">
                R$ {stats.vendasHoje.total.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{stats.vendasHoje.quantidade} vendas</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <DollarSign className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Produtos</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalProdutos}</p>
              <p className="text-xs text-gray-500 mt-1">cadastrados</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Estoque Baixo</p>
              <p className="text-3xl font-bold text-orange-600">{stats.estoqueBaixo}</p>
              <p className="text-xs text-gray-500 mt-1">produtos</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertTriangle className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Caixa Atual</p>
              <p className="text-3xl font-bold text-green-600">
                R$ {stats.caixaAtual.saldoAtual.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{stats.caixaAtual.status}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimas Vendas */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Últimas Vendas</h2>
          <div className="space-y-3">
            {ultimasVendas.map((venda) => (
              <div key={venda.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">{venda.numero}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(venda.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-600">R$ {venda.total.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{venda.formaPagamento}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Produtos com Estoque Baixo */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="text-orange-500" size={20} />
            Estoque Baixo
          </h2>
          <div className="space-y-3">
            {produtosEstoqueBaixo.map((produto) => (
              <div key={produto.id} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-semibold">{produto.nome}</p>
                  <p className="text-sm text-gray-500">Mín: {produto.estoque.quantidadeMinima}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-600">{produto.estoque.quantidade} un</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
