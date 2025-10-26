-- ============================================
-- SEED DATA - AUTOMATION INFRASTRUCTURE
-- Curso Importação Paraguai
-- ============================================

-- Limpar dados existentes (opcional - use com cuidado!)
-- TRUNCATE products, course_modules, course_lessons, faq_items RESTART IDENTITY CASCADE;

-- ============================================
-- PRODUTOS
-- ============================================

INSERT INTO products (name, description, price, type, is_active, sales_page_url, created_at)
VALUES
  (
    'Curso Importação Paraguai - Método Completo',
    'Sistema comprovado para lucrar de R$ 5.000 a R$ 50.000 por mês importando produtos do Paraguai com margem de até 300%',
    1997.00,
    'course',
    true,
    '/course-landing',
    NOW()
  ),
  (
    'Mentoria Premium - Suporte Direto',
    'Mentoria individual com suporte direto via WhatsApp + grupo exclusivo de mentorados',
    997.00,
    'upsell',
    true,
    '/upsell/mentoria',
    NOW()
  ),
  (
    'Material Físico - Kit Importador',
    'Kit físico com checklist plastificado, caderno de importação e guia de bolso',
    297.00,
    'upsell',
    true,
    '/upsell/kit-fisico',
    NOW()
  );

-- ============================================
-- MÓDULOS DO CURSO
-- ============================================

INSERT INTO course_modules (product_id, title, description, "order", unlock_delay, is_active)
VALUES
  (
    1,
    'Módulo 1: Mindset do Importador de Sucesso',
    'Desenvolva a mentalidade correta para ter sucesso como importador profissional',
    1,
    0, -- Disponível imediatamente
    true
  ),
  (
    1,
    'Módulo 2: Os 47 Produtos Mais Lucrativos',
    'Descubra exatamente quais produtos importar para maximizar sua margem de lucro',
    2,
    3, -- Disponível em 3 dias
    true
  ),
  (
    1,
    'Módulo 3: Encontrando Fornecedores Confiáveis',
    'Acesso direto aos melhores fornecedores do Paraguai com preços de atacado',
    3,
    7,
    true
  ),
  (
    1,
    'Módulo 4: Cálculo de Margem e Precificação',
    'Domine a matemática da importação e precifique seus produtos corretamente',
    4,
    10,
    true
  ),
  (
    1,
    'Módulo 5: Importação Legal - Passo a Passo',
    'Aprenda a importar de forma 100% legal, sem riscos ou dor de cabeça',
    5,
    14,
    true
  ),
  (
    1,
    'Módulo 6: Estratégias de Venda - Online e Offline',
    'Venda seus produtos tanto online quanto em lojas físicas',
    6,
    21,
    true
  ),
  (
    1,
    'Módulo 7: Escala - De 5K para 50K/mês',
    'Estratégias avançadas para escalar seu negócio de importação',
    7,
    28,
    true
  ),
  (
    1,
    'BÔNUS: Ferramentas e Templates',
    'Planilhas, contratos, checklists e todas as ferramentas necessárias',
    8,
    0, -- Disponível desde o início
    true
  );

-- ============================================
-- AULAS (Exemplo do Módulo 1)
-- ============================================

INSERT INTO course_lessons (module_id, title, description, video_url, duration, "order", is_active)
VALUES
  (
    1,
    'Aula 1.1: Bem-vindo ao Curso',
    'Visão geral do curso e como aproveitar ao máximo',
    'https://vimeo.com/123456789',
    420, -- 7 minutos
    1,
    true
  ),
  (
    1,
    'Aula 1.2: A Mentalidade do Importador Profissional',
    'Como pensar como um importador de sucesso',
    'https://vimeo.com/123456790',
    1200, -- 20 minutos
    2,
    true
  ),
  (
    1,
    'Aula 1.3: Quebrando Crenças Limitantes',
    'Elimine medos e objeções que impedem seu sucesso',
    'https://vimeo.com/123456791',
    900, -- 15 minutos
    3,
    true
  );

-- Adicionar materiais às aulas
UPDATE course_lessons
SET materials = '[
  {"name": "Checklist Mindset.pdf", "url": "/materials/checklist-mindset.pdf", "type": "pdf"},
  {"name": "Guia Ação Rápida.pdf", "url": "/materials/guia-acao-rapida.pdf", "type": "pdf"}
]'::jsonb
WHERE id = 1;

-- ============================================
-- FAQ - PERGUNTAS FREQUENTES
-- ============================================

