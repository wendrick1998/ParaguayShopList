// Dados mockados específicos para negócio de importação de iPhones

export const mockLeiloes = [
  {
    id: 1,
    nome: 'Leilão eBay - Março 2024',
    site: 'eBay',
    dataLeilao: '2024-03-15T10:00:00Z',
    lote: 'LOT-12345',
    totalGastoUSD: 8500,
    totalGastoBRL: 42500, // cotação 5.00
    cotacaoDolar: 5.00,
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
  },
  {
    id: 2,
    nome: 'Leilão Copart - Abril 2024',
    site: 'Copart',
    dataLeilao: '2024-04-20T14:00:00Z',
    lote: 'LOT-67890',
    totalGastoUSD: 12000,
    totalGastoBRL: 60000,
    cotacaoDolar: 5.00,
    createdAt: '2024-04-20T14:00:00Z',
    updatedAt: '2024-04-20T14:00:00Z'
  }
]

export const mockEnvios = [
  {
    id: 1,
    freteiroNome: 'João Freteiro',
    freteiroTelefone: '+55 11 98765-4321',
    codigoRastreio: 'BR123456789US',
    status: 'em_transito',
    origem: 'Miami, FL - EUA',
    destino: 'Ciudad del Este - Paraguai',
    dataPrevista: '2024-05-10T00:00:00Z',
    dataEntrega: null,
    custoFreteUSD: 200,
    custoFreteBRL: 1000,
    cotacaoDolar: 5.00,
    observacoes: '10 iPhones no envio',
    createdAt: '2024-04-25T10:00:00Z',
    updatedAt: '2024-04-25T10:00:00Z'
  },
  {
    id: 2,
    freteiroNome: 'Maria Transportes',
    freteiroTelefone: '+55 11 99999-8888',
    codigoRastreio: 'BR987654321US',
    status: 'entregue',
    origem: 'Los Angeles, CA - EUA',
    destino: 'Ciudad del Este - Paraguai',
    dataPrevista: '2024-04-15T00:00:00Z',
    dataEntrega: '2024-04-14T16:00:00Z',
    custoFreteUSD: 180,
    custoFreteBRL: 900,
    cotacaoDolar: 5.00,
    observacoes: '8 iPhones entregues com sucesso',
    createdAt: '2024-04-01T10:00:00Z',
    updatedAt: '2024-04-14T16:00:00Z'
  }
]

export const mockiPhones = [
  {
    id: 1,
    imei: '356789012345678',
    modelo: 'iPhone 15 Pro Max',
    capacidade: '256GB',
    cor: 'Titânio Natural',
    estado: 'Grade A',
    leilaoId: 1,
    fornecedor: 'eBay',
    dataCompra: '2024-03-15T10:00:00Z',
    precoUSD: 850,
    cotacaoDolar: 5.00,
    custoBRL: 4250,
    freteUSD: 20,
    imposto: 522, // 60% de (850 + 20) = 522
    custoTotal: 4872, // 4250 + 100 (frete BRL) + 522
    precoVendaBRL: 7500,
    margemLucro: 2628,
    vendido: false,
    vendaId: null,
    envioId: 1,
    status: 'em_transito',
    lojaId: 1,
    observacoes: 'Aparelho em perfeito estado, sem arranhões',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-04-25T10:00:00Z'
  },
  {
    id: 2,
    imei: '356789012345679',
    modelo: 'iPhone 15 Pro',
    capacidade: '128GB',
    cor: 'Preto',
    estado: 'Grade A',
    leilaoId: 1,
    fornecedor: 'eBay',
    dataCompra: '2024-03-15T10:00:00Z',
    precoUSD: 750,
    cotacaoDolar: 5.00,
    custoBRL: 3750,
    freteUSD: 20,
    imposto: 462,
    custoTotal: 4312,
    precoVendaBRL: 6800,
    margemLucro: 2488,
    vendido: true,
    vendaId: 1,
    envioId: 2,
    status: 'vendido',
    lojaId: 1,
    observacoes: null,
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-04-20T14:00:00Z'
  },
  {
    id: 3,
    imei: '356789012345680',
    modelo: 'iPhone 14 Pro',
    capacidade: '512GB',
    cor: 'Roxo Profundo',
    estado: 'Novo',
    leilaoId: 2,
    fornecedor: 'Copart',
    dataCompra: '2024-04-20T14:00:00Z',
    precoUSD: 700,
    cotacaoDolar: 5.00,
    custoBRL: 3500,
    freteUSD: 20,
    imposto: 432,
    custoTotal: 4032,
    precoVendaBRL: 6500,
    margemLucro: 2468,
    vendido: false,
    vendaId: null,
    envioId: 1,
    status: 'em_transito',
    lojaId: 1,
    observacoes: 'iPhone lacrado de fábrica',
    createdAt: '2024-04-20T14:00:00Z',
    updatedAt: '2024-04-25T10:00:00Z'
  },
  {
    id: 4,
    imei: '356789012345681',
    modelo: 'iPhone 15',
    capacidade: '256GB',
    cor: 'Azul',
    estado: 'Grade B',
    leilaoId: 1,
    fornecedor: 'eBay',
    dataCompra: '2024-03-15T10:00:00Z',
    precoUSD: 600,
    cotacaoDolar: 5.00,
    custoBRL: 3000,
    freteUSD: 20,
    imposto: 372,
    custoTotal: 3472,
    precoVendaBRL: 5500,
    margemLucro: 2028,
    vendido: false,
    vendaId: null,
    envioId: null,
    status: 'no_paraguai',
    lojaId: 1,
    observacoes: 'Pequenos arranhões na tela',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-04-25T10:00:00Z'
  },
  {
    id: 5,
    imei: '356789012345682',
    modelo: 'iPhone 13',
    capacidade: '128GB',
    cor: 'Branco',
    estado: 'Grade C',
    leilaoId: 2,
    fornecedor: 'Copart',
    dataCompra: '2024-04-20T14:00:00Z',
    precoUSD: 400,
    cotacaoDolar: 5.00,
    custoBRL: 2000,
    freteUSD: 20,
    imposto: 252,
    custoTotal: 2352,
    precoVendaBRL: 3800,
    margemLucro: 1448,
    vendido: false,
    vendaId: null,
    envioId: null,
    status: 'no_brasil',
    lojaId: 1,
    observacoes: 'Tela trincada, mas funcional. Ótimo para peças.',
    createdAt: '2024-04-20T14:00:00Z',
    updatedAt: '2024-04-25T10:00:00Z'
  }
]

