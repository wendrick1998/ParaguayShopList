// Script para verificar o que existe no Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wqgusnsymbnwouhbwavy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxZ3VzbnN5bWJud291aGJ3YXZ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjk1NTc3NywiZXhwIjoyMDc4NTMxNzc3fQ.J2bf531lz3l3ZnATZcOhp5zHtqn83fTsyVDRiSbRK4w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSupabase() {
  console.log('🔍 VERIFICANDO SUPABASE...\n');
  console.log('URL:', supabaseUrl);
  console.log('='.repeat(60));

  try {
    // Testar conexão básica
    console.log('\n✅ Testando conexão...');
    const { data: healthData, error: healthError } = await supabase
      .from('_health')
      .select('*')
      .limit(1);

    if (healthError && healthError.code !== 'PGRST116') {
      console.log('⚠️  Health check:', healthError.message);
    } else {
      console.log('✅ Conexão OK!');
    }

    // Listar tabelas existentes tentando queries
    console.log('\n📋 VERIFICANDO TABELAS EXISTENTES:\n');

    const tablesToCheck = [
      'usuarios',
      'users',
      'shopping_lists',
      'list_items',
      'sessions',
      'lojas',
      'iphones',
      'leiloes',
      'envios',
      'cotacoes_dolar',
      'vendas',
      'vendas_prazo',
      'parcelas'
    ];

    for (const table of tablesToCheck) {
      const { data, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        if (error.code === '42P01' || error.message.includes('not found')) {
          console.log(`❌ ${table.padEnd(20)} - Não existe`);
        } else {
          console.log(`⚠️  ${table.padEnd(20)} - Erro: ${error.message}`);
        }
      } else {
        const count = data?.length || 0;
        console.log(`✅ ${table.padEnd(20)} - Existe! (${count} registros)`);
      }
    }

    // Tentar buscar schema info
    console.log('\n📊 TENTANDO BUSCAR INFORMAÇÕES DO SCHEMA...\n');

    const { data: schemaData, error: schemaError } = await supabase
      .rpc('get_table_info', {});

    if (schemaError) {
      console.log('ℹ️  Não foi possível buscar schema completo (function não existe)');
    } else {
      console.log('Schema:', schemaData);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ VERIFICAÇÃO CONCLUÍDA!\n');

  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    console.error(error);
  }
}

checkSupabase();
