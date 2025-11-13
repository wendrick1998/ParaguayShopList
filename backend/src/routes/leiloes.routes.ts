import { Router, Request, Response } from 'express'
import supabase from '../config/supabase.js'

const router = Router()

// GET /api/leiloes - Listar todos os leilões
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status } = req.query

    let query = supabase
      .from('leiloes')
      .select('*')
      .order('data_leilao', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    console.error('Erro ao buscar leilões:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/leiloes/:id - Buscar leilão por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('leiloes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) {
      return res.status(404).json({ error: 'Leilão não encontrado' })
    }

    // Buscar iPhones do leilão
    const { data: iphones } = await supabase
      .from('iphones')
      .select('*')
      .eq('leilao_id', id)

    res.json({ ...data, iphones })
  } catch (error: any) {
    console.error('Erro ao buscar leilão:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/leiloes - Criar novo leilão
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      plataforma,
      numero_lote,
      data_leilao,
      fornecedor,
      valor_total_usd,
      observacoes
    } = req.body

    if (!plataforma || !numero_lote || !data_leilao || !valor_total_usd) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' })
    }

    const { data, error } = await supabase
      .from('leiloes')
      .insert({
        plataforma,
        numero_lote,
        data_leilao,
        fornecedor: fornecedor || null,
        valor_total_usd,
        quantidade_iphones: 0,
        status: 'arrematado',
        observacoes: observacoes || null
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error: any) {
    console.error('Erro ao criar leilão:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT /api/leiloes/:id - Atualizar leilão
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updates = req.body

    const { data, error } = await supabase
      .from('leiloes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    if (!data) {
      return res.status(404).json({ error: 'Leilão não encontrado' })
    }

    res.json(data)
  } catch (error: any) {
    console.error('Erro ao atualizar leilão:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/leiloes/:id - Deletar leilão
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('leiloes')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ message: 'Leilão deletado com sucesso' })
  } catch (error: any) {
    console.error('Erro ao deletar leilão:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
