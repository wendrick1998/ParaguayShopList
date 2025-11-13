# 🚀 GUIA DE SETUP DO SUPABASE - PASSO A PASSO

## ✅ PASSO 1: ACESSAR O SQL EDITOR

1. Abra: https://supabase.com/dashboard/project/wqgusnsymbnwouhbwavy/sql/new
2. Você verá um editor de SQL vazio

---

## ✅ PASSO 2: COPIAR O SCRIPT SQL

1. Abra o arquivo: `/home/user/ParaguayShopList/backend/supabase-schema.sql`
2. Copie **TODO** o conteúdo (Ctrl+A, Ctrl+C)

---

## ✅ PASSO 3: COLAR E EXECUTAR

1. Cole no SQL Editor do Supabase (Ctrl+V)
2. Clique no botão **"Run"** (ou pressione Ctrl+Enter)
3. Aguarde ~10 segundos

---

## ✅ PASSO 4: VERIFICAR SE DEU CERTO

Após executar, você deverá ver:
- ✅ "Success. No rows returned"
- ✅ Ou uma mensagem de sucesso

Depois:
1. Vá em: https://supabase.com/dashboard/project/wqgusnsymbnwouhbwavy/editor
2. Você deverá ver as seguintes tabelas:
   - ✅ usuarios
   - ✅ lojas
   - ✅ iphones
   - ✅ leiloes
   - ✅ envios
   - ✅ cotacoes_dolar
   - ✅ vendas
   - ✅ vendas_prazo
   - ✅ parcelas

---

## ⚠️ SE DER ERRO

Se aparecer algum erro, me envie a mensagem completa e eu ajusto!

Erros comuns:
- **"relation already exists"** → Tabela já existe, tudo bem!
- **"permission denied"** → Use a service_role key no .env

---

## ✅ PASSO 5: AVISAR QUE DEU CERTO

Depois de executar, me avise com:
- ✅ "Executei o SQL, deu certo!"
- ❌ "Deu erro: [cole a mensagem]"

Aí eu continuo com o backend e frontend! 🚀
