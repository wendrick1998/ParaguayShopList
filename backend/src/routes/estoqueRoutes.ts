import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

router.use(authMiddleware)

// Listar estoque
router.get('/', async (req, res) => {
  try {
    const estoques = await prisma.estoque.findMany({
      where: { lojaId: req.user!.lojaId },
      include: {
        produto: true,
      },
    })

    res.json(estoques)
  } catch (error) {
    console.error('Erro ao listar estoque:', error)
    res.status(500).json({ error: 'Erro ao listar estoque' })
  }
})

// Adicionar movimentação de estoque
router.post('/movimentacao', async (req, res) => {
  try {
    const { produtoId, tipo, quantidade, motivo, observacoes } = req.body

    // Criar movimentação
    const movimentacao = await prisma.movimentacaoEstoque.create({
      data: {
        produtoId,
        lojaId: req.user!.lojaId,
        tipo,
        quantidade,
        motivo,
        observacoes,
      },
    })

    // Atualizar estoque
    const estoque = await prisma.estoque.findFirst({
      where: {
        produtoId,
        lojaId: req.user!.lojaId,
      },
    })

    if (estoque) {
      const novaQuantidade =
        tipo === 'entrada'
          ? estoque.quantidade + quantidade
          : estoque.quantidade - quantidade

      await prisma.estoque.update({
        where: { id: estoque.id },
        data: { quantidade: novaQuantidade },
      })
    }

    res.status(201).json(movimentacao)
  } catch (error) {
    console.error('Erro ao criar movimentação:', error)
    res.status(500).json({ error: 'Erro ao criar movimentação' })
  }
})

// Listar movimentações
router.get('/movimentacoes', async (req, res) => {
  try {
    const movimentacoes = await prisma.movimentacaoEstoque.findMany({
      where: { lojaId: req.user!.lojaId },
      include: {
        produto: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json(movimentacoes)
  } catch (error) {
    console.error('Erro ao listar movimentações:', error)
    res.status(500).json({ error: 'Erro ao listar movimentações' })
  }
})

export default router
