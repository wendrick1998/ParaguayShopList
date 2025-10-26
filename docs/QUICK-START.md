# ⚡ Quick Start - Implementação Rápida

## 🚀 Setup em 30 Minutos

### Pré-requisitos
- Node.js 18+ instalado
- PostgreSQL 14+ rodando
- Conta Hotmart ou Kiwify
- Conta Facebook Ads (Pixel)
- Conta SendGrid ou Mailchimp

---

## 📦 Passo 1: Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/paraguayshoplist.git
cd paraguayshoplist

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais
```

---

## 🗄️ Passo 2: Banco de Dados

```bash
# Executar migrações
npm run db:push

# Seed dados iniciais
psql $DATABASE_URL < docs/seed.sql
```

**Seed Manual (SQL):**
```sql
-- Produto Principal
INSERT INTO products (name, description, price, type, is_active, sales_page_url)
VALUES (
  'Curso Importação Paraguai - Método Completo',
  'Sistema comprovado para lucrar R$ 5K-50K/mês importando do Paraguai',
  1997.00,
  'course',
  true,
  '/course-landing'
) RETURNING id;

-- FAQs Essenciais
INSERT INTO faq_items (question, answer, category, keywords, is_active)
VALUES
  (
    'Como acessar o curso?',
    'Faça login com o email usado na compra. Acesso é imediato após confirmação do pagamento. Verifique spam se não receber o email.',
    'access',
    ARRAY['acesso', 'login', 'entrar', 'curso'],
    true
  ),
  (
    'Problemas com pagamento',
    'Verifique limite do cartão, dados corretos, ou tente outro método. Abra ticket se persistir.',
    'payment',
    ARRAY['pagamento', 'cartão', 'pix', 'boleto'],
    true
  ),
  (
    'Como funciona a garantia?',
    'Garantia incondicional de 7 dias. Reembolso total se não ficar satisfeito.',
    'payment',
    ARRAY['garantia', 'reembolso', 'devolução'],
    true
  );
```

---

## ⚙️ Passo 3: Configurar Integrações

### 3.1 Hotmart Webhook

1. Acesse: Hotmart > Ferramentas > Webhook
2. URL: `https://seudominio.com/api/webhooks/hotmart`
3. Eventos: Marque todos
4. Copie o Secret e adicione em `.env`:
   ```
   HOTMART_SECRET=seu_secret_aqui
   ```

### 3.2 Facebook Pixel

1. Acesse: Facebook Business > Eventos > Conversions API
2. Gere Token de Acesso
3. Adicione em `.env`:
   ```
   FACEBOOK_PIXEL_ID=123456789
   FACEBOOK_ACCESS_TOKEN=seu_token
   ```

### 3.3 SendGrid (Email)

1. Acesse: SendGrid > API Keys > Create API Key
2. Permissões: Full Access
3. Adicione em `.env`:
   ```
   SENDGRID_API_KEY=SG.xxxxx
   SENDGRID_FROM_EMAIL=suporte@seudominio.com
   ```

### 3.4 Slack Alertas (Opcional)

1. Crie Incoming Webhook em seu Slack
2. Adicione em `.env`:
   ```
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
   ```

---

## 🎨 Passo 4: Personalizar Conteúdo

### Landing Page

Edite: `client/src/pages/course-landing.tsx`

```typescript
// Altere:
- Título do curso
- Preço (linha ~230)
- Depoimentos (linha ~170)
- Vídeo VSL URL
- Imagens
```

### Área de Membros

Edite: `client/src/pages/members-area.tsx`

```typescript
// Adicione seus módulos/aulas
// Conecte com banco de dados real
```

---

## 🚀 Passo 5: Deploy

### Opção A: Replit (Mais Fácil)

```bash
# Já está configurado!
# Basta configurar secrets no painel do Replit
```

### Opção B: Vercel + Neon (PostgreSQL)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Configure env vars no dashboard
```

### Opção C: Railway

```bash
# railway.app - PostgreSQL incluído
railway login
railway init
railway up
```

---

## ✅ Passo 6: Testar

### Teste Completo do Funil

```bash
# 1. Landing Page
https://seudominio.com/

# 2. Captura Lead
Preencha formulário do lead magnet
→ Verificar: Email recebido?

# 3. Simulação de Compra
Use Hotmart sandbox para testar webhook
→ Verificar: Acesso criado automaticamente?

# 4. Área de Membros
Login com email de teste
→ Verificar: Aulas carregando?

# 5. Chatbot
Abra widget, faça perguntas
→ Verificar: Respostas corretas?
```

---

## 📊 Passo 7: Monitoramento

### Dashboard Analytics

Acesse: `https://seudominio.com/admin/dashboard`

Métricas exibidas:
- Receita (hoje/semana/mês)
- Leads capturados
- Taxa de conversão
- Tickets abertos
- Alertas ativos

### Logs em Tempo Real

```bash
# Ver logs do servidor
npm run dev

# Ou em produção
railway logs --follow  # Railway
vercel logs            # Vercel
```

---

## 🔧 Troubleshooting

### Webhook não está funcionando

```bash
# Testar manualmente
curl -X POST https://seudominio.com/api/webhooks/hotmart \
  -H "Content-Type: application/json" \
  -d '{"event":"PURCHASE_COMPLETE", ...}'

# Verificar logs
tail -f logs/webhooks.log
```

### Emails não estão enviando

```bash
# Verificar SendGrid
curl -X POST https://api.sendgrid.com/v3/mail/send \
  -H "Authorization: Bearer $SENDGRID_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"personalizations":[{"to":[{"email":"teste@teste.com"}]}], ...}'
```

### Pixel não está disparando

1. Instale Facebook Pixel Helper (extensão Chrome)
2. Acesse landing page
3. Verifique eventos sendo enviados

---

## 📚 Documentação Completa

Para detalhes técnicos completos, veja:
- [AUTOMATION-INFRASTRUCTURE.md](./AUTOMATION-INFRASTRUCTURE.md)

---

## 🆘 Suporte

- **Documentação:** `/docs`
- **Issues:** GitHub Issues
- **Email:** tech@paraguayimport.com.br

---

**Tempo Total de Setup:** 30-60 minutos ⏱️

**Próximo Passo:** Configurar anúncios e começar a enviar tráfego! 🚀
