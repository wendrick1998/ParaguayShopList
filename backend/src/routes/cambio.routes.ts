import { Router, Request, Response } from 'express'
import supabase from '../config/supabase.js'

const router = Router()

// GET /api/cambio - Listar todas as cotações
router.get('/', async (req: Request, res: Response) => {
  try {
    const { tipo } = req.query

    let query = supabase
      .from('cotacoes_dolar')
      .select('*')
      .order('data', { ascending: false })
      .limit(30) // Últimas 30 cotações

    if (tipo) {
      query = query.eq('tipo', tipo)
    }

    const { data, error } = await query

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    console.error('Erro ao buscar cotações:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/cambio/atual - Cotação atual (mais recente)
router.get('/atual', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('cotacoes_dolar')
      .select('*')
      .order('data', { ascending: false })
      .limit(1)
      .single()

    if (error) throw error

    if (!data) {
      // Se não houver cotação, retornar uma padrão
      return res.json({
        cotacao: 5.85,
        data: new Date().toISOString().split('T')[0],
        tipo: 'referencia'
      })
    }

    res.json(data)
  } catch (error: any) {
    console.error('Erro ao buscar cotação atual:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/cambio/stats - Estatísticas das cotações
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('cotacoes_dolar')
      .select('cotacao')

    if (error) throw error

    if (!data || data.length === 0) {
      return res.json({
        media: 5.85,
        maior: 5.85,
        menor: 5.85,
        total_registros: 0
      })
    }

    const cotacoes = data.map((c: any) => Number(c.cotacao))
    const media = cotacoes.reduce((a: number, b: number) => a + b, 0) / cotacoes.length
    const maior = Math.max(...cotacoes)
    const menor = Math.min(...cotacoes)

    res.json({
      media: Number(media.toFixed(4)),
      maior: Number(maior.toFixed(4)),
      menor: Number(menor.toFixed(4)),
      total_registros: cotacoes.length
    })
  } catch (error: any) {
    console.error('Erro ao buscar estatísticas:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/cambio - Registrar nova cotação
router.post('/', async (req: Request, res: Response) => {
  try {
    const { data: dataInput, cotacao, tipo, observacoes } = req.body

    if (!cotacao) {
      return res.status(400).json({ error: 'Cotação é obrigatória' })
    }

    const { data, error } = await supabase
      .from('cotacoes_dolar')
      .insert({
        data: dataInput || new Date().toISOString().split('T')[0],
        cotacao,
        tipo: tipo || 'referencia',
        observacoes: observacoes || null
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error: any) {
    console.error('Erro ao registrar cotação:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT /api/cambio/:id - Atualizar cotação
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updates = req.body

    const { data, error } = await supabase
      .from('cotacoes_dolar')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    if (!data) {
      return res.status(404).json({ error: 'Cotação não encontrada' })
    }

    res.json(data)
  } catch (error: any) {
    console.error('Erro ao atualizar cotação:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/cambio/:id - Deletar cotação
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('cotacoes_dolar')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ message: 'Cotação deletada com sucesso' })
  } catch (error: any) {
    console.error('Erro ao deletar cotação:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
