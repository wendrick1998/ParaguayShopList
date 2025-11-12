import { useState } from 'react'
import Layout from '../components/Layout'
import { Table, Modal, Button } from '../components/ui'
import { Eye } from 'lucide-react'
import { mockVendas } from '../data/mockData'

export default function VendasPage() {
  const [vendas] = useState(mockVendas)
  const [selectedVenda, setSelectedVenda] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  const handleView = (venda: any) => {
    setSelectedVenda(venda)
    setShowModal(true)
  }

  const columns = [
    { key: 'numero', title: 'Número' },
    {
      key: 'createdAt', title: 'Data', render: (row: any) =>
        new Date(row.createdAt).toLocaleString('pt-BR')
    },
    { key: 'usuario', title: 'Vendedor', render: (row: any) => row.usuario.nome },
    { key: 'total', title: 'Total', render: (row: any) => `R$ ${row.total.toFixed(2)}` },
    { key: 'formaPagamento', title: 'Pagamento', render: (row: any) => row.formaPagamento.toUpperCase() },
    {
      key: 'status', title: 'Status', render: (row: any) => (
        <span className={`px-2 py-1 rounded text-sm ${row.status === 'concluida' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.status}
        </span>
      )
    },
    {
      key: 'actions', title: 'Ações', render: (row: any) => (
        <button onClick={() => handleView(row)} className="text-primary-600 hover:text-primary-800">
          <Eye size={18} />
        </button>
      )
    }
  ]

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Vendas</h1>
        <p className="text-gray-600 mt-1">Histórico de todas as vendas</p>
      </div>

      <Table
        columns={columns}
        data={vendas}
        keyExtractor={(row) => row.id}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Venda ${selectedVenda?.numero}`}
        size="lg"
      >
        {selectedVenda && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Data</p>
                <p className="font-semibold">{new Date(selectedVenda.createdAt).toLocaleString('pt-BR')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Vendedor</p>
                <p className="font-semibold">{selectedVenda.usuario.nome}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Forma de Pagamento</p>
                <p className="font-semibold uppercase">{selectedVenda.formaPagamento}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-semibold capitalize">{selectedVenda.status}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Itens</h3>
              <div className="space-y-2">
                {selectedVenda.itens.map((item: any) => (
                  <div key={item.id} className="flex justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-semibold">{item.produto.nome}</p>
                      <p className="text-sm text-gray-600">{item.quantidade}x R$ {item.precoUnit.toFixed(2)}</p>
                    </div>
                    <p className="font-bold">R$ {item.subtotal.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary-600">R$ {selectedVenda.total.toFixed(2)}</span>
              </div>
            </div>

            {selectedVenda.observacoes && (
              <div>
                <p className="text-sm text-gray-500">Observações</p>
                <p className="text-sm">{selectedVenda.observacoes}</p>
              </div>
            )}

            <Button onClick={() => setShowModal(false)} fullWidth>
              Fechar
            </Button>
          </div>
        )}
      </Modal>
    </Layout>
  )
}
