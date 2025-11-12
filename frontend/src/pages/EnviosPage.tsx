import { useState } from 'react'
import Layout from '../components/Layout'
import { Button, Input, Modal, Table, Select } from '../components/ui'
import { Plus, Eye, Truck, MapPin, Package } from 'lucide-react'
import { useToastStore } from '../store/toastStore'

export default function EnviosPage() {
  const { success } = useToastStore()

  // Mock data de envios
  const [envios, setEnvios] = useState([
    {
      id: 1,
      codigoRastreamento: 'USPS9876543210',
      origem: 'Miami, FL - USA',
      destinoIntermediario: 'Asunción - Paraguai',
      destinoFinal: 'São Paulo - Brasil',
      freteiro: 'DHL Express',
      freteiroParaguai: 'Trans Paraguay',
      freteiroBrasil: 'Jadlog',

      status: 'em_transito_br',

      // Datas
      dataEnvioUSA: '2024-01-10',
      dataChegadaPY: '2024-01-15',
      dataEnvioBR: '2024-01-16',
      previsaoEntregaBR: '2024-01-20',
      dataEntrega: null,

      // Custos
      custoFreteUSD: 85,
      percentualFreteImportacao: 8,
      custoFreteBRL: 496.88, // 85 * 5.85
      custoFretePYBR: 120,
      percentualFreteVenda: 5,

      // iPhones no envio
      quantidadeiPhones: 3,
      valorTotaliPhones: 2400,

      observacoes: 'Envio com 3 iPhones 15 Pro',
      createdAt: '2024-01-10T10:00:00.000Z'
    },
    {
      id: 2,
      codigoRastreamento: 'FDX1234567890',
      origem: 'Los Angeles, CA - USA',
      destinoIntermediario: 'Ciudad del Este - Paraguai',
      destinoFinal: 'Rio de Janeiro - Brasil',
      freteiro: 'FedEx International',
      freteiroParaguai: 'Expreso Guarani',
      freteiroBrasil: 'Total Express',

      status: 'recebido_py',

      dataEnvioUSA: '2024-01-18',
      dataChegadaPY: '2024-01-22',
      dataEnvioBR: null,
      previsaoEntregaBR: '2024-01-28',
      dataEntrega: null,

      custoFreteUSD: 65,
      percentualFreteImportacao: 7,
      custoFreteBRL: 380.25,
      custoFretePYBR: 0,
      percentualFreteVenda: 5,

      quantidadeiPhones: 2,
      valorTotaliPhones: 1800,

      observacoes: 'Aguardando liberação alfandegária no Paraguai',
      createdAt: '2024-01-18T14:00:00.000Z'
    },
    {
      id: 3,
      codigoRastreamento: 'UPS5555666677',
      origem: 'New York, NY - USA',
      destinoIntermediario: 'Asunción - Paraguai',
      destinoFinal: 'Belo Horizonte - Brasil',
      freteiro: 'UPS',
      freteiroParaguai: 'Rapid Cargo',
      freteiroBrasil: 'Correios',

      status: 'entregue',

      dataEnvioUSA: '2024-01-05',
      dataChegadaPY: '2024-01-09',
      dataEnvioBR: '2024-01-10',
      previsaoEntregaBR: '2024-01-15',
      dataEntrega: '2024-01-14',

      custoFreteUSD: 50,
      percentualFreteImportacao: 6,
      custoFreteBRL: 292.50,
      custoFretePYBR: 95,
      percentualFreteVenda: 5,

      quantidadeiPhones: 1,
      valorTotaliPhones: 950,

      observacoes: 'Entrega realizada com sucesso',
      createdAt: '2024-01-05T08:00:00.000Z'
    }
  ])

  const [showModal, setShowModal] = useState(false)
  const [showDetalhes, setShowDetalhes] = useState(false)
  const [selectedEnvio, setSelectedEnvio] = useState<any>(null)

  const [formData, setFormData] = useState({
    codigoRastreamento: '',
    origem: 'Miami, FL - USA',
    destinoIntermediario: 'Asunción - Paraguai',
    destinoFinal: '',
    freteiro: '',
    freteiroParaguai: '',
    freteiroBrasil: '',
    custoFreteUSD: 0,
    percentualFreteImportacao: 8,
    custoFretePYBR: 0,
    percentualFreteVenda: 5,
    dataEnvioUSA: new Date().toISOString().split('T')[0],
    previsaoEntregaBR: '',
    observacoes: ''
  })

  const handleSave = () => {
    const novo = {
      id: Math.max(...envios.map(e => e.id), 0) + 1,
      ...formData,
      status: 'aguardando_envio',
      custoFreteBRL: formData.custoFreteUSD * 5.85, // Cotação fixa para o exemplo
      dataChegadaPY: null,
      dataEnvioBR: null,
      dataEntrega: null,
      quantidadeiPhones: 0,
      valorTotaliPhones: 0,
      createdAt: new Date().toISOString()
    }

    setEnvios([novo, ...envios] as any)
    success('Envio cadastrado com sucesso!')
    setShowModal(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      codigoRastreamento: '',
      origem: 'Miami, FL - USA',
      destinoIntermediario: 'Asunción - Paraguai',
      destinoFinal: '',
      freteiro: '',
      freteiroParaguai: '',
      freteiroBrasil: '',
      custoFreteUSD: 0,
      percentualFreteImportacao: 8,
      custoFretePYBR: 0,
      percentualFreteVenda: 5,
      dataEnvioUSA: new Date().toISOString().split('T')[0],
      previsaoEntregaBR: '',
      observacoes: ''
    })
  }

  const verDetalhes = (envio: any) => {
    setSelectedEnvio(envio)
    setShowDetalhes(true)
  }

  const getStatusConfig = (status: string) => {
    const configs: any = {
      aguardando_envio: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        label: 'Aguardando Envio',
        icon: '📦'
      },
      em_transito_usa_py: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        label: 'Em Trânsito (USA→PY)',
        icon: '✈️'
      },
      recebido_py: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Recebido no PY',
        icon: '🏢'
      },
      em_transito_br: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        label: 'Em Trânsito (PY→BR)',
        icon: '🚚'
      },
      entregue: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Entregue',
        icon: '✅'
      }
    }
    return configs[status] || configs.aguardando_envio
  }

  const columns = [
    {
      key: 'rastreamento',
      title: 'Rastreamento',
      render: (row: any) => (
        <div>
          <p className="font-mono font-semibold text-sm text-primary-600">{row.codigoRastreamento}</p>
          <p className="text-xs text-gray-500 mt-1">{row.freteiro}</p>
        </div>
      )
    },
    {
      key: 'rota',
      title: 'Rota',
      render: (row: any) => (
        <div className="text-xs">
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin size={12} className="text-blue-500" />
            <span>{row.origem}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 my-1">
            <span className="text-gray-400">→</span>
            <span>{row.destinoIntermediario}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin size={12} className="text-green-500" />
            <span>{row.destinoFinal || 'A definir'}</span>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (row: any) => {
        const config = getStatusConfig(row.status)
        return (
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
              {config.icon} {config.label}
            </span>
            {row.previsaoEntregaBR && (
              <p className="text-xs text-gray-500 mt-1">
                Previsão: {new Date(row.previsaoEntregaBR).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
        )
      }
    },
    {
      key: 'iphones',
      title: 'iPhones',
      render: (row: any) => (
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Package size={16} className="text-gray-400" />
            <span className="font-bold text-lg">{row.quantidadeiPhones}</span>
          </div>
          <p className="text-xs text-gray-500">
            $ {row.valorTotaliPhones.toFixed(2)}
          </p>
        </div>
      )
    },
    {
      key: 'custos',
      title: 'Custos Frete',
      render: (row: any) => (
        <div className="text-sm">
          <p className="text-gray-600">
            USA→PY: <span className="font-semibold">$ {row.custoFreteUSD.toFixed(2)}</span>
          </p>
          {row.custoFretePYBR > 0 && (
            <p className="text-gray-600 mt-1">
              PY→BR: <span className="font-semibold">R$ {row.custoFretePYBR.toFixed(2)}</span>
            </p>
          )}
        </div>
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

  // Estatísticas
  const totalEnvios = envios.length
  const emTransito = envios.filter(e => e.status.includes('transito')).length
  const entregues = envios.filter(e => e.status === 'entregue').length
  const totalCustoFrete = envios.reduce((acc, e) => acc + e.custoFreteBRL + e.custoFretePYBR, 0)

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Truck size={32} className="text-primary-600" />
            Envios & Rastreamento
          </h1>
          <p className="text-gray-600 mt-1">Gerencie envios USA → Paraguai → Brasil</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={18} className="mr-2" />
          Novo Envio
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <Package className="text-primary-600" size={20} />
            <p className="text-sm text-gray-500">Total de Envios</p>
          </div>
          <p className="text-3xl font-bold text-primary-600">{totalEnvios}</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="text-yellow-600" size={20} />
            <p className="text-sm text-gray-500">Em Trânsito</p>
          </div>
          <p className="text-3xl font-bold text-yellow-600">{emTransito}</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <Package className="text-green-600" size={20} />
            <p className="text-sm text-gray-500">Entregues</p>
          </div>
          <p className="text-3xl font-bold text-green-600">{entregues}</p>
        </div>

        <div className="card">
          <p className="text-sm text-gray-500 mb-2">Total Custos Frete</p>
          <p className="text-2xl font-bold text-red-600">R$ {totalCustoFrete.toFixed(2)}</p>
        </div>
      </div>

      {/* Tabela */}
      <div className="card overflow-x-auto">
        <Table
          columns={columns}
          data={envios}
          keyExtractor={(row) => row.id}
        />
      </div>

      {/* Modal de Cadastro */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Novo Envio"
        size="xl"
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* Informações de Rastreamento */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações de Rastreamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Código de Rastreamento"
                value={formData.codigoRastreamento}
                onChange={(e) => setFormData({ ...formData, codigoRastreamento: e.target.value })}
                placeholder="USPS9876543210"
                required
              />

              <Input
                label="Freteiro (USA→PY)"
                value={formData.freteiro}
                onChange={(e) => setFormData({ ...formData, freteiro: e.target.value })}
                placeholder="DHL, FedEx, UPS..."
                required
              />

              <Select
                label="Origem (USA)"
                value={formData.origem}
                onChange={(e) => setFormData({ ...formData, origem: e.target.value })}
                options={[
                  { value: 'Miami, FL - USA', label: 'Miami, FL' },
                  { value: 'Los Angeles, CA - USA', label: 'Los Angeles, CA' },
                  { value: 'New York, NY - USA', label: 'New York, NY' },
                  { value: 'Houston, TX - USA', label: 'Houston, TX' }
                ]}
                required
              />

              <Select
                label="Destino Intermediário (PY)"
                value={formData.destinoIntermediario}
                onChange={(e) => setFormData({ ...formData, destinoIntermediario: e.target.value })}
                options={[
                  { value: 'Asunción - Paraguai', label: 'Asunción' },
                  { value: 'Ciudad del Este - Paraguai', label: 'Ciudad del Este' }
                ]}
                required
              />
            </div>
          </div>

          {/* Freteiros */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Freteiros</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Freteiro no Paraguai"
                value={formData.freteiroParaguai}
                onChange={(e) => setFormData({ ...formData, freteiroParaguai: e.target.value })}
                placeholder="Trans Paraguay, Expreso Guarani..."
              />

              <Input
                label="Freteiro Brasil (PY→BR)"
                value={formData.freteiroBrasil}
                onChange={(e) => setFormData({ ...formData, freteiroBrasil: e.target.value })}
                placeholder="Jadlog, Total Express, Correios..."
              />

              <Input
                label="Destino Final (Brasil)"
                value={formData.destinoFinal}
                onChange={(e) => setFormData({ ...formData, destinoFinal: e.target.value })}
                placeholder="São Paulo, Rio de Janeiro..."
              />
            </div>
          </div>

          {/* Custos de Frete */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Custos de Frete</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Custo Frete USA→PY (USD)"
                type="number"
                step="0.01"
                value={formData.custoFreteUSD}
                onChange={(e) => setFormData({ ...formData, custoFreteUSD: Number(e.target.value) })}
                required
              />

              <Input
                label="% Frete Importação"
                type="number"
                step="0.1"
                value={formData.percentualFreteImportacao}
                onChange={(e) => setFormData({ ...formData, percentualFreteImportacao: Number(e.target.value) })}
              />

              <Input
                label="Custo Frete PY→BR (BRL)"
                type="number"
                step="0.01"
                value={formData.custoFretePYBR}
                onChange={(e) => setFormData({ ...formData, custoFretePYBR: Number(e.target.value) })}
              />

              <Input
                label="% Frete Venda (cobrado do cliente)"
                type="number"
                step="0.1"
                value={formData.percentualFreteVenda}
                onChange={(e) => setFormData({ ...formData, percentualFreteVenda: Number(e.target.value) })}
              />

              <div className="col-span-full">
                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  💰 Frete em BRL: <strong>R$ {(formData.custoFreteUSD * 5.85).toFixed(2)}</strong>
                  <br />
                  📦 Custo Total Frete: <strong>R$ {((formData.custoFreteUSD * 5.85) + formData.custoFretePYBR).toFixed(2)}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Datas */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Datas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Data de Envio (USA)"
                type="date"
                value={formData.dataEnvioUSA}
                onChange={(e) => setFormData({ ...formData, dataEnvioUSA: e.target.value })}
                required
              />

              <Input
                label="Previsão de Entrega (Brasil)"
                type="date"
                value={formData.previsaoEntregaBR}
                onChange={(e) => setFormData({ ...formData, previsaoEntregaBR: e.target.value })}
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <Input
              label="Observações"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Informações adicionais sobre o envio..."
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowModal(false)} fullWidth>
              Cancelar
            </Button>
            <Button onClick={handleSave} fullWidth>
              Salvar Envio
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Detalhes */}
      <Modal
        isOpen={showDetalhes}
        onClose={() => setShowDetalhes(false)}
        title="Detalhes do Envio"
        size="xl"
      >
        {selectedEnvio && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-6 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">Código de Rastreamento</p>
                  <h2 className="text-2xl font-mono font-bold text-gray-900">{selectedEnvio.codigoRastreamento}</h2>
                  <p className="text-sm text-gray-600 mt-2">{selectedEnvio.freteiro}</p>
                </div>
                <div className="text-right">
                  {(() => {
                    const config = getStatusConfig(selectedEnvio.status)
                    return (
                      <span className={`inline-block px-4 py-2 rounded-lg text-sm font-bold ${config.bg} ${config.text}`}>
                        {config.icon} {config.label}
                      </span>
                    )
                  })()}
                </div>
              </div>
            </div>

            {/* Timeline da Rota */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📍 Rota do Envio</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="w-0.5 h-full bg-blue-300 mt-2"></div>
                  </div>
                  <div className="pb-4">
                    <p className="font-semibold text-gray-900">Origem</p>
                    <p className="text-sm text-gray-600">{selectedEnvio.origem}</p>
                    {selectedEnvio.dataEnvioUSA && (
                      <p className="text-xs text-gray-500 mt-1">
                        Enviado: {new Date(selectedEnvio.dataEnvioUSA).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${selectedEnvio.dataChegadaPY ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
                    <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                  </div>
                  <div className="pb-4">
                    <p className="font-semibold text-gray-900">Destino Intermediário</p>
                    <p className="text-sm text-gray-600">{selectedEnvio.destinoIntermediario}</p>
                    {selectedEnvio.freteiroParaguai && (
                      <p className="text-xs text-gray-500">Freteiro: {selectedEnvio.freteiroParaguai}</p>
                    )}
                    {selectedEnvio.dataChegadaPY && (
                      <p className="text-xs text-gray-500 mt-1">
                        Recebido: {new Date(selectedEnvio.dataChegadaPY).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${selectedEnvio.dataEntrega ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Destino Final</p>
                    <p className="text-sm text-gray-600">{selectedEnvio.destinoFinal || 'A definir'}</p>
                    {selectedEnvio.freteiroBrasil && (
                      <p className="text-xs text-gray-500">Freteiro: {selectedEnvio.freteiroBrasil}</p>
                    )}
                    {selectedEnvio.dataEntrega ? (
                      <p className="text-xs text-green-600 font-semibold mt-1">
                        Entregue: {new Date(selectedEnvio.dataEntrega).toLocaleDateString('pt-BR')}
                      </p>
                    ) : selectedEnvio.previsaoEntregaBR && (
                      <p className="text-xs text-gray-500 mt-1">
                        Previsão: {new Date(selectedEnvio.previsaoEntregaBR).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Informações de Custos e iPhones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">💵 Custos de Frete</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">USA → PY:</span>
                    <span className="font-semibold">$ {selectedEnvio.custoFreteUSD.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Em BRL:</span>
                    <span className="font-semibold">R$ {selectedEnvio.custoFreteBRL.toFixed(2)}</span>
                  </div>
                  {selectedEnvio.custoFretePYBR > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm">PY → BR:</span>
                      <span className="font-semibold">R$ {selectedEnvio.custoFretePYBR.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-sm font-bold">TOTAL:</span>
                    <span className="font-bold text-red-600">
                      R$ {(selectedEnvio.custoFreteBRL + selectedEnvio.custoFretePYBR).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">📦 iPhones no Envio</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Quantidade:</span>
                    <span className="font-bold text-2xl text-primary-600">{selectedEnvio.quantidadeiPhones}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Valor Total:</span>
                    <span className="font-semibold">$ {selectedEnvio.valorTotaliPhones.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {selectedEnvio.observacoes && (
              <div className="card">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">📝 Observações</h3>
                <p className="text-sm text-gray-700">{selectedEnvio.observacoes}</p>
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