INSERT INTO faq_items (question, answer, category, keywords, is_active)
VALUES
  -- CATEGORIA: ACESSO
  (
    'Como acessar o curso?',
    'Para acessar o curso, faça login com o email usado na compra. Você receberá acesso imediato após a confirmação do pagamento. Se não recebeu o email de acesso, verifique sua caixa de spam ou entre em contato conosco.',
    'access',
    ARRAY['acesso', 'acessar', 'login', 'entrar', 'curso', 'área de membros'],
    true
  ),
  (
    'Esqueci minha senha',
    'Clique em "Esqueci minha senha" na tela de login. Você receberá um email com instruções para criar uma nova senha. Se não receber, verifique o spam.',
    'access',
    ARRAY['senha', 'esqueci', 'recuperar', 'resetar'],
    true
  ),
  (
    'Não recebi o email de acesso',
    'Primeiro, verifique sua caixa de spam/lixo eletrônico. Se ainda não encontrar, entre em contato pelo suporte informando o email usado na compra.',
    'access',
    ARRAY['email', 'não recebi', 'spam', 'acesso'],
    true
  ),
  (
    'Posso assistir no celular?',
    'Sim! O curso funciona perfeitamente em computadores, tablets e celulares. Você pode estudar de onde estiver.',
    'access',
    ARRAY['celular', 'mobile', 'tablet', 'smartphone', 'dispositivo'],
    true
  ),

  -- CATEGORIA: PAGAMENTO
  (
    'Problemas com pagamento',
    'Se você teve problemas com o pagamento: 1) Verifique se o cartão tem limite disponível, 2) Confirme se os dados foram inseridos corretamente, 3) Tente outro método de pagamento. Para mais ajuda, abra um chamado de suporte.',
    'payment',
    ARRAY['pagamento', 'cartão', 'boleto', 'pix', 'cobrança', 'pagar', 'recusado'],
    true
  ),
  (
    'Quais formas de pagamento aceitas?',
    'Aceitamos: Cartão de crédito (até 12x sem juros), Pix (à vista com 5% desconto) e Boleto bancário (à vista).',
    'payment',
    ARRAY['forma de pagamento', 'cartão', 'pix', 'boleto', 'parcelamento'],
    true
  ),
  (
    'Como funciona o parcelamento?',
    'Você pode parcelar em até 12x sem juros no cartão de crédito. O valor de R$ 1.997 fica em 12x de R$ 196,70.',
    'payment',
    ARRAY['parcelamento', 'parcelas', 'parcelar', 'juros'],
    true
  ),
  (
    'Como funciona a garantia?',
    'Oferecemos garantia incondicional de 7 dias. Se não ficar satisfeito por qualquer motivo, basta solicitar o reembolso total dentro desse prazo através do suporte.',
    'payment',
    ARRAY['garantia', 'reembolso', 'devolver', 'dinheiro de volta', 'devolução'],
    true
  ),
  (
    'Como solicitar reembolso?',
    'Envie um email para suporte@paraguayimport.com.br com o assunto "Reembolso" e o email usado na compra. Processamos em até 24 horas.',
    'payment',
    ARRAY['reembolso', 'devolução', 'estorno', 'cancelamento'],
    true
  ),

  -- CATEGORIA: CONTEÚDO
  (
    'Como baixar os materiais?',
    'Os materiais estão disponíveis em cada aula. Clique no botão "Download" ao lado de cada material. Os arquivos ficam salvos permanentemente na sua conta.',
    'content',
    ARRAY['baixar', 'download', 'material', 'pdf', 'planilha', 'arquivo'],
    true
  ),
  (
    'Quanto tempo tenho de acesso?',
    'Seu acesso ao curso é VITALÍCIO! Você pode assistir as aulas quantas vezes quiser, no seu ritmo, sem prazo de expiração.',
    'content',
    ARRAY['tempo', 'acesso', 'vitalício', 'prazo', 'validade', 'quanto tempo'],
    true
  ),
  (
    'Posso baixar as aulas?',
    'As aulas ficam disponíveis para assistir online a qualquer momento. Não é possível baixar os vídeos, mas você tem acesso vitalício ao conteúdo.',
    'content',
    ARRAY['baixar aula', 'download vídeo', 'salvar aula'],
    true
  ),
  (
    'Tem certificado?',
    'Sim! Ao concluir 100% das aulas, você recebe um certificado digital de conclusão do curso.',
    'content',
    ARRAY['certificado', 'diploma', 'conclusão'],
    true
  ),

  -- CATEGORIA: TÉCNICO
  (
    'Vídeo não carrega',
    'Tente: 1) Atualizar a página, 2) Limpar cache do navegador, 3) Tentar outro navegador, 4) Verificar sua conexão. Se persistir, contate o suporte.',
    'technical',
    ARRAY['vídeo', 'não carrega', 'não funciona', 'erro', 'problema'],
    true
  ),
  (
    'Qual navegador devo usar?',
    'Recomendamos Chrome, Firefox, Safari ou Edge atualizados. Evite navegadores muito antigos.',
    'technical',
    ARRAY['navegador', 'browser', 'compatibilidade'],
    true
  );

-- ============================================
-- ANALYTICS METRICS (Dados Iniciais)
-- ============================================

INSERT INTO analytics_metrics (metric_date, metric_type, value)
VALUES
  (CURRENT_DATE, 'daily_revenue', 0),
  (CURRENT_DATE, 'leads_captured', 0),
  (CURRENT_DATE, 'conversion_rate', 0),
  (CURRENT_DATE, 'avg_ticket', 1997.00);

-- ============================================
-- ALERTAS DO SISTEMA (Thresholds)
-- ============================================

-- Nenhum alerta ativo inicialmente
-- Os alertas serão criados automaticamente pelo sistema de monitoramento

-- ============================================
-- FIM DO SEED
-- ============================================

-- Verificar dados inseridos
SELECT 'Produtos cadastrados:', COUNT(*) FROM products;
SELECT 'Módulos cadastrados:', COUNT(*) FROM course_modules;
SELECT 'Aulas cadastradas:', COUNT(*) FROM course_lessons;
SELECT 'FAQs cadastradas:', COUNT(*) FROM faq_items;
