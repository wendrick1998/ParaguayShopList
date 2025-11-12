# 📱 ROADMAP - SEC+ Adaptado para Importação de iPhones

## 🎯 VISÃO DO NEGÓCIO

**Operação:** Compra de iPhones em leilões (EUA) → Envio Paraguai → Revenda Brasil

**Desafios Específicos:**
- Compra em USD, venda em BRL (câmbio)
- Controle de IMEI individual por aparelho
- Rastreamento de freteiros/envios
- Vendas a prazo (parcelamento)
- Impostos de importação (60% sobre valor + frete)
- Margem de lucro vs custo de importação

---

## ✅ JÁ IMPLEMENTADO (Fundação)

- ✅ Design System completo (UI Components)
- ✅ Layout responsivo com navegação
- ✅ Sistema de notificações (Toast)
- ✅ CRUD básico de produtos
- ✅ PDV funcional
- ✅ Controle de estoque (entrada/saída)
- ✅ Histórico de vendas
- ✅ Controle de caixa

---

## 🚀 ADAPTAÇÕES NECESSÁRIAS

### FASE 1: Produtos → iPhones Específicos

**Campos a Adicionar:**
- `modelo` (iPhone 13, 14, 15, 15 Pro, etc)
- `capacidade` (64GB, 128GB, 256GB, 512GB, 1TB)
- `cor` (Preto, Branco, Azul, etc)
- `estado` (Novo, Semi-novo, Grade A, Grade B, Grade C)
- `imei` (ÚNICO por aparelho) ⚠️ CRÍTICO
- `leilaoId` (referência ao leilão de origem)
- `fornecedor` (qual leilão/site)
- `dataCompra`
- `precoUSD` (preço de compra em dólar)
- `cotacaoDolar` (taxa de câmbio no dia)
- `custoBRL` (preço em reais: USD * cotação)
- `freteUSD`
- `imposto` (60% calculado)
- `custoTotal` (preço + frete + imposto)
- `precoVendaBRL`
- `margemLucro` (calculado: venda - custo)
- `status` (Em leilão, Comprado, Em trânsito, No Paraguai, No Brasil, Vendido)

### FASE 2: Módulo de Leilões

**Nova tela: "Leilões"**
- Cadastro de leilões (site, data, lote)
- Produtos vinculados ao leilão
- Total gasto por leilão
- Acompanhamento de lances

### FASE 3: Módulo de Envios/Rastreamento

**Nova tela: "Envios"**
- Cadastro de freteiros
- Código de rastreamento
- Status do envio: "Aguardando", "Em trânsito", "Entregue"
- Data prevista de entrega
- Data real de entrega
- Custo do frete
- IMEIs incluídos no envio
- Histórico de movimentação

### FASE 4: Controle de Câmbio

**Nova funcionalidade:**
- API de cotação do dólar em tempo real (AwesomeAPI/Banco Central)
- Histórico de cotações
- Conversão automática USD → BRL
- Dashboard de variação cambial
- Alerta de melhor momento para compra

### FASE 5: Vendas a Prazo

**Adaptações em Vendas:**
- Tipo de venda: "À vista" ou "A prazo"
- Número de parcelas
- Valor da parcela
- Data de vencimento de cada parcela
- Status de pagamento: "Pendente", "Parcial", "Pago"
- Controle de inadimplência
- Notificações de vencimento

### FASE 6: Dashboard Específico

**Métricas Importantes:**
- Total investido (USD e BRL)
- Total vendido
- Lucro real (considerando câmbio)
- Margem média de lucro
- iPhones em estoque (por modelo)
- iPhones em trânsito
- Vendas a prazo pendentes
- Gráfico de variação do dólar
- ROI por leilão

### FASE 7: Relatórios Fiscais

- Notas fiscais de importação
- Declaração de importação
- SPED Fiscal
- Controle de impostos pagos

---

## 📊 SCHEMA DO BANCO ATUALIZADO

```typescript
model iPhone {
  id                Int       @id @default(autoincrement())
  imei              String    @unique // CRÍTICO!
  modelo            String    // iPhone 13, 14, 15, etc
  capacidade        String    // 64GB, 128GB, etc
  cor               String
  estado            String    // Novo, Semi-novo, Grade A/B/C

  // Compra
  leilaoId          Int?
  leilao            Leilao?   @relation(fields: [leilaoId], references: [id])
  fornecedor        String?
  dataCompra        DateTime?
  precoUSD          Float
  cotacaoDolar      Float
  custoBRL          Float     // Calculado
  freteUSD          Float
  imposto           Float     // 60%
  custoTotal        Float     // Calculado

  // Venda
  precoVendaBRL     Float?
  margemLucro       Float?    // Calculado
  vendido           Boolean   @default(false)
  vendaId           Int?
  venda             Venda?    @relation(fields: [vendaId], references: [id])

  // Logística
  envioId           Int?
  envio             Envio?    @relation(fields: [envioId], references: [id])
  status            String    @default("estoque") // Em leilão, Comprado, Em trânsito, No Paraguai, No Brasil, Vendido

  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}

model Leilao {
  id              Int       @id @default(autoincrement())
  nome            String
  site            String    // URL do leilão
  dataLeilao      DateTime
  lote            String?
  totalGasto      Float
  iphones         iPhone[]
  createdAt       DateTime  @default(now())
}

model Envio {
  id                Int       @id @default(autoincrement())
  freteiroNome      String
  freteiroTelefone  String?
  codigoRastreio    String?
  status            String    @default("aguardando") // aguardando, em_transito, entregue
  dataPrevista      DateTime?
  dataEntrega       DateTime?
  custoFrete        Float
  iphones           iPhone[]
  observacoes       String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}

model VendaPrazo {
  id              Int       @id @default(autoincrement())
  vendaId         Int
  venda           Venda     @relation(fields: [vendaId], references: [id])
  numeroParcelas  Int
  valorParcela    Float
  parcelas        Parcela[]
  createdAt       DateTime  @default(now())
}

model Parcela {
  id              Int         @id @default(autoincrement())
  vendaPrazoId    Int
  vendaPrazo      VendaPrazo  @relation(fields: [vendaPrazoId], references: [id])
  numeroParcela   Int
  valor           Float
  dataVencimento  DateTime
  dataPagamento   DateTime?
  status          String      @default("pendente") // pendente, pago, atrasado
  createdAt       DateTime    @default(now())
}
```

---

## 🎨 NOVAS TELAS A CRIAR

1. **iPhones** - Catálogo completo com filtros por modelo, estado, status
2. **Leilões** - Gestão de leilões e produtos comprados
3. **Envios** - Rastreamento de freteiros e produtos em trânsito
4. **Câmbio** - Dashboard de cotação e conversão
5. **Vendas a Prazo** - Controle de parcelas e inadimplência
6. **Dashboard Financeiro** - Análise de ROI, lucro, custos

---

## 💡 RECURSOS AVANÇADOS (Futuro)

- 📸 Upload de fotos dos iPhones
- 🔍 Busca por IMEI
- 📊 Comparativo de preços (Brasil vs EUA)
- 🤖 Sugestão de preço de venda (AI)
- 📱 App mobile para clientes acompanharem pedidos
- 🔔 Notificações WhatsApp para clientes
- 📈 Previsão de demanda por modelo
- 💱 Integração com APIs de câmbio em tempo real
- 🌐 Marketplace próprio para vendas online

---

**Criado em:** $(date)
**Status:** Em desenvolvimento
**Prioridade:** ALTA
