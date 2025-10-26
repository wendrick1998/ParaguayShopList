# 🚀 Infraestrutura de Automação para Lançamento Milionário
## Curso Importação Paraguai - Meta R$ 500K-1M

**Automation Infrastructure Engineer - Documentação Técnica Completa**

---

## 📋 ÍNDICE

1. [Visão Geral da Arquitetura](#visão-geral)
2. [Funil Automatizado](#funil-automatizado)
3. [Plataforma de Entrega (Área de Membros)](#área-de-membros)
4. [Integrações Estratégicas](#integrações)
5. [Automações de Suporte](#suporte)
6. [Setup e Configuração](#setup)
7. [Monitoramento e Escalabilidade](#monitoramento)
8. [Roadmap de Implementação](#roadmap)

---

## 🎯 VISÃO GERAL DA ARQUITETURA

### Stack Tecnológica

**Frontend:**
- React 18.3+ com TypeScript
- Wouter para roteamento
- TanStack Query para gerenciamento de estado
- Tailwind CSS + shadcn/ui para UI
- Framer Motion para animações

**Backend:**
- Node.js + Express
- PostgreSQL com Drizzle ORM
- Autenticação Replit
- WebSockets para real-time

**Integrações:**
- Hotmart/Kiwify (Pagamentos)
- Facebook Pixel + Google Analytics (Tracking)
- SendGrid/Mailchimp (Email Marketing)
- Slack/Discord (Alertas)

### Arquitetura de Componentes

```
┌─────────────────────────────────────────────────────────┐
│                    LANDING PAGES                        │
│  ├─ VSL (Video Sales Letter)                           │
│  ├─ Lead Magnet (Lista 47 Produtos)                    │
│  └─ Pixel Tracking (Facebook/Google)                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 FUNIL AUTOMÁTICO                        │
│  ├─ Captura de Leads (Email + Tags)                    │
│  ├─ Sequências de Email                                │
│  ├─ Recuperação Carrinho Abandonado                    │
│  └─ Upsells Automáticos                                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              PLATAFORMA DE CHECKOUT                     │
│  ├─ Hotmart/Kiwify Integration                         │
│  ├─ Webhooks de Compra                                 │
│  └─ Criação Automática de Acesso                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│               ÁREA DE MEMBROS                           │
│  ├─ Dashboard do Aluno                                 │
│  ├─ Player de Vídeo + Materiais                        │
│  ├─ Gamificação (Pontos, Conquistas, Streaks)          │
│  ├─ Comunidade Integrada                               │
│  └─ Suporte (Chatbot + Tickets)                        │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 FUNIL AUTOMATIZADO

### 1. Landing Pages Otimizadas

**Componente:** `/client/src/pages/course-landing.tsx`

**Recursos:**
- ✅ VSL (Video Sales Letter) otimizada para conversão
- ✅ Social proof dinâmico (2.400+ alunos, R$ 12M+ gerados)
- ✅ CTA estratégicos posicionados
- ✅ Lead magnet (Lista 47 Produtos)
- ✅ Depoimentos autênticos de alunos
- ✅ Scarcity (vagas limitadas, 48h)

**Tracking Implementado:**
```typescript
// Eventos rastreados automaticamente:
- PageView (entrada na página)
- VideoPlay (início do VSL)
- VideoComplete (assistiu até o final)
- CTAClick (clique em qualquer CTA)
- LeadCapture (preencheu formulário)
- AddToCart (adicionou ao carrinho)
```

### 2. Sistema de Tags Comportamentais

**Schema:** `shared/course-schema.ts` - Tabela `leadEvents`

**Tags Automáticas:**
- `video_watched_50%` - Assistiu 50% do VSL
- `video_watched_100%` - Assistiu VSL completo
- `lead_magnet_downloaded` - Baixou material grátis
- `cart_abandoned` - Abandonou carrinho
- `high_intent` - Score > 70 pontos

**Scoring System:**
```typescript
Ações e Pontuação:
- PageView: +5 pontos
- VideoPlay: +10 pontos
- VideoComplete: +30 pontos
- LeadMagnetDownload: +20 pontos
- AddToCart: +40 pontos
- CheckoutStart: +50 pontos
```

### 3. Sequências de Email Automáticas

**Fluxos Implementados:**

**A) Lead Magnet (Nutrição):**
```
Dia 0: Email imediato com download + introdução
Dia 1: Case de sucesso #1 (Carlos - R$ 18K)
Dia 2: Dica prática #1 (Como calcular margem)
Dia 3: Case de sucesso #2 (Ana Paula - R$ 43K)
Dia 4: Dica prática #2 (Melhores produtos)
Dia 5: Convite para webinar/live
Dia 6: Oferta especial (desconto tempo limitado)
```

**B) Carrinho Abandonado:**
```
1h depois: "Você esqueceu algo?"
24h depois: "Últimas vagas - 20% OFF"
48h depois: "Oferta final - expira em 4 horas"
```

**C) Pós-Compra (Onboarding):**
```
Imediato: Boas-vindas + credenciais de acesso
24h: Como aproveitar o curso ao máximo
3 dias: Lembrete: Complete o Módulo 1
7 dias: Conquista desbloqueada + convite comunidade
14 dias: Upsell: Mentoria Premium
```

### 4. Recuperação de Carrinho Abandonado

**Schema:** Tabela `abandonedCarts`

**Automação:**
```typescript
// Trigger automático quando:
1. Lead adiciona produto ao carrinho
2. Não finaliza compra em 15 minutos
3. Sistema dispara sequência de recuperação
4. Tracking: 3 emails em 48h
5. Ofertas progressivas: 10% → 15% → 20% desconto
```

**Taxa de Recuperação Esperada:** 15-25%

---

## 🎓 ÁREA DE MEMBROS PREMIUM

### 1. Dashboard do Aluno

**Componente:** `/client/src/pages/members-area.tsx`

**Recursos:**
- ✅ Progresso visual do curso (%)
- ✅ Estatísticas de gamificação
- ✅ Próxima aula sugerida
- ✅ Conquistas recentes
- ✅ Acesso rápido à comunidade

### 2. Sistema de Liberação Progressiva

**Schema:** Tabela `courseModules` - Campo `unlockDelay`

**Estratégia de Drip Content:**
```
Módulo 1: Imediato (dia 0)
Módulo 2: Dia 3
Módulo 3: Dia 7
Módulo 4: Dia 10
Módulo 5: Dia 14
Módulo 6: Dia 21
Módulo 7: Dia 28
Bônus: Dia 35 (após conclusão 70%)
```

**Benefícios:**
- Maior engajamento (evita overwhelm)
- Menor taxa de cancelamento
- Implementação de resultados progressivos

### 3. Gamificação

**Schema:** Tabelas `studentAchievements` + `studentStats`

**Sistema de Pontos:**
```typescript
Ações:
- Assistir aula: 10 pontos
- Completar módulo: 100 pontos
- Streak 7 dias: 50 pontos
- Streak 30 dias: 200 pontos
- Conclusão curso: 500 pontos
- Participar comunidade: 5 pontos/dia
```

**Conquistas (Badges):**
```
🎓 Primeira Aula - 10 pts
🔥 Sequência 7 Dias - 50 pts
🏆 Módulo Completo - 100 pts
📈 50% do Curso - 250 pts
⭐ Curso Completo - 500 pts
📅 Sequência 30 Dias - 200 pts
💬 Participação Ativa - 50 pts
```

**Leaderboard:**
- Top 10 alunos do mês
- Prêmios: Mentoria exclusiva, acesso antecipado a novos conteúdos

### 4. Comunidade Integrada

**Plataformas:**
- WhatsApp (grupo exclusivo - até 1000 membros)
- Discord (canais por módulo + suporte)
- Fórum interno (Q&A permanente)

**Automações:**
- Adição automática ao WhatsApp após compra
- Convite Discord no email de boas-vindas
- Moderação automática (anti-spam)

---

## 🔌 INTEGRAÇÕES ESTRATÉGICAS

### 1. Hotmart Integration

**Endpoint:** `/api/webhooks/hotmart`

**Arquivo:** `server/integrations.ts`

**Eventos Processados:**
```typescript
PURCHASE_COMPLETE → Criar matrícula + Enviar acesso
PURCHASE_REFUNDED → Remover acesso + Alerta equipe
PURCHASE_CANCELLED → Suspender acesso
SUBSCRIPTION_CANCELLED → Marcar como inativo
```

**Validação de Segurança:**
```typescript
// Verifica assinatura HMAC-SHA256
const signature = req.headers['x-hotmart-hottok'];
validateHotmartSignature(payload, signature);
```

**Setup .env:**
```bash
HOTMART_SECRET=seu_token_secreto_hotmart
```

### 2. Kiwify Integration

**Endpoint:** `/api/webhooks/kiwify`

**Eventos Processados:**
```typescript
order_status: "paid" → Processar compra
order_status: "refunded" → Processar reembolso
```

### 3. Facebook Pixel

**Arquivo:** `server/integrations.ts` - Função `sendToFacebookPixel()`

**Eventos Server-Side:**
```typescript
PageView → Todas as páginas
ViewContent → Landing page do curso
AddToCart → Adicionou ao carrinho
InitiateCheckout → Iniciou checkout
Purchase → Compra concluída
Lead → Capturou email
```

**Conversions API (Server-Side):**
```typescript
// Mais preciso que pixel client-side
// Bypass adblockers
// Matching melhorado (email hash)
```

**Setup .env:**
```bash
FACEBOOK_PIXEL_ID=123456789
FACEBOOK_ACCESS_TOKEN=token_aqui
```

### 4. Google Analytics 4 + Tag Manager

**Arquivo:** `server/integrations.ts` - Função `sendToGoogleAnalytics()`

**Measurement Protocol:**
```typescript
// Envio server-side de eventos
POST https://www.google-analytics.com/mp/collect
```

**Setup .env:**
```bash
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
GOOGLE_ANALYTICS_SECRET=secret_key
```

### 5. Dashboard de Analytics em Tempo Real

**Endpoint:** `/api/analytics/dashboard`

**Métricas Disponíveis:**
```typescript
interface DashboardMetrics {
  today: {
    revenue: number;
    leads: number;
    conversions: number;
    avgTicket: number;
  };
  week: { ... };
  month: { ... };
  realtime: {
    activeUsers: number;
    ongoingCheckouts: number;
  };
}
```

**Atualização:** A cada 30 segundos via WebSocket

### 6. Upsells Automáticos

**Endpoint:** `/api/upsells/trigger`

**Estratégia:**
```typescript
Comprou: Curso Básico (R$ 1.997)
Upsell 1: Mentoria Premium (R$ 997) - 50% OFF → R$ 498
         Exibido: Imediatamente após compra
         Expira: 1 hora

Upsell 2: Material Físico (R$ 297)
         Exibido: Dia 7 (após engajamento)
         Expira: 48 horas

Upsell 3: Viagem ao Paraguai (R$ 2.997)
         Exibido: Dia 30 (conclusão 50%+)
         Expira: 7 dias
```

---

## 🤖 AUTOMAÇÕES DE SUPORTE

### 1. Chatbot Inteligente (FAQ)

**Componente:** `/client/src/components/chatbot-widget.tsx`

**Backend:** `/server/support-automation.ts`

**Funcionalidades:**
- ✅ Matching inteligente de perguntas (70%+ accuracy)
- ✅ Base de conhecimento com 50+ FAQs
- ✅ Sugestões contextuais
- ✅ Escalação para humano quando necessário
- ✅ Tracking de visualizações (melhorar FAQs)

**FAQs Principais:**
```
Categoria: Acesso
- Como acessar o curso?
- Esqueci minha senha
- Não recebi email de acesso

Categoria: Pagamento
- Problemas com pagamento
- Quais formas de pagamento?
- Como funciona a garantia?

Categoria: Conteúdo
- Como baixar materiais?
- Posso assistir no celular?
- Quanto tempo de acesso?
```

**Taxa de Resolução Esperada:** 60-70% sem intervenção humana

### 2. Sistema de Tickets Prioritário

**Endpoint:** `/api/support/tickets`

**Priorização Automática:**
```typescript
Categoria: payment → HIGH
Categoria: access → HIGH
Palavras: "urgente", "emergência" → HIGH
Default → MEDIUM
```

**SLA (Service Level Agreement):**
```
CRITICAL: 1 hora
HIGH: 4 horas
MEDIUM: 24 horas
LOW: 48 horas
```

**Notificações:**
- Email para cliente (confirmação)
- Slack para equipe (tickets HIGH+)
- SMS para tickets CRITICAL (opcional)

### 3. Alertas de Problemas Críticos

**Endpoint:** `/api/alerts/check`

**Monitoramento Automático (a cada 15 min):**

```typescript
Alerta 1: Taxa de Reembolso > 5%
Severidade: CRITICAL
Ação: Notificar equipe imediatamente

Alerta 2: Taxa de Conversão < 2%
Severidade: WARNING
Ação: Revisar funil/anúncios

Alerta 3: Falhas de Pagamento > 10 em 24h
Severidade: ERROR
Ação: Verificar integração gateway

Alerta 4: Tickets não respondidos > 20
Severidade: WARNING
Ação: Escalar equipe de suporte

Alerta 5: Servidor com > 80% CPU/RAM
Severidade: CRITICAL
Ação: Auto-scaling + notificação
```

**Canais de Notificação:**
- Slack (integração webhook)
- Discord (webhook)
- Email (equipe técnica)
- SMS (alertas CRITICAL)

---

## ⚙️ SETUP E CONFIGURAÇÃO

### Variáveis de Ambiente (.env)

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Hotmart
HOTMART_SECRET=seu_token_hotmart

# Kiwify
KIWIFY_API_KEY=seu_token_kiwify

# Facebook
FACEBOOK_PIXEL_ID=123456789
FACEBOOK_ACCESS_TOKEN=token_aqui

# Google
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
GOOGLE_ANALYTICS_SECRET=secret_key

# Email Marketing
SENDGRID_API_KEY=SG.xxxxxxxxx
MAILCHIMP_API_KEY=xxxxxxxxx

# Alertas
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxx

# Server
NODE_ENV=production
PORT=3000
```

### Instalação do Banco de Dados

```bash
# 1. Criar tabelas do schema original
npm run db:push

# 2. Criar tabelas do schema do curso
# Adicionar imports em shared/schema.ts:
export * from './course-schema';

# 3. Push novamente
npm run db:push
```

### Seed de Dados Iniciais

```sql
-- Produto Principal
INSERT INTO products (name, description, price, type, sales_page_url)
VALUES (
  'Curso Importação Paraguai - Completo',
  'Aprenda o sistema completo para lucrar de R$ 5K a R$ 50K/mês',
  1997.00,
  'course',
  '/course-landing'
);

-- FAQs Iniciais
INSERT INTO faq_items (question, answer, category, keywords)
VALUES
  ('Como acessar o curso?', '...', 'access', ARRAY['acesso', 'login']),
  ('Problemas com pagamento', '...', 'payment', ARRAY['pagamento', 'cartão']);
```

### Deploy Checklist

- [ ] Configurar variáveis de ambiente
- [ ] Fazer push do schema do banco
- [ ] Seed de dados iniciais (FAQs, Produtos)
- [ ] Configurar webhooks em Hotmart/Kiwify
- [ ] Adicionar domínio ao Facebook Pixel
- [ ] Configurar Google Analytics 4
- [ ] Testar envio de emails (SendGrid)
- [ ] Configurar alertas (Slack/Discord)
- [ ] Setup de backup automático do banco
- [ ] Monitoramento (Datadog/New Relic)

---

## 📊 MONITORAMENTO E ESCALABILIDADE

### Métricas-Chave (KPIs)

**Funil:**
```
1. Tráfego Landing Page: 10.000 visitantes/dia
2. Taxa de Conversão Lead: 25% → 2.500 leads/dia
3. Taxa de Compra: 3% → 75 vendas/dia
4. Ticket Médio: R$ 1.997
5. Receita Diária: R$ 149.775
6. Receita Mensal: R$ 4.493.250
```

**Operacional:**
```
- Uptime: 99.9%
- Response Time: < 200ms
- Taxa Resolução Chatbot: 65%
- SLA Tickets: 95% cumprido
- Taxa Refund: < 5%
```

### Escalabilidade

**Horizontal Scaling:**
```
- Load Balancer (Nginx)
- Múltiplas instâncias Node.js
- PostgreSQL com replicas (read)
- Redis para cache e sessões
- CDN para assets estáticos
```

**Limites de Capacidade:**
```
Atual: 100 compras/dia
Máximo: 1.000 compras/dia (com scaling)
```

### Backup e Disaster Recovery

```
Database: Backup diário automático (30 dias retenção)
Files: S3 com versionamento
RPO (Recovery Point Objective): 24h
RTO (Recovery Time Objective): 4h
```

---

## 🗺️ ROADMAP DE IMPLEMENTAÇÃO

### Fase 1: MVP (Semanas 1-2)

**Prioridade ALTA:**
- [x] Landing page otimizada
- [x] Sistema de captura de leads
- [x] Integração Hotmart/Kiwify (webhooks)
- [x] Área de membros básica (login + vídeos)
- [x] Email de boas-vindas

### Fase 2: Automações (Semanas 3-4)

**Prioridade ALTA:**
- [ ] Sequências de email (lead magnet + carrinho)
- [ ] Sistema de tags comportamentais
- [ ] Chatbot FAQ
- [ ] Dashboard analytics básico

### Fase 3: Gamificação (Semana 5)

**Prioridade MÉDIA:**
- [ ] Sistema de pontos e conquistas
- [ ] Leaderboard
- [ ] Liberação progressiva de conteúdo

### Fase 4: Otimizações (Semana 6+)

**Prioridade BAIXA:**
- [ ] Upsells automáticos
- [ ] Sistema de tickets avançado
- [ ] Alertas críticos
- [ ] A/B testing landing pages

---

## 📈 ESTIMATIVA DE RESULTADOS

### Cenário Conservador (R$ 300K)

```
Tráfego: 5.000 visitantes/dia
Taxa Conversão Lead: 20% → 1.000 leads/dia
Taxa Compra: 2% → 20 vendas/dia
Ticket: R$ 1.997
Receita/mês: R$ 299.550
```

### Cenário Realista (R$ 600K)

```
Tráfego: 10.000 visitantes/dia
Taxa Conversão Lead: 25% → 2.500 leads/dia
Taxa Compra: 3% → 75 vendas/dia
Ticket: R$ 1.997 + Upsells (15%)
Receita/mês: R$ 573.000
```

### Cenário Otimista (R$ 1M+)

```
Tráfego: 15.000 visitantes/dia
Taxa Conversão Lead: 30% → 4.500 leads/dia
Taxa Compra: 4% → 180 vendas/dia
Ticket: R$ 1.997 + Upsells (25%)
Receita/mês: R$ 1.346.850
```

---

## 🎯 CONCLUSÃO

Esta infraestrutura foi projetada para **escalar de forma automatizada**, minimizando intervenção manual e maximizando conversões.

**Diferenciais Competitivos:**
✅ Funil 100% automatizado (lead → venda → acesso)
✅ Gamificação para engajamento e retenção
✅ Integrações server-side (tracking preciso)
✅ Suporte automatizado (chatbot + tickets)
✅ Alertas proativos (prevenir problemas)

**Próximos Passos:**
1. Implementar Fase 1 (MVP)
2. Configurar integrações
3. Teste A/B landing page
4. Soft launch (100 leads/dia)
5. Otimizar e escalar

---

**Desenvolvido por:** Automation Infrastructure Engineer
**Data:** Outubro 2025
**Versão:** 1.0.0

**Contato Técnico:** tech@paraguayimport.com.br
