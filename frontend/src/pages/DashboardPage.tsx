import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import {
  DollarSign,
  Package,
  TrendingUp,
  Smartphone,
  ShoppingCart,
  Truck,
  Gavel,
  Battery,
  AlertTriangle
} from 'lucide-react'

export default function DashboardPage() {
  // Dados simulados do negócio de importação de iPhones
  const stats = {
    // iPhones
    totaliPhones: 15,
    iphoneEmEstoque: 8,
    iphoneVendidos: 5,
    iphoneEmTransito: 2,

    // Financeiro
    investidoUSD: 12750,
    investidoBRL: 74587.50,
    lucroRealizado: 18450.25,
    margemMedia: 32.5,
    cotacaoDolar: 5.85,

    // Envios e Leilões
    enviosAtivos: 3,
    leiloesAtivos: 2,

    // Vendas hoje
    vendasHoje: 2,
    valorVendasHoje: 15800
  }

  // Últimas movimentações (simulado)
  const ultimasVendas = [
    {
      id: 1,
      modelo: 'iPhone 15 Pro Max 256GB',
      valor: 8500,
      data: '2024-01-25T14:30:00.000Z',
      cliente: 'Cliente São Paulo'
    },
    {
      id: 2,
      modelo: 'iPhone 14 Pro 128GB',
      valor: 6200,
      data: '2024-01-25T10:15:00.000Z',
      cliente: 'Cliente Rio de Janeiro'
    },
    {
      id: 3,
      modelo: 'iPhone 15 256GB',
      valor: 7300,
      data: '2024-01-24T16:45:00.000Z',
      cliente: 'Cliente Belo Horizonte'
    }
  ]

  // iPhones por grade (simulado)
  const iphonesPorGrade = [
    { grade: 'A+', quantidade: 3, percentual: 20 },
    { grade: 'A', quantidade: 6, percentual: 40 },
    { grade: 'AB', quantidade: 3, percentual: 20 },
    { grade: 'B', quantidade: 2, percentual: 13 },
    { grade: 'C', quantidade: 1, percentual: 7 }
  ]

  // Alertas
  const alertas = [
    {
      id: 1,
      tipo: 'warning',
      mensagem: '2 iPhones com bateria abaixo de 85%',
      link: '/iphones'
    },
    {
      id: 2,
      tipo: 'info',
      mensagem: '3 envios em trânsito aguardando chegada',
      link: '/envios'
    },
    {
      id: 3,
      tipo: 'success',
      mensagem: 'Cotação do dólar em R$ 5.85 - boa para compra',
      link: '/cambio'
    }
  ]

  const getGradeColor = (grade: string) => {
    const colors: any = {
      'A+': 'bg-green-500',
      'A': 'bg-green-400',
      'AB': 'bg-blue-400',
      'B': 'bg-yellow-400',
      'C': 'bg-orange-400'
    }
    return colors[grade] || 'bg-gray-400'
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visão geral do seu negócio de importação de iPhones</p>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total iPhones */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total de iPhones</p>
              <p className="text-3xl font-bold text-primary-600">{stats.totaliPhones}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.iphoneEmEstoque} em estoque • {stats.iphoneVendidos} vendidos
              </p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <Smartphone className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        {/* Investido USD */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Investido (USD)</p>
              <p className="text-3xl font-bold text-red-600">$ {stats.investidoUSD.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">
                R$ {stats.investidoBRL.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <DollarSign className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        {/* Lucro Realizado */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Lucro Realizado</p>
              <p className="text-3xl font-bold text-green-600">R$ {stats.lucroRealizado.toFixed(2)}</p>
              <p className="text-xs text-green-600 mt-1 font-semibold">
                Margem: {stats.margemMedia}%
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        {/* Cotação Dólar */}
        <Link to="/cambio" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Cotação Dólar</p>
              <p className="text-3xl font-bold text-blue-600">R$ {stats.cotacaoDolar.toFixed(2)}</p>
              <p className="text-xs text-blue-600 mt-1 font-semibold">
                + 0.34% hoje
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
        </Link>
      </div>

      {/* Cards Secundários */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Link to="/vendas" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ShoppingCart className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Vendas Hoje</p>
              <p className="text-2xl font-bold text-purple-600">{stats.vendasHoje}</p>
            </div>
          </div>
        </Link>

        <Link to="/envios" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Truck className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Envios Ativos</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.enviosAtivos}</p>
            </div>
          </div>
        </Link>

        <Link to="/leiloes" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Gavel className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Leilões Ativos</p>
              <p className="text-2xl font-bold text-orange-600">{stats.leiloesAtivos}</p>
            </div>
          </div>
        </Link>

        <Link to="/iphones" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Package className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Em Estoque</p>
              <p className="text-2xl font-bold text-green-600">{stats.iphoneEmEstoque}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Últimas Vendas */}
        <div className="card lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Últimas Vendas</h2>
            <Link to="/vendas" className="text-sm text-primary-600 hover:text-primary-700 font-semibold">
              Ver todas →
            </Link>
          </div>
          <div className="space-y-3">
            {ultimasVendas.map((venda) => (
              <div key={venda.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{venda.modelo}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {venda.cliente} • {new Date(venda.data).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">R$ {venda.valor.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribuição por Grade */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">iPhones por Grade</h2>
          </div>
          <div className="space-y-3">
            {iphonesPorGrade.map((item) => (
              <div key={item.grade}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-gray-700">Grade {item.grade}</span>
                  <span className="text-sm text-gray-600">{item.quantidade} ({item.percentual}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${getGradeColor(item.grade)} h-2 rounded-full transition-all`}
                    style={{ width: `${item.percentual}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <Link
              to="/iphones"
              className="block w-full text-center py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors font-semibold"
            >
              Ver todos os iPhones
            </Link>
          </div>
        </div>

        {/* Alertas e Notificações */}
        <div className="card lg:col-span-3">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-orange-500" size={20} />
            <h2 className="text-xl font-bold">Alertas e Notificações</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alertas.map((alerta) => {
              const configs: any = {
                warning: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', icon: '⚠️' },
                info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: 'ℹ️' },
                success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: '✅' }
              }
              const config = configs[alerta.tipo]

              return (
                <Link
                  key={alerta.id}
                  to={alerta.link}
                  className={`p-4 ${config.bg} border ${config.border} rounded-lg hover:shadow-md transition-shadow`}
                >
                  <p className={`text-sm ${config.text} font-semibold`}>
                    <span className="mr-2">{config.icon}</span>
                    {alerta.mensagem}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="card lg:col-span-2 bg-gradient-to-r from-green-50 to-blue-50">
          <h2 className="text-xl font-bold mb-4">Resumo Financeiro</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Investimento Total</p>
              <p className="text-2xl font-bold text-red-600">R$ {stats.investidoBRL.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">$ {stats.investidoUSD.toFixed(2)} USD</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Lucro Acumulado</p>
              <p className="text-2xl font-bold text-green-600">R$ {stats.lucroRealizado.toFixed(2)}</p>
              <p className="text-xs text-green-600 mt-1 font-semibold">
                ROI: {((stats.lucroRealizado / stats.investidoBRL) * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Vendas Hoje</p>
              <p className="text-2xl font-bold text-purple-600">R$ {stats.valorVendasHoje.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.vendasHoje} transações</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Margem Média</p>
              <p className="text-2xl font-bold text-blue-600">{stats.margemMedia}%</p>
              <p className="text-xs text-gray-500 mt-1">Últimas 30 vendas</p>
            </div>
          </div>
        </div>

        {/* Status dos iPhones */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Status dos iPhones</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Em Estoque</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{stats.iphoneEmEstoque}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Em Trânsito</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{stats.iphoneEmTransito}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Vendidos</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{stats.iphoneVendidos}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Battery size={16} />
              <span>Saúde média da bateria: <strong>92%</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Links Rápidos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <Link
          to="/iphones"
          className="card hover:shadow-lg transition-shadow text-center py-6 bg-primary-50 hover:bg-primary-100"
        >
          <Smartphone className="mx-auto text-primary-600 mb-2" size={32} />
          <p className="font-semibold text-primary-700">Novo iPhone</p>
        </Link>

        <Link
          to="/leiloes"
          className="card hover:shadow-lg transition-shadow text-center py-6 bg-orange-50 hover:bg-orange-100"
        >
          <Gavel className="mx-auto text-orange-600 mb-2" size={32} />
          <p className="font-semibold text-orange-700">Novo Leilão</p>
        </Link>

        <Link
          to="/envios"
          className="card hover:shadow-lg transition-shadow text-center py-6 bg-yellow-50 hover:bg-yellow-100"
        >
          <Truck className="mx-auto text-yellow-600 mb-2" size={32} />
          <p className="font-semibold text-yellow-700">Novo Envio</p>
        </Link>

        <Link
          to="/cambio"
          className="card hover:shadow-lg transition-shadow text-center py-6 bg-green-50 hover:bg-green-100"
        >
          <DollarSign className="mx-auto text-green-600 mb-2" size={32} />
          <p className="font-semibold text-green-700">Ver Câmbio</p>
        </Link>
      </div>
    </Layout>
  )
}
