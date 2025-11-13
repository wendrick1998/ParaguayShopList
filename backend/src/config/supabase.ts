import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERRO: Variáveis de ambiente do Supabase não configuradas!')
  console.error('SUPABASE_URL:', supabaseUrl ? 'OK' : 'FALTANDO')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? 'OK' : 'FALTANDO')
  throw new Error('Supabase URL e Service Role Key são obrigatórios! Verifique o arquivo .env')
}

// Cliente Supabase com service_role (acesso completo)
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Cliente Supabase com anon key (para autenticação de usuários)
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''
export const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
