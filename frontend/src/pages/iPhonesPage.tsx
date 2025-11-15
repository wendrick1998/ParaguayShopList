import { useState } from 'react'
import Layout from '../components/Layout'
import { Button, Input, Modal, Table, Select } from '../components/ui'
import { Plus, Search, Eye, Smartphone, Battery, DollarSign, Wrench } from 'lucide-react'
import { useToastStore } from '../store/toastStore'

export default function iPhonesPage() {
  const { success } = useToastStore()

  // Mock data atualizado com todos os campos necessários
  const [iphones, setiPhones] = useState([
    {
      id: 1,
      imei: '356789012345678',
      modelo: 'iPhone 15 Pro Max',
      capacidade: '256GB',
      cor: 'Titanium Blue',
      grade: 'A',
      batteryHealth: 95,

      // Custos de compra
      precoUSD: 850,
      cotacaoDolar: 5.85,
      custoBRL: 4972.50,

      // Frete e impostos
      freteUSD: 25,
      percentualFreteImportacao: 8, // 8% do valor para USA→PY
      freteBRL: 146.25,
      imposto: 767.63, // 60% sobre (valor + frete)

      // Custos adicionais
      custoAssistenciaTecnica: 150,
      custoReparo: 0,
      custoGarantia: 100,
      custoTotal: 6136.38,

      // Venda
      precoVendaBRL: 8500,
      percentualFreteVenda: 5, // 5% cobrado do cliente PY→BR
      freteClienteBRL: 425,
      margemLucro: 2363.62,
      margemPercentual: 38.5,

      status: 'estoque',
      vendido: false,
      fornecedor: 'TechAuction USA',
      dataCompra: '2024-01-15',
      observacoes: 'iPhone em perfeito estado, bateria original',
      createdAt: '2024-01-15T10:00:00.000Z'
    },
    {
      id: 2,
      imei: '356789012345679',
      modelo: 'iPhone 14 Pro',
      capacidade: '128GB',
      cor: 'Space Black',
      grade: 'B',
      batteryHealth: 85,

      precoUSD: 600,
      cotacaoDolar: 5.85,
      custoBRL: 3510,

      freteUSD: 25,
      percentualFreteImportacao: 8,
      freteBRL: 146.25,
      imposto: 548.44,

      custoAssistenciaTecnica: 120,
      custoReparo: 200, // Troca de tela
      custoGarantia: 80,
      custoTotal: 4604.69,

      precoVendaBRL: 6200,
      percentualFreteVenda: 5,
      freteClienteBRL: 310,
      margemLucro: 1595.31,
      margemPercentual: 34.6,

      status: 'vendido',
      vendido: true,
      fornecedor: 'eBay Seller',
      dataCompra: '2024-01-10',
      observacoes: 'Tela trocada, bateria em bom estado',
      createdAt: '2024-01-10T14:00:00.000Z'
    }
  ])

  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [showModal, setShowModal] = useState(false)
  const [showDetalhes, setShowDetalhes] = useState(false)
  const [selectedPhone, setSelectedPhone] = useState<any>(null)

  const [formData, setFormData] = useState({
    imei: '',
    modelo: '',
    capacidade: '128GB',
    cor: '',
    grade: 'A',
    batteryHealth: 100,
    fornecedor: '',

    precoUSD: 0,
    cotacaoDolar: 5.85,
    freteUSD: 25,
    percentualFreteImportacao: 8,

    custoAssistenciaTecnica: 0,
    custoReparo: 0,
    custoGarantia: 0,

    precoVendaBRL: 0,
    percentualFreteVenda: 5,

    observacoes: ''
  })

  const iphonesFiltrados = iphones.filter(p => {
    const matchBusca = p.modelo.toLowerCase().includes(busca.toLowerCase()) ||
      p.imei.includes(busca) ||
      p.cor.toLowerCase().includes(busca.toLowerCase())

    const matchStatus = filtroStatus === 'todos' || p.status === filtroStatus

    return matchBusca && matchStatus
  })

  const calcularCustos = (data: typeof formData) => {
    // Custo de compra em BRL
    const custoBRL = data.precoUSD * data.cotacaoDolar

    // Frete de importação (USA→PY)
    const freteUSD = data.freteUSD || (data.precoUSD * data.percentualFreteImportacao / 100)
    const freteBRL = freteUSD * data.cotacaoDolar

    // Imposto (60% sobre valor + frete)
    const baseCalculo = custoBRL + freteBRL
    const imposto = baseCalculo * 0.6

    // Custos adicionais
    const custoAssistenciaTecnica = data.custoAssistenciaTecnica || 0
    const custoReparo = data.custoReparo || 0
    const custoGarantia = data.custoGarantia || 0

    // Custo total
    const custoTotal = custoBRL + freteBRL + imposto + custoAssistenciaTecnica + custoReparo + custoGarantia

    // Frete para cliente (PY→BR)
    const freteClienteBRL = data.precoVendaBRL * data.percentualFreteVenda / 100

    // Margem de lucro
    const margemLucro = data.precoVendaBRL - custoTotal
    const margemPercentual = custoTotal > 0 ? (margemLucro / custoTotal) * 100 : 0

    return {
      custoBRL,
      freteUSD,
      freteBRL,
      imposto,
      custoAssistenciaTecnica,
      custoReparo,
      custoGarantia,
      custoTotal,
      freteClienteBRL,
      margemLucro,
      margemPercentual
    }
  }

  const handleSave = () => {
    const custos = calcularCustos(formData)

    const novo = {
      id: Math.max(...iphones.map(p => p.id), 0) + 1,
      ...formData,
      ...custos,
      leilaoId: null,
      dataCompra: new Date().toISOString().split('T')[0],
      vendido: false,
      vendaId: null,
      envioId: null,
      status: 'comprado',
      lojaId: 1,
      createdAt: new Date().toISOString()
    }

    setiPhones([novo, ...iphones] as any)
    success('iPhone cadastrado com sucesso!')
    setShowModal(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      imei: '',
      modelo: '',
      capacidade: '128GB',
      cor: '',
      grade: 'A',
      batteryHealth: 100,
      fornecedor: '',
      precoUSD: 0,
      cotacaoDolar: 5.85,
      freteUSD: 25,
      percentualFreteImportacao: 8,
      custoAssistenciaTecnica: 0,
      custoReparo: 0,
      custoGarantia: 0,
      precoVendaBRL: 0,
      percentualFreteVenda: 5,
      observacoes: ''
    })
  }

  const verDetalhes = (phone: any) => {
    setSelectedPhone(phone)
    setShowDetalhes(true)
  }

  const getGradeColor = (grade: string) => {
    const colors: any = {
      'A+': 'bg-green-100 text-green-800 border-green-300',
      'A': 'bg-green-100 text-green-700 border-green-200',
      'AB': 'bg-blue-100 text-blue-700 border-blue-200',
      'B': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'C': 'bg-orange-100 text-orange-700 border-orange-200'
    }
    return colors[grade] || 'bg-gray-100 text-gray-700'
  }

  const getBatteryColor = (health: number) => {
    if (health >= 90) return 'text-green-600'
    if (health >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const columns = [
    {
      key: 'modelo',
      title: 'iPhone',
      render: (row: any) => (
        <div>
          <p className="font-semibold text-gray-900">{row.modelo}</p>
          <p className="text-xs text-gray-500">{row.capacidade} • {row.cor}</p>
          <p className="text-xs font-mono text-gray-400 mt-1">{row.imei}</p>
        </div>
      )
    },
    {
      key: 'grade',
      title: 'Grade',
      render: (row: any) => (
        <div className="flex flex-col gap-1">
          <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getGradeColor(row.grade)}`}>
            Grade {row.grade}
          </span>
          <div className="flex items-center gap-1 text-xs">
            <Battery size={12} className={getBatteryColor(row.batteryHealth)} />
            <span className={`font-semibold ${getBatteryColor(row.batteryHealth)}`}>
              {row.batteryHealth}%
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'custos',
      title: 'Custo Total',
      render: (row: any) => (
        <div>
          <p className="font-bold text-red-600">R$ {row.custoTotal.toFixed(2)}</p>
          <p className="text-xs text-gray-500">$ {row.precoUSD.toFixed(2)} USD</p>
        </div>
      )
    },
    {
      key: 'venda',
      title: 'Preço Venda',
      render: (row: any) => (
        <div>
          <p className="font-bold text-green-600">R$ {row.precoVendaBRL.toFixed(2)}</p>
          {row.margemLucro && (
            <p className="text-xs text-gray-600">
              Lucro: R$ {row.margemLucro.toFixed(2)}
            </p>
          )}
        </div>
      )
    },
    {
      key: 'margem',
      title: 'Margem',
      render: (row: any) => (
        <div className="text-center">
          <p className={`text-xl font-bold ${row.margemPercentual >= 30 ? 'text-green-600' : 'text-yellow-600'}`}>
            {row.margemPercentual?.toFixed(1)}%
          </p>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (row: any) => {
        const statusConfig: any = {
          comprado: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Comprado' },
          em_transito: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Em Trânsito' },
          estoque: { bg: 'bg-green-100', text: 'text-green-800', label: 'Em Estoque' },
          vendido: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Vendido' }
        }
        const config = statusConfig[row.status] || statusConfig.estoque
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
            {config.label}
          </span>
        )
      }
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

  // Estatísticas
  const totalIPhones = iphones.length
  const emEstoque = iphones.filter(i => i.status === 'estoque').length
  const vendidos = iphones.filter(i => i.vendido).length
  const investidoUSD = iphones.reduce((acc, i) => acc + i.precoUSD, 0)
  const lucroTotal = iphones.filter(i => i.vendido).reduce((acc, i) => acc + (i.margemLucro || 0), 0)

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Smartphone size={32} className="text-primary-600" />
            Gestão de iPhones
          </h1>
          <p className="text-gray-600 mt-1">Controle completo de importação e vendas</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={18} className="mr-2" />
          Novo iPhone
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="text-primary-600" size={20} />
            <p className="text-sm text-gray-500">Total</p>
          </div>
          <p className="text-3xl font-bold text-primary-600">{totalIPhones}</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <Package className="text-green-600" size={20} />
            <p className="text-sm text-gray-500">Em Estoque</p>
          </div>
          <p className="text-3xl font-bold text-green-600">{emEstoque}</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-blue-600" size={20} />
            <p className="text-sm text-gray-500">Vendidos</p>
          </div>
          <p className="text-3xl font-bold text-blue-600">{vendidos}</p>
        </div>

        <div className="card">
          <p className="text-sm text-gray-500 mb-2">Investido (USD)</p>
          <p className="text-2xl font-bold text-red-600">$ {investidoUSD.toFixed(2)}</p>
        </div>

        <div className="card">
          <p className="text-sm text-gray-500 mb-2">Lucro Total</p>
          <p className="text-2xl font-bold text-green-600">R$ {lucroTotal.toFixed(2)}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Buscar"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por modelo, IMEI ou cor..."
            leftIcon={<Search size={18} className="text-gray-400" />}
          />

          <Select
            label="Status"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            options={[
              { value: 'todos', label: 'Todos os Status' },
              { value: 'comprado', label: 'Comprados' },
              { value: 'em_transito', label: 'Em Trânsito' },
              { value: 'estoque', label: 'Em Estoque' },
              { value: 'vendido', label: 'Vendidos' }
            ]}
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="card overflow-x-auto">
        <Table
          columns={columns}
          data={iphonesFiltrados}
          keyExtractor={(row) => row.id}
        />
      </div>

      {/* Modal de Cadastro */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Cadastrar Novo iPhone"
        size="xl"
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* Informações Básicas */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="IMEI"
                value={formData.imei}
                onChange={(e) => setFormData({ ...formData, imei: e.target.value })}
                placeholder="356789012345678"
                required
              />

              <Input
                label="Modelo"
                value={formData.modelo}
                onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                placeholder="iPhone 15 Pro Max"
                required
              />

              <Select
                label="Capacidade"
                value={formData.capacidade}
                onChange={(e) => setFormData({ ...formData, capacidade: e.target.value })}
                options={[
                  { value: '64GB', label: '64GB' },
                  { value: '128GB', label: '128GB' },
                  { value: '256GB', label: '256GB' },
                  { value: '512GB', label: '512GB' },
                  { value: '1TB', label: '1TB' }
                ]}
                required
              />

              <Input
                label="Cor"
                value={formData.cor}
                onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                placeholder="Titanium Blue, Space Black..."
                required
              />

              <Select
                label="Grade (Condição)"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                options={[
                  { value: 'A+', label: 'Grade A+ (Perfeito)' },
                  { value: 'A', label: 'Grade A (Excelente)' },
                  { value: 'AB', label: 'Grade AB (Muito Bom)' },
                  { value: 'B', label: 'Grade B (Bom)' },
                  { value: 'C', label: 'Grade C (Aceitável)' }
                ]}
                required
              />

              <Input
                label="Saúde da Bateria (%)"
                type="number"
                min="0"
                max="100"
                value={formData.batteryHealth}
                onChange={(e) => setFormData({ ...formData, batteryHealth: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          {/* Custos de Compra */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Custos de Compra</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Fornecedor"
                value={formData.fornecedor}
                onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
                placeholder="eBay, Copart..."
              />

              <Input
                label="Preço de Compra (USD)"
                type="number"
                step="0.01"
                value={formData.precoUSD}
                onChange={(e) => setFormData({ ...formData, precoUSD: Number(e.target.value) })}
                required
              />

              <Input
                label="Cotação do Dólar (BRL)"
                type="number"
                step="0.01"
                value={formData.cotacaoDolar}
                onChange={(e) => setFormData({ ...formData, cotacaoDolar: Number(e.target.value) })}
                required
              />

              <div className="col-span-full md:col-span-2">
                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  💰 Custo em BRL: <strong>R$ {(formData.precoUSD * formData.cotacaoDolar).toFixed(2)}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Frete e Impostos */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Frete e Impostos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Frete Importação (USD)"
                type="number"
                step="0.01"
                value={formData.freteUSD}
                onChange={(e) => setFormData({ ...formData, freteUSD: Number(e.target.value) })}
              />

              <Input
                label="% Frete USA→PY"
                type="number"
                step="0.1"
                value={formData.percentualFreteImportacao}
                onChange={(e) => setFormData({ ...formData, percentualFreteImportacao: Number(e.target.value) })}
              />

              <div className="col-span-full">
                <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                  📦 Frete em BRL: <strong>R$ {(formData.freteUSD * formData.cotacaoDolar).toFixed(2)}</strong>
                  <br />
                  🏛️ Imposto (60%): <strong>R$ {((formData.precoUSD * formData.cotacaoDolar + formData.freteUSD * formData.cotacaoDolar) * 0.6).toFixed(2)}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Custos Adicionais */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Wrench size={20} className="text-orange-600" />
              Custos Adicionais (BRL)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Assistência Técnica"
                type="number"
                step="0.01"
                value={formData.custoAssistenciaTecnica}
                onChange={(e) => setFormData({ ...formData, custoAssistenciaTecnica: Number(e.target.value) })}
                placeholder="0.00"
              />

              <Input
                label="Reparo/Troca de Peças"
                type="number"
                step="0.01"
                value={formData.custoReparo}
                onChange={(e) => setFormData({ ...formData, custoReparo: Number(e.target.value) })}
                placeholder="0.00"
              />

              <Input
                label="Garantia"
                type="number"
                step="0.01"
                value={formData.custoGarantia}
                onChange={(e) => setFormData({ ...formData, custoGarantia: Number(e.target.value) })}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Venda */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Venda</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Preço de Venda (BRL)"
                type="number"
                step="0.01"
                value={formData.precoVendaBRL}
                onChange={(e) => setFormData({ ...formData, precoVendaBRL: Number(e.target.value) })}
                placeholder="0.00"
                required
              />

              <Input
                label="% Frete PY→BR (cobrado do cliente)"
                type="number"
                step="0.1"
                value={formData.percentualFreteVenda}
                onChange={(e) => setFormData({ ...formData, percentualFreteVenda: Number(e.target.value) })}
              />

              <div className="col-span-full">
                {formData.precoVendaBRL > 0 && (() => {
                  const custos = calcularCustos(formData)
                  return (
                    <div className="bg-green-50 p-4 rounded-lg space-y-2">
                      <p className="text-sm text-gray-700">
                        💵 <strong>Custo Total:</strong> R$ {custos.custoTotal.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-700">
                        🚚 <strong>Frete Cliente:</strong> R$ {custos.freteClienteBRL.toFixed(2)} ({formData.percentualFreteVenda}%)
                      </p>
                      <p className="text-lg font-bold text-green-700">
                        💰 <strong>Lucro:</strong> R$ {custos.margemLucro.toFixed(2)} ({custos.margemPercentual.toFixed(1)}%)
                      </p>
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>

          {/* Observações */}
          <div>
            <Input
              label="Observações"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Informações adicionais sobre o iPhone..."
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowModal(false)} fullWidth>
              Cancelar
            </Button>
            <Button onClick={handleSave} fullWidth>
              Salvar iPhone
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Detalhes */}
      <Modal
        isOpen={showDetalhes}
        onClose={() => setShowDetalhes(false)}
        title="Detalhes do iPhone"
        size="xl"
      >
        {selectedPhone && (
          <div className="space-y-6">
            {/* Header com modelo e grade */}
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-6 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedPhone.modelo}</h2>
                  <p className="text-lg text-gray-600 mt-1">{selectedPhone.capacidade} • {selectedPhone.cor}</p>
                  <p className="text-sm font-mono text-gray-500 mt-2">IMEI: {selectedPhone.imei}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-4 py-2 rounded-lg text-sm font-bold border ${getGradeColor(selectedPhone.grade)}`}>
                    Grade {selectedPhone.grade}
                  </span>
                  <div className="flex items-center justify-end gap-2 mt-2">
                    <Battery size={16} className={getBatteryColor(selectedPhone.batteryHealth)} />
                    <span className={`text-lg font-bold ${getBatteryColor(selectedPhone.batteryHealth)}`}>
                      {selectedPhone.batteryHealth}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Custos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">💵 Custos de Compra</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Preço (USD):</span>
                    <span className="font-semibold">$ {selectedPhone.precoUSD.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Cotação:</span>
                    <span className="font-semibold">R$ {selectedPhone.cotacaoDolar.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Custo BRL:</span>
                    <span className="font-semibold">R$ {selectedPhone.custoBRL.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Frete:</span>
                    <span className="font-semibold">R$ {selectedPhone.freteBRL.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Imposto (60%):</span>
                    <span className="font-semibold">R$ {selectedPhone.imposto.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">🔧 Custos Adicionais</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Assistência Técnica:</span>
                    <span className="font-semibold">R$ {selectedPhone.custoAssistenciaTecnica.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Reparo/Peças:</span>
                    <span className="font-semibold">R$ {selectedPhone.custoReparo.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Garantia:</span>
                    <span className="font-semibold">R$ {selectedPhone.custoGarantia.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-sm font-bold">CUSTO TOTAL:</span>
                    <span className="font-bold text-red-600 text-lg">R$ {selectedPhone.custoTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">💰 Venda</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Preço de Venda:</span>
                    <span className="font-bold text-green-600 text-lg">R$ {selectedPhone.precoVendaBRL.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Frete Cliente ({selectedPhone.percentualFreteVenda}%):</span>
                    <span className="font-semibold">R$ {selectedPhone.freteClienteBRL.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-sm font-bold">LUCRO:</span>
                    <span className="font-bold text-green-600 text-lg">R$ {selectedPhone.margemLucro.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Margem:</span>
                    <span className="font-bold text-green-600 text-xl">{selectedPhone.margemPercentual.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">📋 Informações Adicionais</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Fornecedor:</span>
                    <p className="font-semibold">{selectedPhone.fornecedor}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Data de Compra:</span>
                    <p className="font-semibold">{new Date(selectedPhone.dataCompra).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Status:</span>
                    <p className="font-semibold">{selectedPhone.vendido ? 'Vendido' : 'Disponível'}</p>
                  </div>
                </div>
              </div>
            </div>

            {selectedPhone.observacoes && (
              <div className="card">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">📝 Observações</h3>
                <p className="text-sm text-gray-700">{selectedPhone.observacoes}</p>
              </div>
            )}

            <Button onClick={() => setShowDetalhes(false)} fullWidth>
              Fechar
            </Button>
          </div>
        )}
      </Modal>
    </Layout>
  )
}

// Import necessário para ícone Package
import { Package } from 'lucide-react'
