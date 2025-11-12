import { useState } from 'react'
import Layout from '../components/Layout'
import { Button, Input, Modal, Table, EmptyState } from '../components/ui'
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react'
import { mockProdutos } from '../data/mockData'
import { useToastStore } from '../store/toastStore'

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState(mockProdutos)
  const [busca, setBusca] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [produtoEdit, setProdutoEdit] = useState<any>(null)
  const { success } = useToastStore()

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: 0,
    codigoBarras: '',
    quantidadeMinima: 10
  })

  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.codigoBarras?.includes(busca)
  )

  const handleSave = () => {
    if (produtoEdit) {
      setProdutos(produtos.map(p => p.id === produtoEdit.id ? { ...p, ...formData } : p))
      success('Produto atualizado com sucesso!')
    } else {
      const novo = {
        id: Math.max(...produtos.map(p => p.id)) + 1,
        ...formData,
        lojaId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estoque: { quantidade: 0, quantidadeMinima: formData.quantidadeMinima }
      }
      setProdutos([...produtos, novo])
      success('Produto cadastrado com sucesso!')
    }
    setShowModal(false)
    setProdutoEdit(null)
    resetForm()
  }

  const handleEdit = (produto: any) => {
    setProdutoEdit(produto)
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao || '',
      preco: produto.preco,
      codigoBarras: produto.codigoBarras || '',
      quantidadeMinima: produto.estoque.quantidadeMinima
    })
    setShowModal(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setProdutos(produtos.filter(p => p.id !== id))
      success('Produto excluído com sucesso!')
    }
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      preco: 0,
      codigoBarras: '',
      quantidadeMinima: 10
    })
  }

  const handleNovo = () => {
    resetForm()
    setProdutoEdit(null)
    setShowModal(true)
  }

  const columns = [
    { key: 'id', title: 'ID', width: '5%' },
    { key: 'nome', title: 'Nome' },
    { key: 'preco', title: 'Preço', render: (row: any) => `R$ ${row.preco.toFixed(2)}` },
    { key: 'codigoBarras', title: 'Código', render: (row: any) => row.codigoBarras || '-' },
    {
      key: 'estoque', title: 'Estoque', render: (row: any) => (
        <span className={row.estoque.quantidade < row.estoque.quantidadeMinima ? 'text-orange-600 font-semibold' : ''}>
          {row.estoque.quantidade} un
        </span>
      )
    },
    {
      key: 'actions', title: 'Ações', render: (row: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(row)} className="text-primary-600 hover:text-primary-800">
            <Edit size={18} />
          </button>
          <button onClick={() => handleDelete(row.id)} className="text-red-600 hover:text-red-800">
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ]

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <Button onClick={handleNovo}>
          <Plus size={18} className="mr-2" />
          Novo Produto
        </Button>
      </div>

      <div className="card mb-6">
        <Input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar produtos..."
          leftIcon={<Search size={18} className="text-gray-400" />}
        />
      </div>

      <Table
        columns={columns}
        data={produtosFiltrados}
        keyExtractor={(row) => row.id}
        emptyState={<EmptyState icon={<Package size={64} />} title="Nenhum produto encontrado" description="Cadastre seu primeiro produto para começar" />}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={produtoEdit ? 'Editar Produto' : 'Novo Produto'}
      >
        <div className="space-y-4">
          <Input
            label="Nome do Produto"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            required
          />
          <Input
            label="Descrição"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          />
          <Input
            label="Preço (R$)"
            type="number"
            step="0.01"
            value={formData.preco}
            onChange={(e) => setFormData({ ...formData, preco: Number(e.target.value) })}
            required
          />
          <Input
            label="Código de Barras"
            value={formData.codigoBarras}
            onChange={(e) => setFormData({ ...formData, codigoBarras: e.target.value })}
          />
          <Input
            label="Quantidade Mínima"
            type="number"
            value={formData.quantidadeMinima}
            onChange={(e) => setFormData({ ...formData, quantidadeMinima: Number(e.target.value) })}
            required
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
