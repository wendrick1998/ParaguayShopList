import { Router, Request, Response } from 'express'
import supabase from '../config/supabase.js'

const router = Router()

// GET /api/iphones - Listar todos os iPhones
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, vendido } = req.query

    let query = supabase
      .from('iphones')
      .select('*, leiloes(*), envios(*)')
      .order('created_at', { ascending: false })

    // Filtros opcionais
    if (status) {
      query = query.eq('status', status)
    }
    if (vendido !== undefined) {
      query = query.eq('vendido', vendido === 'true')
    }

    const { data, error } = await query

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    console.error('Erro ao buscar iPhones:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/iphones/:id - Buscar iPhone por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('iphones')
      .select('*, leiloes(*), envios(*)')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) {
      return res.status(404).json({ error: 'iPhone não encontrado' })
    }

    res.json(data)
  } catch (error: any) {
    console.error('Erro ao buscar iPhone:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/iphones - Criar novo iPhone
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      imei,
      modelo,
      capacidade,
      cor,
      grade,
      battery_health,
      fornecedor,
      data_compra,
      preco_usd,
      cotacao_dolar,
      frete_usd,
      percentual_frete_importacao,
      custo_assistencia_tecnica,
      custo_reparo,
      custo_garantia,
      preco_venda_brl,
      percentual_frete_venda,
      leilao_id,
      envio_id,
      loja_id,
      observacoes
    } = req.body

    // Validações básicas
    if (!imei || !modelo || !capacidade || !cor || !grade || battery_health === undefined) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' })
    }

    if (!preco_usd || !cotacao_dolar) {
      return res.status(400).json({ error: 'Preço USD e cotação do dólar são obrigatórios' })
    }

    // Cálculos automáticos
    const custo_brl = preco_usd * cotacao_dolar
    const frete_brl = (frete_usd || 0) * cotacao_dolar
    const base_calculo = custo_brl + frete_brl
    const imposto = base_calculo * 0.6 // 60%

    const custo_total =
      custo_brl +
      frete_brl +
      imposto +
      (custo_assistencia_tecnica || 0) +
      (custo_reparo || 0) +
      (custo_garantia || 0)

    const frete_cliente_brl = preco_venda_brl
      ? (preco_venda_brl * (percentual_frete_venda || 5) / 100)
      : 0

    const margem_lucro = preco_venda_brl ? (preco_venda_brl - custo_total) : 0
    const margem_percentual = custo_total > 0 ? (margem_lucro / custo_total) * 100 : 0

    // Criar iPhone
    const { data, error } = await supabase
      .from('iphones')
      .insert({
        imei,
        modelo,
        capacidade,
        cor,
        grade,
        battery_health,
        fornecedor,
        data_compra: data_compra || new Date().toISOString().split('T')[0],
        preco_usd,
        cotacao_dolar,
        custo_brl,
        frete_usd: frete_usd || 0,
        percentual_frete_importacao: percentual_frete_importacao || 8,
        frete_brl,
        imposto,
        custo_assistencia_tecnica: custo_assistencia_tecnica || 0,
        custo_reparo: custo_reparo || 0,
        custo_garantia: custo_garantia || 0,
        custo_total,
        preco_venda_brl: preco_venda_brl || null,
        percentual_frete_venda: percentual_frete_venda || 5,
        frete_cliente_brl,
        margem_lucro,
        margem_percentual,
        status: 'comprado',
        vendido: false,
        leilao_id: leilao_id || null,
        envio_id: envio_id || null,
        loja_id: loja_id || null,
        observacoes: observacoes || null
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error: any) {
    console.error('Erro ao criar iPhone:', error)

    if (error.code === '23505') {
      return res.status(400).json({ error: 'IMEI já cadastrado' })
    }

    res.status(500).json({ error: error.message })
  }
})

// PUT /api/iphones/:id - Atualizar iPhone
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updates = req.body

    // Se houver mudanças nos valores, recalcular
    if (updates.preco_usd || updates.cotacao_dolar || updates.preco_venda_brl) {
      const { data: iphoneAtual } = await supabase
        .from('iphones')
        .select('*')
        .eq('id', id)
        .single()

      if (iphoneAtual) {
        const preco_usd = updates.preco_usd || iphoneAtual.preco_usd
        const cotacao_dolar = updates.cotacao_dolar || iphoneAtual.cotacao_dolar
        const frete_usd = updates.frete_usd || iphoneAtual.frete_usd || 0

        const custo_brl = preco_usd * cotacao_dolar
        const frete_brl = frete_usd * cotacao_dolar
        const base_calculo = custo_brl + frete_brl
        const imposto = base_calculo * 0.6

        const custo_total =
          custo_brl +
          frete_brl +
          imposto +
          (updates.custo_assistencia_tecnica || iphoneAtual.custo_assistencia_tecnica || 0) +
          (updates.custo_reparo || iphoneAtual.custo_reparo || 0) +
          (updates.custo_garantia || iphoneAtual.custo_garantia || 0)

        const preco_venda_brl = updates.preco_venda_brl || iphoneAtual.preco_venda_brl
        const percentual_frete_venda = updates.percentual_frete_venda || iphoneAtual.percentual_frete_venda || 5
        const frete_cliente_brl = preco_venda_brl ? (preco_venda_brl * percentual_frete_venda / 100) : 0

        const margem_lucro = preco_venda_brl ? (preco_venda_brl - custo_total) : 0
        const margem_percentual = custo_total > 0 ? (margem_lucro / custo_total) * 100 : 0

        // Adicionar valores calculados aos updates
        Object.assign(updates, {
          custo_brl,
          frete_brl,
          imposto,
          custo_total,
          frete_cliente_brl,
          margem_lucro,
          margem_percentual
        })
      }
    }

    const { data, error } = await supabase
      .from('iphones')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    if (!data) {
      return res.status(404).json({ error: 'iPhone não encontrado' })
    }

    res.json(data)
  } catch (error: any) {
    console.error('Erro ao atualizar iPhone:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/iphones/:id - Deletar iPhone
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('iphones')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ message: 'iPhone deletado com sucesso' })
  } catch (error: any) {
    console.error('Erro ao deletar iPhone:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/iphones/stats/dashboard - Estatísticas para o dashboard
router.get('/stats/dashboard', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('vw_dashboard_metrics')
      .select('*')
      .single()

    if (error) throw error

    res.json(data || {
      total_iphones: 0,
      em_estoque: 0,
      vendidos: 0,
      em_transito: 0,
      investido_usd: 0,
      investido_brl: 0,
      lucro_total: 0,
      margem_media: 0
    })
  } catch (error: any) {
    console.error('Erro ao buscar estatísticas:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