export const mockCotacoesDolar = [
  { id: 1, valor: 4.95, data: '2024-01-15', fonte: 'AwesomeAPI' },
  { id: 2, valor: 5.00, data: '2024-02-15', fonte: 'AwesomeAPI' },
  { id: 3, valor: 5.05, data: '2024-03-15', fonte: 'AwesomeAPI' },
  { id: 4, valor: 5.10, data: '2024-04-15', fonte: 'AwesomeAPI' },
  { id: 5, valor: 5.15, data: '2024-05-01', fonte: 'AwesomeAPI' }
]

export const mockVendasiPhones = [
  {
    id: 1,
    numero: 'V000001',
    usuarioId: 1,
    usuario: { nome: 'Admin Sistema' },
    lojaId: 1,
    total: 6800,
    desconto: 0,
    formaPagamento: 'pix',
    tipoVenda: 'avista',
    status: 'concluida',
    observacoes: null,
    iphones: [
      {
        id: 2,
        imei: '356789012345679',
        modelo: 'iPhone 15 Pro',
        capacidade: '128GB'
      }
    ],
    createdAt: '2024-04-20T14:00:00Z',
    updatedAt: '2024-04-20T14:00:00Z'
  },
  {
    id: 2,
    numero: 'V000002',
    usuarioId: 1,
    usuario: { nome: 'Admin Sistema' },
    lojaId: 1,
    total: 14000,
    desconto: 500,
    formaPagamento: 'prazo',
    tipoVenda: 'prazo',
    status: 'concluida',
    observacoes: 'Venda em 10x',
    iphones: [
      {
        id: 1,
        imei: '356789012345678',
        modelo: 'iPhone 15 Pro Max',
        capacidade: '256GB'
      },
      {
        id: 3,
        imei: '356789012345680',
        modelo: 'iPhone 14 Pro',
        capacidade: '512GB'
      }
    ],
    vendaPrazo: {
      numeroParcelas: 10,
      valorParcela: 1400,
      parcelas: [
        { numeroParcela: 1, valor: 1400, dataVencimento: '2024-05-20', dataPagamento: '2024-05-18', status: 'pago' },
        { numeroParcela: 2, valor: 1400, dataVencimento: '2024-06-20', dataPagamento: null, status: 'pendente' },
        { numeroParcela: 3, valor: 1400, dataVencimento: '2024-07-20', dataPagamento: null, status: 'pendente' }
      ]
    },
    createdAt: '2024-04-22T16:00:00Z',
    updatedAt: '2024-04-22T16:00:00Z'
  }
]

export const mockDashboardiPhones = {
  totalInvestidoUSD: 3300,
  totalInvestidoBRL: 16500,
  totalVendido: 21300,
  lucroReal: 4800,
  margemMedia: 36.4, // %
  iphoneEmEstoque: 3,
  iphoneEmTransito: 2,
  iphoneVendidos: 2,
  vendasPrazoPendentes: 1,
  cotacaoDolarAtual: 5.15,
  variacao30Dias: 4.0 // %
}
