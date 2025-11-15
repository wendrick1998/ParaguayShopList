// Dados mockados para desenvolvimento do frontend

export const mockLoja = {
  id: 1,
  nome: 'Loja Exemplo',
  cnpj: '12.345.678/0001-90',
  telefone: '(11) 98765-4321',
  endereco: 'Rua Exemplo, 123 - São Paulo, SP'
}

export const mockUsuario = {
  id: 1,
  nome: 'Admin Sistema',
  email: 'admin@secplus.com',
  papel: 'admin',
  lojaId: 1
}

export const mockProdutos = [
  {
    id: 1,
    nome: 'Arroz Tipo 1 - 5kg',
    descricao: 'Arroz branco tipo 1, pacote de 5kg',
    preco: 25.90,
    codigoBarras: '7891234567890',
    lojaId: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    estoque: {
      quantidade: 45,
      quantidadeMinima: 10
    }
  },
  {
    id: 2,
    nome: 'Feijão Preto - 1kg',
    descricao: 'Feijão preto tipo 1',
    preco: 8.50,
    codigoBarras: '7891234567891',
    lojaId: 1,
    createdAt: '2024-01-15T10:05:00Z',
    updatedAt: '2024-01-15T10:05:00Z',
    estoque: {
      quantidade: 30,
      quantidadeMinima: 15
    }
  },
  {
    id: 3,
    nome: 'Óleo de Soja - 900ml',
    descricao: 'Óleo de soja refinado',
    preco: 7.99,
    codigoBarras: '7891234567892',
    lojaId: 1,
    createdAt: '2024-01-15T10:10:00Z',
    updatedAt: '2024-01-15T10:10:00Z',
    estoque: {
      quantidade: 22,
      quantidadeMinima: 12
    }
  },
  {
    id: 4,
    nome: 'Açúcar Refinado - 1kg',
    descricao: 'Açúcar refinado tipo 1',
    preco: 4.50,
    codigoBarras: '7891234567893',
    lojaId: 1,
    createdAt: '2024-01-15T10:15:00Z',
    updatedAt: '2024-01-15T10:15:00Z',
    estoque: {
      quantidade: 8,
      quantidadeMinima: 10
    }
  },
  {
    id: 5,
    nome: 'Café Torrado - 500g',
    descricao: 'Café torrado e moído',
    preco: 18.90,
    codigoBarras: '7891234567894',
    lojaId: 1,
    createdAt: '2024-01-15T10:20:00Z',
    updatedAt: '2024-01-15T10:20:00Z',
    estoque: {
      quantidade: 15,
      quantidadeMinima: 8
    }
  }
]

export const mockVendas = [
  {
    id: 1,
    numero: 'V000001',
    usuarioId: 1,
    usuario: { nome: 'Admin Sistema' },
    lojaId: 1,
    total: 51.40,
    desconto: 0,
    formaPagamento: 'dinheiro',
    status: 'concluida',
    observacoes: null,
    createdAt: '2024-01-15T14:30:00Z',
    itens: [
      {
        id: 1,
        produtoId: 1,
        produto: { nome: 'Arroz Tipo 1 - 5kg' },
        quantidade: 2,
        precoUnit: 25.90,
        subtotal: 51.80
      }
    ]
  },
  {
    id: 2,
    numero: 'V000002',
    usuarioId: 1,
    usuario: { nome: 'Admin Sistema' },
    lojaId: 1,
    total: 35.38,
    desconto: 2.00,
    formaPagamento: 'pix',
    status: 'concluida',
    observacoes: 'Cliente pediu desconto',
    createdAt: '2024-01-15T15:45:00Z',
    itens: [
      {
        id: 2,
        produtoId: 2,
        produto: { nome: 'Feijão Preto - 1kg' },
        quantidade: 2,
        precoUnit: 8.50,
        subtotal: 17.00
      },
      {
        id: 3,
        produtoId: 3,
        produto: { nome: 'Óleo de Soja - 900ml' },
        quantidade: 1,
        precoUnit: 7.99,
        subtotal: 7.99
      },
      {
        id: 4,
        produtoId: 5,
        produto: { nome: 'Café Torrado - 500g' },
        quantidade: 1,
        precoUnit: 18.90,
        subtotal: 18.90
      }
    ]
  },
  {
    id: 3,
    numero: 'V000003',
    usuarioId: 1,
    usuario: { nome: 'Admin Sistema' },
    lojaId: 1,
    total: 12.49,
    desconto: 0,
    formaPagamento: 'credito',
    status: 'concluida',
    observacoes: null,
    createdAt: '2024-01-15T16:20:00Z',
    itens: [
      {
        id: 5,
        produtoId: 4,
        produto: { nome: 'Açúcar Refinado - 1kg' },
        quantidade: 1,
        precoUnit: 4.50,
        subtotal: 4.50
      },
      {
        id: 6,
        produtoId: 3,
        produto: { nome: 'Óleo de Soja - 900ml' },
        quantidade: 1,
        precoUnit: 7.99,
        subtotal: 7.99
      }
    ]
  }
]

export const mockMovimentacoes = [
  {
    id: 1,
    produtoId: 1,
    produto: { nome: 'Arroz Tipo 1 - 5kg' },
    lojaId: 1,
    tipo: 'entrada',
    quantidade: 50,
    motivo: 'Compra de fornecedor',
    observacoes: 'Nota fiscal 12345',
    createdAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 2,
    produtoId: 1,
    produto: { nome: 'Arroz Tipo 1 - 5kg' },
    lojaId: 1,
    tipo: 'saida',
    quantidade: 2,
    motivo: 'Venda V000001',
    observacoes: null,
    createdAt: '2024-01-15T14:30:00Z'
  },
  {
    id: 3,
    produtoId: 4,
    produto: { nome: 'Açúcar Refinado - 1kg' },
    lojaId: 1,
    tipo: 'ajuste',
    quantidade: -2,
    motivo: 'Produto vencido',
    observacoes: 'Descartado por vencimento',
    createdAt: '2024-01-15T11:00:00Z'
  }
]

export const mockCaixas = [
  {
    id: 1,
    lojaId: 1,
    usuarioId: 1,
    usuario: { nome: 'Admin Sistema' },
    dataAbertura: '2024-01-15T08:00:00Z',
    dataFechamento: '2024-01-15T18:00:00Z',
    saldoInicial: 100.00,
    saldoFinal: 199.27,
    totalVendas: 99.27,
    status: 'fechado',
    observacoes: 'Dia normal de vendas',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T18:00:00Z'
  },
  {
    id: 2,
    lojaId: 1,
    usuarioId: 1,
    usuario: { nome: 'Admin Sistema' },
    dataAbertura: '2024-01-16T08:00:00Z',
    dataFechamento: null,
    saldoInicial: 150.00,
    saldoFinal: null,
    totalVendas: 0,
    status: 'aberto',
    observacoes: null,
    createdAt: '2024-01-16T08:00:00Z',
    updatedAt: '2024-01-16T08:00:00Z'
  }
]

export const mockDashboardStats = {
  vendasHoje: {
    total: 99.27,
    quantidade: 3
  },
  totalProdutos: 5,
  estoqueBaixo: 2,
  caixaAtual: {
    saldoInicial: 150.00,
    saldoAtual: 150.00,
    status: 'aberto'
  }
}
