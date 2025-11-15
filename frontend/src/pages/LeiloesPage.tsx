import { useState } from 'react'
import Layout from '../components/Layout'
import { Button, Input, Modal, Table, Select } from '../components/ui'
import { Plus, Eye, Gavel, Package } from 'lucide-react'
import { useToastStore } from '../store/toastStore'

export default function LeiloesPage() {
  const { success } = useToastStore()

  // Mock data for auctions
  const [leiloes, setLeiloes] = useState([
    {
      id: 1,
      plataforma: 'eBay',
      numeroLote: 'LOT-2024-001',
      data: '2024-01-15',
      valorTotalUSD: 4250,
      quantidadeiPhones: 5,
      status: 'recebido',
      fornecedor: 'TechAuction USA',
      observacoes: 'Lote com iPhones 15 Pro',
      createdAt: '2024-01-15T10:00:00.000Z'
    },
    {
      id: 2,
      plataforma: 'Copart',
      numeroLote: 'LOT-2024-002',
      data: '2024-01-20',
      valorTotalUSD: 3800,
      quantidadeiPhones: 4,
      status: 'em_transito',
      fornecedor: 'Copart Miami',
      observacoes: 'Lote misto - iPhone 14 e 15',
      createdAt: '2024-01-20T14:30:00.000Z'
    },
    {
      id: 3,
      plataforma: 'eBay',
      numeroLote: 'LOT-2024-003',
      data: '2024-01-25',
      valorTotalUSD: 2100,
      quantidadeiPhones: 2,
      status: 'arrematado',
      fornecedor: 'PhoneWholesale LLC',
      observacoes: 'iPhone 15 Pro Max 512GB',
      createdAt: '2024-01-25T16:00:00.000Z'
    }
  ])

  const [showModal, setShowModal] = useState(false)
  const [showDetalhes, setShowDetalhes] = useState(false)
  const [selectedLeilao, setSelectedLeilao] = useState<any>(null)

  const [formData, setFormData] = useState({
    plataforma: 'eBay',
    numeroLote: '',
    data: new Date().toISOString().split('T')[0],
    valorTotalUSD: 0,
    fornecedor: '',
    observacoes: ''
  })

  const handleSave = () => {
    const novo = {
      id: Math.max(...leiloes.map(l => l.id)) + 1,
      ...formData,
      quantidadeiPhones: 0,
      status: 'arrematado',
      createdAt: new Date().toISOString()
    }

    setLeiloes([novo, ...leiloes] as any)
    success('Leilão cadastrado com sucesso!')
    setShowModal(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      plataforma: 'eBay',
      numeroLote: '',
      data: new Date().toISOString().split('T')[0],
      valorTotalUSD: 0,
      fornecedor: '',
      observacoes: ''
    })
  }

  const verDetalhes = (leilao: any) => {
    setSelectedLeilao(leilao)
    setShowDetalhes(true)
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      arrematado: 'bg-blue-100 text-blue-800',
      pago: 'bg-purple-100 text-purple-800',
      em_transito: 'bg-yellow-100 text-yellow-800',
      recebido: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const labels: any = {
      arrematado: 'Arrematado',
      pago: 'Pago',
      em_transito: 'Em Trânsito',
      recebido: 'Recebido',
      cancelado: 'Cancelado'
    }
    return labels[status] || status
  }

  const columns = [
    {
      key: 'numeroLote',
      title: 'Lote',
      render: (row: any) => (
        <div>
          <p className="font-semibold">{row.numeroLote}</p>
          <p className="text-xs text-gray-500">{row.plataforma}</p>
        </div>
      )
    },
    {
      key: 'data',
      title: 'Data',
      render: (row: any) => new Date(row.data).toLocaleDateString('pt-BR')
    },
    {
      key: 'fornecedor',
      title: 'Fornecedor',
      render: (row: any) => row.fornecedor
    },
    {
      key: 'quantidadeiPhones',
      title: 'Qtd iPhones',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <Package size={16} className="text-gray-400" />
          <span className="font-semibold">{row.quantidadeiPhones}</span>
        </div>
      )
    },
    {
      key: 'valorTotalUSD',
      title: 'Valor Total',
      render: (row: any) => (
        <span className="font-bold text-green-600">
          $ {row.valorTotalUSD.toFixed(2)}
        </span>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (row: any) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.status)}`}>
          {getStatusLabel(row.status)}
        </span>
      )
    },
    {
      key: 'acoes',
      title: 'Ações',
      render: (row: any) => (
        <Button variant="ghost" onClick={() => verDetalhes(row)}>
          <Eye size={16} />
        </Button>
      )
    }
  ]

  // Calculate statistics
  const totalLeiloes = leiloes.length
  const totalInvestidoUSD = leiloes.reduce((acc, l) => acc + l.valorTotalUSD, 0)
  const totalIPhones = leiloes.reduce((acc, l) => acc + l.quantidadeiPhones, 0)
  const leiloesAtivos = leiloes.filter(l => l.status !== 'recebido' && l.status !== 'cancelado').length

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Gavel size={32} className="text-primary-600" />
            Leilões
          </h1>
          <p className="text-gray-600 mt-1">Gerencie compras de leilões nos EUA</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={18} className="mr-2" />
          Novo Leilão
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Total de Leilões</p>
          <p className="text-3xl font-bold text-primary-600">{totalLeiloes}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Investido (USD)</p>
          <p className="text-3xl font-bold text-green-600">$ {totalInvestidoUSD.toFixed(2)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Total de iPhones</p>
          <p className="text-3xl font-bold text-blue-600">{totalIPhones}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Leilões Ativos</p>
          <p className="text-3xl font-bold text-yellow-600">{leiloesAtivos}</p>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <Table
          columns={columns}
          data={leiloes}
          keyExtractor={(row) => row.id}
        />
      </div>

      {/* New Auction Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Novo Leilão"
        size="lg"
      >
        <div className="space-y-4">
          <Select
            label="Plataforma"
            value={formData.plataforma}
            onChange={(e) => setFormData({ ...formData, plataforma: e.target.value })}
            options={[
              { value: 'eBay', label: 'eBay' },
              { value: 'Copart', label: 'Copart' },
              { value: 'IAA', label: 'IAA (Insurance Auto Auctions)' },
              { value: 'Liquidation.com', label: 'Liquidation.com' },
              { value: 'Outro', label: 'Outro' }
            ]}
            required
          />

          <Input
            label="Número do Lote"
            value={formData.numeroLote}
            onChange={(e) => setFormData({ ...formData, numeroLote: e.target.value })}
            placeholder="Ex: LOT-2024-001"
            required
          />

          <Input
            label="Data do Leilão"
            type="date"
            value={formData.data}
            onChange={(e) => setFormData({ ...formData, data: e.target.value })}
            required
          />

          <Input
            label="Fornecedor/Vendedor"
            value={formData.fornecedor}
            onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
            placeholder="Nome do vendedor"
            required
          />

          <Input
            label="Valor Total (USD)"
            type="number"
            step="0.01"
            value={formData.valorTotalUSD}
            onChange={(e) => setFormData({ ...formData, valorTotalUSD: Number(e.target.value) })}
            placeholder="0.00"
            required
          />

          <Input
            label="Observações"
            value={formData.observacoes}
            onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
            placeholder="Detalhes sobre o leilão..."
          />

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowModal(false)} fullWidth>
              Cancelar
            </Button>
            <Button onClick={handleSave} fullWidth>
              Salvar Leilão
            </Button>
          </div>
        </div>
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={showDetalhes}
        onClose={() => setShowDetalhes(false)}
        title="Detalhes do Leilão"
        size="lg"
      >
        {selectedLeilao && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Plataforma</p>
                <p className="font-semibold">{selectedLeilao.plataforma}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Número do Lote</p>
                <p className="font-semibold">{selectedLeilao.numeroLote}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Data</p>
                <p className="font-semibold">
                  {new Date(selectedLeilao.data).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fornecedor</p>
                <p className="font-semibold">{selectedLeilao.fornecedor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Valor Total</p>
                <p className="font-bold text-green-600 text-xl">
                  $ {selectedLeilao.valorTotalUSD.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Quantidade de iPhones</p>
                <p className="font-bold text-blue-600 text-xl">
                  {selectedLeilao.quantidadeiPhones}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedLeilao.status)}`}>
                  {getStatusLabel(selectedLeilao.status)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Criado em</p>
                <p className="font-semibold">
                  {new Date(selectedLeilao.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>

            {selectedLeilao.observacoes && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Observações</p>
                <p className="p-3 bg-gray-50 rounded-lg">{selectedLeilao.observacoes}</p>
              </div>
            )}

            <div className="pt-4 border-t">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                iPhones vinculados a este leilão
              </p>
              <p className="text-sm text-gray-500">
                Funcionalidade em desenvolvimento - aqui serão listados todos os iPhones comprados neste leilão
              </p>
            </div>

            <Button onClick={() => setShowDetalhes(false)} fullWidth>
              Fechar
            </Button>
          </div>
        )}
      </Modal>
    </Layout>
  )
}
