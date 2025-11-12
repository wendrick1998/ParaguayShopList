import { useState } from 'react'
import Layout from '../components/Layout'
import { Button, Input, Modal, Table } from '../components/ui'
import { Plus, TrendingUp, TrendingDown, DollarSign, RefreshCw, Calculator } from 'lucide-react'
import { useToastStore } from '../store/toastStore'

export default function CambioPage() {
  const { success, info } = useToastStore()

  // Cotação atual (simulada - futuramente integrar com AwesomeAPI ou Banco Central)
  const [cotacaoAtual, setCotacaoAtual] = useState({
    valor: 5.85,
    variacao: 0.02,
    percentualVariacao: 0.34,
    atualizadoEm: new Date().toISOString()
  })

  // Histórico de cotações registradas
  const [historico, setHistorico] = useState([
    {
      id: 1,
      data: '2024-01-25',
      cotacao: 5.85,
      tipo: 'compra',
      observacoes: 'Compra de lote de iPhones',
      createdAt: '2024-01-25T10:00:00.000Z'
    },
    {
      id: 2,
      data: '2024-01-20',
      cotacao: 5.83,
      tipo: 'referencia',
      observacoes: 'Cotação para cálculo de estoque',
      createdAt: '2024-01-20T15:30:00.000Z'
    },
    {
      id: 3,
      data: '2024-01-15',
      cotacao: 5.80,
      tipo: 'compra',
      observacoes: 'Compra leilão eBay',
      createdAt: '2024-01-15T09:00:00.000Z'
    },
    {
      id: 4,
      data: '2024-01-10',
      cotacao: 5.75,
      tipo: 'referencia',
      observacoes: 'Cotação do dia',
      createdAt: '2024-01-10T14:00:00.000Z'
    }
  ])

  const [showModal, setShowModal] = useState(false)
  const [showCalculadora, setShowCalculadora] = useState(false)

  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    cotacao: 0,
    tipo: 'referencia',
    observacoes: ''
  })

  // Calculadora
  const [valorUSD, setValorUSD] = useState(0)
  const [cotacaoCalc, setCotacaoCalc] = useState(cotacaoAtual.valor)

  const handleSave = () => {
    const novo = {
      id: Math.max(...historico.map(h => h.id), 0) + 1,
      ...formData,
      createdAt: new Date().toISOString()
    }

    setHistorico([novo, ...historico] as any)
    success('Cotação registrada com sucesso!')
    setShowModal(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      data: new Date().toISOString().split('T')[0],
      cotacao: 0,
      tipo: 'referencia',
      observacoes: ''
    })
  }

  const atualizarCotacao = () => {
    // Simula atualização da cotação (futuramente integrar com API)
    const novaVariacao = (Math.random() - 0.5) * 0.1
    const novaCotacao = cotacaoAtual.valor + novaVariacao
    const percentual = (novaVariacao / cotacaoAtual.valor) * 100

    setCotacaoAtual({
      valor: Number(novaCotacao.toFixed(2)),
      variacao: Number(novaVariacao.toFixed(4)),
      percentualVariacao: Number(percentual.toFixed(2)),
      atualizadoEm: new Date().toISOString()
    })

    info('Cotação atualizada!')
  }

  const columns = [
    {
      key: 'data',
      title: 'Data',
      render: (row: any) => (
        <div>
          <p className="font-semibold">{new Date(row.data).toLocaleDateString('pt-BR')}</p>
          <p className="text-xs text-gray-500">
            {new Date(row.createdAt).toLocaleTimeString('pt-BR')}
          </p>
        </div>
      )
    },
    {
      key: 'cotacao',
      title: 'Cotação',
      render: (row: any) => (
        <div className="text-center">
          <p className="text-xl font-bold text-green-600">R$ {row.cotacao.toFixed(4)}</p>
        </div>
      )
    },
    {
      key: 'tipo',
      title: 'Tipo',
      render: (row: any) => {
        const tipos: any = {
          compra: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Compra' },
          venda: { bg: 'bg-green-100', text: 'text-green-800', label: 'Venda' },
          referencia: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Referência' }
        }
        const config = tipos[row.tipo]
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
            {config.label}
          </span>
        )
      }
    },
    {
      key: 'observacoes',
      title: 'Observações',
      render: (row: any) => row.observacoes || '-'
    }
  ]

  // Estatísticas
  const mediaCotacao = historico.reduce((acc, h) => acc + h.cotacao, 0) / historico.length
  const maiorCotacao = Math.max(...historico.map(h => h.cotacao))
  const menorCotacao = Math.min(...historico.map(h => h.cotacao))
  const compras = historico.filter(h => h.tipo === 'compra').length

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <DollarSign size={32} className="text-green-600" />
            Controle de Câmbio USD/BRL
          </h1>
          <p className="text-gray-600 mt-1">Acompanhe a cotação do dólar em tempo real</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowCalculadora(true)}>
            <Calculator size={18} className="mr-2" />
            Calculadora
          </Button>
          <Button onClick={() => setShowModal(true)}>
            <Plus size={18} className="mr-2" />
            Registrar Cotação
          </Button>
        </div>
      </div>

      {/* Cotação Atual */}
      <div className="card mb-6 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600 mb-2">Cotação Atual (USD → BRL)</p>
            <div className="flex items-end gap-3">
              <p className="text-5xl font-bold text-green-600">
                R$ {cotacaoAtual.valor.toFixed(4)}
              </p>
              <div className="flex items-center gap-1 mb-2">
                {cotacaoAtual.variacao >= 0 ? (
                  <TrendingUp size={20} className="text-green-600" />
                ) : (
                  <TrendingDown size={20} className="text-red-600" />
                )}
                <span className={`text-lg font-semibold ${cotacaoAtual.variacao >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {cotacaoAtual.variacao >= 0 ? '+' : ''}{cotacaoAtual.variacao.toFixed(4)} ({cotacaoAtual.percentualVariacao}%)
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Última atualização: {new Date(cotacaoAtual.atualizadoEm).toLocaleString('pt-BR')}
            </p>
          </div>
          <Button variant="secondary" onClick={atualizarCotacao}>
            <RefreshCw size={18} className="mr-2" />
            Atualizar
          </Button>
        </div>

        {/* Conversão rápida */}
        <div className="mt-6 pt-6 border-t grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-xs text-gray-500">$ 100 USD</p>
            <p className="text-2xl font-bold text-gray-900">R$ {(100 * cotacaoAtual.valor).toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-xs text-gray-500">$ 500 USD</p>
            <p className="text-2xl font-bold text-gray-900">R$ {(500 * cotacaoAtual.valor).toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-xs text-gray-500">$ 1000 USD</p>
            <p className="text-2xl font-bold text-gray-900">R$ {(1000 * cotacaoAtual.valor).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Média Histórica</p>
          <p className="text-2xl font-bold text-blue-600">R$ {mediaCotacao.toFixed(4)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Maior Cotação</p>
          <p className="text-2xl font-bold text-red-600">R$ {maiorCotacao.toFixed(4)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Menor Cotação</p>
          <p className="text-2xl font-bold text-green-600">R$ {menorCotacao.toFixed(4)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Compras Registradas</p>
          <p className="text-2xl font-bold text-primary-600">{compras}</p>
        </div>
      </div>

      {/* Histórico */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Histórico de Cotações</h2>
        <Table
          columns={columns}
          data={historico}
          keyExtractor={(row) => row.id}
        />
      </div>

      {/* Modal Registrar Cotação */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Registrar Cotação"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Data"
            type="date"
            value={formData.data}
            onChange={(e) => setFormData({ ...formData, data: e.target.value })}
            required
          />

          <Input
            label="Cotação (BRL)"
            type="number"
            step="0.0001"
            value={formData.cotacao}
            onChange={(e) => setFormData({ ...formData, cotacao: Number(e.target.value) })}
            placeholder="5.8500"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, tipo: 'referencia' })}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  formData.tipo === 'referencia'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Referência
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, tipo: 'compra' })}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  formData.tipo === 'compra'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                Compra
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, tipo: 'venda' })}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  formData.tipo === 'venda'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                Venda
              </button>
            </div>
          </div>

          <Input
            label="Observações"
            value={formData.observacoes}
            onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
            placeholder="Ex: Compra de leilão, cotação do dia..."
          />

          {formData.cotacao > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Conversões:</strong>
              </p>
              <div className="space-y-1 text-sm">
                <p>$ 100 USD = <strong>R$ {(100 * formData.cotacao).toFixed(2)}</strong></p>
                <p>$ 500 USD = <strong>R$ {(500 * formData.cotacao).toFixed(2)}</strong></p>
                <p>$ 1000 USD = <strong>R$ {(1000 * formData.cotacao).toFixed(2)}</strong></p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowModal(false)} fullWidth>
              Cancelar
            </Button>
            <Button onClick={handleSave} fullWidth>
              Salvar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Calculadora */}
      <Modal
        isOpen={showCalculadora}
        onClose={() => setShowCalculadora(false)}
        title="Calculadora de Conversão"
        size="md"
      >
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Cotação para Cálculo</p>
            <p className="text-3xl font-bold text-green-600">R$ {cotacaoCalc.toFixed(4)}</p>
          </div>

          <Input
            label="Cotação (BRL)"
            type="number"
            step="0.0001"
            value={cotacaoCalc}
            onChange={(e) => setCotacaoCalc(Number(e.target.value))}
          />

          <Input
            label="Valor em USD ($)"
            type="number"
            step="0.01"
            value={valorUSD}
            onChange={(e) => setValorUSD(Number(e.target.value))}
            placeholder="1000.00"
          />

          {valorUSD > 0 && cotacaoCalc > 0 && (
            <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
              <p className="text-sm text-gray-600 mb-2">Valor em Reais (BRL)</p>
              <p className="text-4xl font-bold text-green-600">
                R$ {(valorUSD * cotacaoCalc).toFixed(2)}
              </p>

              <div className="mt-4 pt-4 border-t border-green-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Valor USD:</span>
                  <span className="font-semibold">$ {valorUSD.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cotação:</span>
                  <span className="font-semibold">R$ {cotacaoCalc.toFixed(4)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">+ Imposto (60%):</span>
                  <span className="font-semibold text-red-600">R$ {((valorUSD * cotacaoCalc) * 0.6).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t">
                  <span>Total com Imposto:</span>
                  <span className="text-green-600">R$ {((valorUSD * cotacaoCalc) * 1.6).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <Button onClick={() => setShowCalculadora(false)} fullWidth>
            Fechar
          </Button>
        </div>
      </Modal>

      {/* Nota sobre API */}
      <div className="card bg-blue-50 border border-blue-200 mt-6">
        <p className="text-sm text-gray-700">
          <strong>💡 Dica:</strong> Este módulo está preparado para integração com APIs de cotação em tempo real
          (AwesomeAPI ou Banco Central do Brasil). No momento, as cotações são simuladas para demonstração.
        </p>
      </div>
    </Layout>
  )
}
