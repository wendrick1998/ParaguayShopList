-- =====================================================
-- SCHEMA PARA SISTEMA DE IMPORTAÇÃO DE IPHONES
-- USA → PARAGUAI → BRASIL
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA: usuarios
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: lojas
-- =====================================================
CREATE TABLE IF NOT EXISTS lojas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) UNIQUE,
  endereco TEXT,
  cidade VARCHAR(100),
  estado VARCHAR(2),
  pais VARCHAR(50) DEFAULT 'Brasil',
  telefone VARCHAR(20),
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: leiloes (Auctions - eBay, Copart, etc.)
-- =====================================================
CREATE TABLE IF NOT EXISTS leiloes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plataforma VARCHAR(100) NOT NULL, -- eBay, Copart, IAA, etc.
  numero_lote VARCHAR(100) NOT NULL,
  data_leilao DATE NOT NULL,
  fornecedor VARCHAR(255),
  valor_total_usd DECIMAL(10, 2) NOT NULL,
  quantidade_iphones INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'arrematado', -- arrematado, pago, em_transito, recebido, cancelado
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: cotacoes_dolar (Exchange Rates)
-- =====================================================
CREATE TABLE IF NOT EXISTS cotacoes_dolar (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  data DATE NOT NULL,
  cotacao DECIMAL(10, 4) NOT NULL,
  tipo VARCHAR(20) DEFAULT 'referencia', -- compra, venda, referencia
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: envios (Shipments USA→PY→BR)
-- =====================================================
CREATE TABLE IF NOT EXISTS envios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo_rastreamento VARCHAR(100) UNIQUE NOT NULL,

  -- Rota
  origem VARCHAR(255) NOT NULL, -- Miami, Los Angeles, etc.
  destino_intermediario VARCHAR(255), -- Asunción, Ciudad del Este
  destino_final VARCHAR(255), -- São Paulo, Rio de Janeiro, etc.

  -- Freteiros
  freteiro_usa_py VARCHAR(255), -- DHL, FedEx, UPS
  freteiro_paraguai VARCHAR(255), -- Trans Paraguay, etc.
  freteiro_py_br VARCHAR(255), -- Jadlog, Total Express, Correios

  -- Datas
  data_envio_usa DATE,
  data_chegada_py DATE,
  data_envio_br DATE,
  previsao_entrega_br DATE,
  data_entrega DATE,

  -- Custos
  custo_frete_usd DECIMAL(10, 2),
  percentual_frete_importacao DECIMAL(5, 2) DEFAULT 8.0,
  custo_frete_brl DECIMAL(10, 2),
  custo_frete_py_br DECIMAL(10, 2),
  percentual_frete_venda DECIMAL(5, 2) DEFAULT 5.0,

  -- Status e Quantidade
  status VARCHAR(50) DEFAULT 'aguardando_envio',
  quantidade_iphones INTEGER DEFAULT 0,
  valor_total_iphones DECIMAL(10, 2),

  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: iphones (Core Table)
-- =====================================================
CREATE TABLE IF NOT EXISTS iphones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Identificação
  imei VARCHAR(15) UNIQUE NOT NULL,
  modelo VARCHAR(100) NOT NULL, -- iPhone 15 Pro Max, etc.
  capacidade VARCHAR(20) NOT NULL, -- 128GB, 256GB, etc.
  cor VARCHAR(50) NOT NULL,

  -- Condição (baseado no mercado refurbished)
  grade VARCHAR(5) NOT NULL, -- A+, A, AB, B, C
  battery_health INTEGER NOT NULL CHECK (battery_health >= 0 AND battery_health <= 100),

  -- Compra
  leilao_id UUID REFERENCES leiloes(id),
  fornecedor VARCHAR(255),
  data_compra DATE NOT NULL,
  preco_usd DECIMAL(10, 2) NOT NULL,
  cotacao_dolar DECIMAL(10, 4) NOT NULL,
  custo_brl DECIMAL(10, 2) NOT NULL,

  -- Frete e Impostos
  frete_usd DECIMAL(10, 2),
  percentual_frete_importacao DECIMAL(5, 2) DEFAULT 8.0,
  frete_brl DECIMAL(10, 2),
  imposto DECIMAL(10, 2), -- 60% sobre (valor + frete)

  -- Custos Adicionais
  custo_assistencia_tecnica DECIMAL(10, 2) DEFAULT 0,
  custo_reparo DECIMAL(10, 2) DEFAULT 0,
  custo_garantia DECIMAL(10, 2) DEFAULT 0,
  custo_total DECIMAL(10, 2) NOT NULL,

  -- Venda
  preco_venda_brl DECIMAL(10, 2),
  percentual_frete_venda DECIMAL(5, 2) DEFAULT 5.0,
  frete_cliente_brl DECIMAL(10, 2),
  margem_lucro DECIMAL(10, 2),
  margem_percentual DECIMAL(5, 2),

  -- Status e Relacionamentos
  status VARCHAR(50) DEFAULT 'comprado', -- comprado, em_transito, estoque, vendido
  vendido BOOLEAN DEFAULT false,
  venda_id UUID,
  envio_id UUID REFERENCES envios(id),
  loja_id UUID REFERENCES lojas(id),

  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: vendas
-- =====================================================
CREATE TABLE IF NOT EXISTS vendas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_venda VARCHAR(50) UNIQUE,
  data_venda TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Cliente
  cliente_nome VARCHAR(255),
  cliente_cpf VARCHAR(14),
  cliente_telefone VARCHAR(20),
  cliente_email VARCHAR(255),
  cliente_endereco TEXT,

  -- Valores
  subtotal DECIMAL(10, 2) NOT NULL,
  desconto DECIMAL(10, 2) DEFAULT 0,
  frete DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,

  -- Pagamento
  forma_pagamento VARCHAR(50), -- dinheiro, pix, cartao, transferencia
  parcelado BOOLEAN DEFAULT false,
  num_parcelas INTEGER DEFAULT 1,

  -- Relacionamentos
  usuario_id UUID REFERENCES usuarios(id),
  loja_id UUID REFERENCES lojas(id),

  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar FK de venda em iphones
ALTER TABLE iphones ADD CONSTRAINT fk_iphones_venda
  FOREIGN KEY (venda_id) REFERENCES vendas(id) ON DELETE SET NULL;

-- =====================================================
-- TABELA: vendas_prazo (Installment Sales)
-- =====================================================
CREATE TABLE IF NOT EXISTS vendas_prazo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venda_id UUID REFERENCES vendas(id) ON DELETE CASCADE,
  valor_total DECIMAL(10, 2) NOT NULL,
  valor_entrada DECIMAL(10, 2) DEFAULT 0,
  num_parcelas INTEGER NOT NULL,
  valor_parcela DECIMAL(10, 2) NOT NULL,
  parcelas_pagas INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'ativo', -- ativo, quitado, inadimplente
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: parcelas (Installments)
-- =====================================================
CREATE TABLE IF NOT EXISTS parcelas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venda_prazo_id UUID REFERENCES vendas_prazo(id) ON DELETE CASCADE,
  numero_parcela INTEGER NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  vencimento DATE NOT NULL,
  data_pagamento DATE,
  paga BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- iPhones
CREATE INDEX idx_iphones_imei ON iphones(imei);
CREATE INDEX idx_iphones_status ON iphones(status);
CREATE INDEX idx_iphones_vendido ON iphones(vendido);
CREATE INDEX idx_iphones_grade ON iphones(grade);
CREATE INDEX idx_iphones_leilao ON iphones(leilao_id);
CREATE INDEX idx_iphones_envio ON iphones(envio_id);

-- Leilões
CREATE INDEX idx_leiloes_status ON leiloes(status);
CREATE INDEX idx_leiloes_data ON leiloes(data_leilao);

-- Envios
CREATE INDEX idx_envios_status ON envios(status);
CREATE INDEX idx_envios_rastreamento ON envios(codigo_rastreamento);

-- Vendas
CREATE INDEX idx_vendas_data ON vendas(data_venda);
CREATE INDEX idx_vendas_usuario ON vendas(usuario_id);

-- Cotações
CREATE INDEX idx_cotacoes_data ON cotacoes_dolar(data);

-- =====================================================
-- FUNCTIONS E TRIGGERS
-- =====================================================

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em todas as tabelas
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lojas_updated_at BEFORE UPDATE ON lojas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leiloes_updated_at BEFORE UPDATE ON leiloes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_envios_updated_at BEFORE UPDATE ON envios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_iphones_updated_at BEFORE UPDATE ON iphones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendas_updated_at BEFORE UPDATE ON vendas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendas_prazo_updated_at BEFORE UPDATE ON vendas_prazo FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DADOS INICIAIS DE TESTE
-- =====================================================

-- Inserir usuário admin
INSERT INTO usuarios (nome, email, senha, role)
VALUES ('Admin Sistema', 'admin@sec.com', '$2a$10$XqWYfEuJpHb5sFQqE5JvG.YPGkJ5PqPCv7WQXnXBHqZqXqXqXqXq', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Inserir loja padrão
INSERT INTO lojas (nome, cidade, estado, pais)
VALUES ('Loja Principal', 'Asunción', 'AS', 'Paraguai')
ON CONFLICT DO NOTHING;

-- Inserir cotação inicial
INSERT INTO cotacoes_dolar (data, cotacao, tipo)
VALUES (CURRENT_DATE, 5.85, 'referencia')
ON CONFLICT DO NOTHING;

-- =====================================================
-- RLS (ROW LEVEL SECURITY) - Opcional
-- =====================================================

-- Habilitar RLS nas tabelas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE iphones ENABLE ROW LEVEL SECURITY;
ALTER TABLE leiloes ENABLE ROW LEVEL SECURITY;
ALTER TABLE envios ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendas ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (permitir tudo para service_role)
CREATE POLICY "Allow service role full access" ON usuarios FOR ALL USING (true);
CREATE POLICY "Allow service role full access" ON iphones FOR ALL USING (true);
CREATE POLICY "Allow service role full access" ON leiloes FOR ALL USING (true);
CREATE POLICY "Allow service role full access" ON envios FOR ALL USING (true);
CREATE POLICY "Allow service role full access" ON vendas FOR ALL USING (true);

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View: iPhones em estoque com informações completas
CREATE OR REPLACE VIEW vw_iphones_estoque AS
SELECT
  i.*,
  l.numero_lote as leilao_numero,
  e.codigo_rastreamento as envio_tracking
FROM iphones i
LEFT JOIN leiloes l ON i.leilao_id = l.id
LEFT JOIN envios e ON i.envio_id = e.id
WHERE i.status = 'estoque' AND i.vendido = false;

-- View: Dashboard metrics
CREATE OR REPLACE VIEW vw_dashboard_metrics AS
SELECT
  COUNT(*) as total_iphones,
  COUNT(*) FILTER (WHERE status = 'estoque') as em_estoque,
  COUNT(*) FILTER (WHERE vendido = true) as vendidos,
  COUNT(*) FILTER (WHERE status = 'em_transito') as em_transito,
  SUM(preco_usd) as investido_usd,
  SUM(custo_total) as investido_brl,
  SUM(margem_lucro) FILTER (WHERE vendido = true) as lucro_total,
  AVG(margem_percentual) FILTER (WHERE vendido = true) as margem_media
FROM iphones;

-- =====================================================
-- COMENTÁRIOS NAS TABELAS
-- =====================================================

COMMENT ON TABLE iphones IS 'Tabela principal de iPhones importados';
COMMENT ON COLUMN iphones.grade IS 'Grade de qualidade: A+ (perfeito), A (excelente), AB (muito bom), B (bom), C (aceitável)';
COMMENT ON COLUMN iphones.battery_health IS 'Saúde da bateria em percentual (0-100)';
COMMENT ON COLUMN iphones.imposto IS 'Imposto de importação: 60% sobre (valor + frete)';

COMMENT ON TABLE leiloes IS 'Leilões de compra (eBay, Copart, IAA, etc.)';
COMMENT ON TABLE envios IS 'Rastreamento de envios USA → Paraguai → Brasil';
COMMENT ON TABLE cotacoes_dolar IS 'Histórico de cotações USD/BRL';

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================
