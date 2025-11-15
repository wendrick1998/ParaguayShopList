import { useState } from 'react'
import Layout from '../components/Layout'
import { Button, Modal, Input, Table, Alert } from '../components/ui'
import { Wallet, DollarSign, TrendingUp } from 'lucide-react'
import { mockCaixas } from '../data/mockData'
import { useToastStore } from '../store/toastStore'

export default function CaixaPage() {
  const [caixas, setCaixas] = useState(mockCaixas)
  const [showModalAbrir, setShowModalAbrir] = useState(false)
  const [showModalFechar, setShowModalFechar] = useState(false)
  const [saldoInicial, setSaldoInicial] = useState(100)
  const [saldoFinal, setSaldoFinal] = useState(0)
  const { success } = useToastStore()

  const caixaAberto = caixas.find(c => c.status === 'aberto')

  const abrirCaixa = () => {
    const novo = {
      id: Math.max(...caixas.map(c => c.id)) + 1,
      lojaId: 1,
      usuarioId: 1,
      usuario: { nome: 'Admin Sistema' },
      dataAbertura: new Date().toISOString(),
      dataFechamento: null,
      saldoInicial,
      saldoFinal: null,
      totalVendas: 0,
      status: 'aberto',
      observacoes: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setCaixas([novo, ...caixas])
    success('Caixa aberto com sucesso!')
    setShowModalAbrir(false)
    setSaldoInicial(100)
  }

  const fecharCaixa = () => {
    if (!caixaAberto) return

    const atualizado = {
      ...caixaAberto,
      dataFechamento: new Date().toISOString(),
      saldoFinal,
      status: 'fechado',
      updatedAt: new Date().toISOString()
    }

    setCaixas(caixas.map(c => c.id === caixaAberto.id ? atualizado as any : c) as any)
    success('Caixa fechado com sucesso!')
    setShowModalFechar(false)
    setSaldoFinal(0)
  }

  const columns = [
    {
      key: 'dataAbertura', title: 'Abertura', render: (row: any) =>
        new Date(row.dataAbertura).toLocaleString('pt-BR')
    },
    {
      key: 'dataFechamento', title: 'Fechamento', render: (row: any) =>
        row.dataFechamento ? new Date(row.dataFechamento).toLocaleString('pt-BR') : '-'
    },
    { key: 'usuario', title: 'Usuário', render: (row: any) => row.usuario.nome },
    { key: 'saldoInicial', title: 'Inicial', render: (row: any) => `R$ ${row.saldoInicial.toFixed(2)}` },
    { key: 'totalVendas', title: 'Vendas', render: (row: any) => `R$ ${row.totalVendas.toFixed(2)}` },
    { key: 'saldoFinal', title: 'Final', render: (row: any) => row.saldoFinal ? `R$ ${row.saldoFinal.toFixed(2)}` : '-' },
    {
      key: 'status', title: 'Status', render: (row: any) => (
        <span className={`px-2 py-1 rounded text-sm ${row.status === 'aberto' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {row.status}
        </span>
      )
    }
  ]

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Controle de Caixa</h1>
      </div>

      {caixaAberto ? (
        <Alert type="success" title="Caixa Aberto" className="mb-6">
          <div className="mt-2">
            <p>Aberto em: {new Date(caixaAberto.dataAbertura).toLocaleString('pt-BR')}</p>
            <p>Saldo inicial: R$ {caixaAberto.saldoInicial.toFixed(2)}</p>
          </div>
        </Alert>
      ) : (
        <Alert type="warning" title="Nenhum caixa aberto" className="mb-6">
          Abra um caixa para começar a registrar vendas.
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Wallet className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Saldo Inicial</p>
              <p className="text-2xl font-bold">
                R$ {caixaAberto ? caixaAberto.saldoInicial.toFixed(2) : '0,00'}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Vendas</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {caixaAberto ? caixaAberto.totalVendas.toFixed(2) : '0,00'}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 rounded-lg">
              <TrendingUp className="text-primary-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Saldo Atual</p>
              <p className="text-2xl font-bold text-primary-600">
                R$ {caixaAberto ? (caixaAberto.saldoInicial + caixaAberto.totalVendas).toFixed(2) : '0,00'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <Button
          onClick={() => setShowModalAbrir(true)}
          variant="success"
          disabled={!!caixaAberto}
        >
          Abrir Caixa
        </Button>
        <Button
          onClick={() => setShowModalFechar(true)}
          variant="danger"
          disabled={!caixaAberto}
        >
          Fechar Caixa
        </Button>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Histórico de Caixas</h2>
        <Table
          columns={columns}
          data={caixas}
          keyExtractor={(row) => row.id}
        />
      </div>

      <Modal
        isOpen={showModalAbrir}
        onClose={() => setShowModalAbrir(false)}
        title="Abrir Caixa"
      >
        <div className="space-y-4">
          <Input
            label="Saldo Inicial (R$)"
            type="number"
            step="0.01"
            value={saldoInicial}
            onChange={(e) => setSaldoInicial(Number(e.target.value))}
            required
          />

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowModalAbrir(false)} fullWidth>
              Cancelar
            </Button>
            <Button variant="success" onClick={abrirCaixa} fullWidth>
              Abrir Caixa
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showModalFechar}
        onClose={() => setShowModalFechar(false)}
        title="Fechar Caixa"
      >
        <div className="space-y-4">
          {caixaAberto && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Saldo Inicial:</span>
                <span className="font-semibold">R$ {caixaAberto.saldoInicial.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Vendas:</span>
                <span className="font-semibold text-green-600">R$ {caixaAberto.totalVendas.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Saldo Esperado:</span>
                <span className="text-primary-600">
                  R$ {(caixaAberto.saldoInicial + caixaAberto.totalVendas).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <Input
            label="Saldo Final (R$)"
            type="number"
            step="0.01"
            value={saldoFinal}
            onChange={(e) => setSaldoFinal(Number(e.target.value))}
            required
            helperText="Digite o valor real contado no caixa"
          />

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowModalFechar(false)} fullWidth>
              Cancelar
            </Button>
            <Button variant="danger" onClick={fecharCaixa} fullWidth>
              Fechar Caixa
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}
