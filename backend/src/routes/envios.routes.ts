import { Router, Request, Response } from 'express'
import supabase from '../config/supabase.js'

const router = Router()

// GET /api/envios - Listar todos os envios
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status } = req.query

    let query = supabase
      .from('envios')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    console.error('Erro ao buscar envios:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/envios/:id - Buscar envio por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('envios')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) {
      return res.status(404).json({ error: 'Envio não encontrado' })
    }

    // Buscar iPhones do envio
    const { data: iphones } = await supabase
      .from('iphones')
      .select('*')
      .eq('envio_id', id)

    res.json({ ...data, iphones })
  } catch (error: any) {
    console.error('Erro ao buscar envio:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/envios - Criar novo envio
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      codigo_rastreamento,
      origem,
      destino_intermediario,
      destino_final,
      freteiro_usa_py,
      freteiro_paraguai,
      freteiro_py_br,
      data_envio_usa,
      previsao_entrega_br,
      custo_frete_usd,
      percentual_frete_importacao,
      custo_frete_py_br,
      percentual_frete_venda,
      observacoes
    } = req.body

    if (!codigo_rastreamento || !origem) {
      return res.status(400).json({ error: 'Código de rastreamento e origem são obrigatórios' })
    }

    // Calcular custo frete em BRL (assumindo cotação fixa para o exemplo)
    const cotacao_default = 5.85
    const custo_frete_brl = (custo_frete_usd || 0) * cotacao_default

    const { data, error } = await supabase
      .from('envios')
      .insert({
        codigo_rastreamento,
        origem,
        destino_intermediario: destino_intermediario || null,
        destino_final: destino_final || null,
        freteiro_usa_py: freteiro_usa_py || null,
        freteiro_paraguai: freteiro_paraguai || null,
        freteiro_py_br: freteiro_py_br || null,
        data_envio_usa: data_envio_usa || null,
        previsao_entrega_br: previsao_entrega_br || null,
        custo_frete_usd: custo_frete_usd || 0,
        percentual_frete_importacao: percentual_frete_importacao || 8,
        custo_frete_brl,
        custo_frete_py_br: custo_frete_py_br || 0,
        percentual_frete_venda: percentual_frete_venda || 5,
        status: 'aguardando_envio',
        quantidade_iphones: 0,
        valor_total_iphones: 0,
        observacoes: observacoes || null
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error: any) {
    console.error('Erro ao criar envio:', error)

    if (error.code === '23505') {
      return res.status(400).json({ error: 'Código de rastreamento já cadastrado' })
    }

    res.status(500).json({ error: error.message })
  }
})

// PUT /api/envios/:id - Atualizar envio
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updates = req.body

    const { data, error } = await supabase
      .from('envios')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    if (!data) {
      return res.status(404).json({ error: 'Envio não encontrado' })
    }

    res.json(data)
  } catch (error: any) {
    console.error('Erro ao atualizar envio:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/envios/:id - Deletar envio
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('envios')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ message: 'Envio deletado com sucesso' })
  } catch (error: any) {
    console.error('Erro ao deletar envio:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
