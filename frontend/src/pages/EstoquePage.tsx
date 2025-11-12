import { useState } from 'react'
import Layout from '../components/Layout'
import { Button, Modal, Select, Input, Table } from '../components/ui'
import { Plus, ArrowUp, ArrowDown, Settings } from 'lucide-react'
import { mockMovimentacoes, mockProdutos } from '../data/mockData'
import { useToastStore } from '../store/toastStore'

export default function EstoquePage() {
  const [movimentacoes, setMovimentacoes] = useState(mockMovimentacoes)
  const [showModal, setShowModal] = useState(false)
  const { success } = useToastStore()

  const [formData, setFormData] = useState({
    produtoId: '',
    tipo: 'entrada',
    quantidade: 0,
    motivo: ''
  })

  const handleSave = () => {
    const produto = mockProdutos.find(p => p.id === Number(formData.produtoId))
    if (!produto) return

    const nova = {
      id: Math.max(...movimentacoes.map(m => m.id)) + 1,
      ...formData,
      produtoId: Number(formData.produtoId),
      produto: { nome: produto.nome },
      lojaId: 1,
      observacoes: null,
      createdAt: new Date().toISOString()
    }

    setMovimentacoes([nova, ...movimentacoes])
    success(`Movimentação de ${formData.tipo} registrada com sucesso!`)
    setShowModal(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      produtoId: '',
      tipo: 'entrada',
      quantidade: 0,
      motivo: ''
    })
  }

  const columns = [
    {
      key: 'createdAt', title: 'Data', render: (row: any) =>
        new Date(row.createdAt).toLocaleString('pt-BR')
    },
    { key: 'produto', title: 'Produto', render: (row: any) => row.produto.nome },
    {
      key: 'tipo', title: 'Tipo', render: (row: any) => {
        const icons = { entrada: <ArrowUp size={16} />, saida: <ArrowDown size={16} />, ajuste: <Settings size={16} /> }
        const colors = { entrada: 'text-green-600', saida: 'text-red-600', ajuste: 'text-blue-600' }
        return (
          <span className={`flex items-center gap-2 ${colors[row.tipo as keyof typeof colors]}`}>
            {icons[row.tipo as keyof typeof icons]}
            {row.tipo.charAt(0).toUpperCase() + row.tipo.slice(1)}
          </span>
        )
      }
    },
    {
      key: 'quantidade', title: 'Quantidade', render: (row: any) => {
        const sign = row.tipo === 'entrada' ? '+' : row.tipo === 'saida' ? '-' : ''
        const color = row.tipo === 'entrada' ? 'text-green-600' : row.tipo === 'saida' ? 'text-red-600' : 'text-blue-600'
        return <span className={`font-semibold ${color}`}>{sign}{row.quantidade}</span>
      }
    },
    { key: 'motivo', title: 'Motivo', render: (row: any) => row.motivo || '-' }
  ]

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Estoque</h1>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={18} className="mr-2" />
          Nova Movimentação
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <ArrowUp className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Entradas</p>
              <p className="text-2xl font-bold text-green-600">
                {movimentacoes.filter(m => m.tipo === 'entrada').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <ArrowDown className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Saídas</p>
              <p className="text-2xl font-bold text-red-600">
                {movimentacoes.filter(m => m.tipo === 'saida').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Settings className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ajustes</p>
              <p className="text-2xl font-bold text-blue-600">
                {movimentacoes.filter(m => m.tipo === 'ajuste').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Movimentações</h2>
        <Table
          columns={columns}
          data={movimentacoes}
          keyExtractor={(row) => row.id}
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Nova Movimentação"
      >
        <div className="space-y-4">
          <Select
            label="Produto"
            value={formData.produtoId}
            onChange={(e) => setFormData({ ...formData, produtoId: e.target.value })}
            options={mockProdutos.map(p => ({ value: String(p.id), label: p.nome }))}
            placeholder="Selecione um produto"
            required
          />

          <Select
            label="Tipo de Movimentação"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
            options={[
              { value: 'entrada', label: 'Entrada' },
              { value: 'saida', label: 'Saída' },
              { value: 'ajuste', label: 'Ajuste' }
            ]}
            required
          />

          <Input
            label="Quantidade"
            type="number"
            value={formData.quantidade}
            onChange={(e) => setFormData({ ...formData, quantidade: Number(e.target.value) })}
            required
          />

          <Input
            label="Motivo"
            value={formData.motivo}
            onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
            placeholder="Ex: Compra de fornecedor, venda, produto vencido..."
          />

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowModal(false)} fullWidth>
              Cancelar
            </Button>
            <Button onClick={handleSave} fullWidth>
              Salvar
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}
