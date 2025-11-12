import { useState } from 'react'
import Layout from '../components/Layout'
import { Button, Input, Select, Modal } from '../components/ui'
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard } from 'lucide-react'
import { mockProdutos } from '../data/mockData'
import { useToastStore } from '../store/toastStore'

interface ItemCarrinho {
  produtoId: number
  nome: string
  precoUnit: number
  quantidade: number
  subtotal: number
}

export default function PDVPage() {
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([])
  const [busca, setBusca] = useState('')
  const [desconto, setDesconto] = useState(0)
  const [formaPagamento, setFormaPagamento] = useState('dinheiro')
  const [showModal, setShowModal] = useState(false)
  const { success } = useToastStore()

  const produtosFiltrados = mockProdutos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.codigoBarras?.includes(busca)
  )

  const adicionarProduto = (produto: typeof mockProdutos[0]) => {
    const itemExistente = carrinho.find(item => item.produtoId === produto.id)

    if (itemExistente) {
      setCarrinho(carrinho.map(item =>
        item.produtoId === produto.id
          ? { ...item, quantidade: item.quantidade + 1, subtotal: (item.quantidade + 1) * item.precoUnit }
          : item
      ))
    } else {
      setCarrinho([...carrinho, {
        produtoId: produto.id,
        nome: produto.nome,
        precoUnit: produto.preco,
        quantidade: 1,
        subtotal: produto.preco
      }])
    }
    setBusca('')
  }

  const alterarQuantidade = (produtoId: number, delta: number) => {
    setCarrinho(carrinho.map(item => {
      if (item.produtoId === produtoId) {
        const novaQtd = Math.max(1, item.quantidade + delta)
        return { ...item, quantidade: novaQtd, subtotal: novaQtd * item.precoUnit }
      }
      return item
    }))
  }

  const removerItem = (produtoId: number) => {
    setCarrinho(carrinho.filter(item => item.produtoId !== produtoId))
  }

  const total = carrinho.reduce((acc, item) => acc + item.subtotal, 0)
  const totalComDesconto = total - desconto

  const finalizarVenda = () => {
    if (carrinho.length === 0) {
      return
    }
    setShowModal(true)
  }

  const confirmarVenda = () => {
    const numero = `V${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`
    success(`Venda ${numero} finalizada com sucesso!`)
    setCarrinho([])
    setDesconto(0)
    setFormaPagamento('dinheiro')
    setShowModal(false)
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Lista de Produtos */}
        <div className="lg:col-span-2">
          <div className="card h-full">
            <h2 className="text-2xl font-bold mb-4">Produtos</h2>

            <div className="mb-4">
              <Input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome ou código de barras..."
                leftIcon={<Search size={18} className="text-gray-400" />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
              {produtosFiltrados.map((produto) => (
                <div
                  key={produto.id}
                  onClick={() => adicionarProduto(produto)}
                  className="p-4 border rounded-lg hover:border-primary-500 hover:bg-primary-50 cursor-pointer transition-all"
                >
                  <h3 className="font-semibold mb-1">{produto.nome}</h3>
                  <p className="text-sm text-gray-500 mb-2">{produto.descricao}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-primary-600">R$ {produto.preco.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Estoque: {produto.estoque.quantidade}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Carrinho */}
        <div className="card h-full flex flex-col">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <ShoppingCart size={24} />
            Carrinho
          </h2>

          <div className="flex-1 overflow-y-auto mb-4">
            {carrinho.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <ShoppingCart size={48} className="mx-auto mb-2 opacity-50" />
                <p>Carrinho vazio</p>
              </div>
            ) : (
              <div className="space-y-2">
                {carrinho.map((item) => (
                  <div key={item.produtoId} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm flex-1">{item.nome}</h4>
                      <button
                        onClick={() => removerItem(item.produtoId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => alterarQuantidade(item.produtoId, -1)}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-semibold w-8 text-center">{item.quantidade}</span>
                        <button
                          onClick={() => alterarQuantidade(item.produtoId, 1)}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="font-bold text-primary-600">R$ {item.subtotal.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resumo */}
          <div className="border-t pt-4 space-y-3">
            <Input
              label="Desconto (R$)"
              type="number"
              value={desconto}
              onChange={(e) => setDesconto(Number(e.target.value))}
              min="0"
              step="0.01"
            />

            <div className="space-y-2">
              <div className="flex justify-between text-lg">
                <span>Subtotal:</span>
                <span className="font-bold">R$ {total.toFixed(2)}</span>
              </div>
              {desconto > 0 && (
                <div className="flex justify-between text-sm text-orange-600">
                  <span>Desconto:</span>
                  <span>- R$ {desconto.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-2xl font-bold text-primary-600 pt-2 border-t">
                <span>Total:</span>
                <span>R$ {totalComDesconto.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={finalizarVenda}
              variant="success"
              size="lg"
              fullWidth
              disabled={carrinho.length === 0}
            >
              <CreditCard size={20} className="mr-2" />
              Finalizar Venda (F12)
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de Finalização */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Finalizar Venda"
        size="md"
      >
        <div className="space-y-4">
          <Select
            label="Forma de Pagamento"
            value={formaPagamento}
            onChange={(e) => setFormaPagamento(e.target.value)}
            options={[
              { value: 'dinheiro', label: 'Dinheiro' },
              { value: 'pix', label: 'PIX' },
              { value: 'debito', label: 'Débito' },
              { value: 'credito', label: 'Crédito' }
            ]}
          />

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span>Total:</span>
              <span className="font-bold">R$ {totalComDesconto.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Forma:</span>
              <span className="capitalize">{formaPagamento}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowModal(false)} fullWidth>
              Cancelar
            </Button>
            <Button variant="success" onClick={confirmarVenda} fullWidth>
              Confirmar Venda
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}
