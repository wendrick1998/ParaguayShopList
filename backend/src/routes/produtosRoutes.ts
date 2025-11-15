import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth.js'
import { validate } from '../middleware/validation.js'
import { z } from 'zod'

const router = Router()
const prisma = new PrismaClient()

const produtoSchema = z.object({
  nome: z.string().min(1),
  descricao: z.string().optional(),
  preco: z.number().positive(),
  codigoBarras: z.string().optional(),
})

// Todas as rotas precisam de autenticação
router.use(authMiddleware)

// Listar produtos
router.get('/', async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      where: { lojaId: req.user!.lojaId },
      include: {
        estoques: true,
      },
    })

    res.json(produtos)
  } catch (error) {
    console.error('Erro ao listar produtos:', error)
    res.status(500).json({ error: 'Erro ao listar produtos' })
  }
})

// Buscar produto por ID
router.get('/:id', async (req, res) => {
  try {
    const produto = await prisma.produto.findFirst({
      where: {
        id: Number(req.params.id),
        lojaId: req.user!.lojaId,
      },
      include: {
        estoques: true,
      },
    })

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    res.json(produto)
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    res.status(500).json({ error: 'Erro ao buscar produto' })
  }
})

// Criar produto
router.post('/', validate(produtoSchema), async (req, res) => {
  try {
    const produto = await prisma.produto.create({
      data: {
        ...req.body,
        lojaId: req.user!.lojaId,
      },
    })

    // Criar estoque inicial
    await prisma.estoque.create({
      data: {
        produtoId: produto.id,
        lojaId: req.user!.lojaId,
        quantidade: 0,
      },
    })

    res.status(201).json(produto)
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    res.status(500).json({ error: 'Erro ao criar produto' })
  }
})

// Atualizar produto
router.put('/:id', validate(produtoSchema), async (req, res) => {
  try {
    const produto = await prisma.produto.updateMany({
      where: {
        id: Number(req.params.id),
        lojaId: req.user!.lojaId,
      },
      data: req.body,
    })

    if (produto.count === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    res.json({ message: 'Produto atualizado com sucesso' })
  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    res.status(500).json({ error: 'Erro ao atualizar produto' })
  }
})

// Deletar produto
router.delete('/:id', async (req, res) => {
  try {
    const produto = await prisma.produto.deleteMany({
      where: {
        id: Number(req.params.id),
        lojaId: req.user!.lojaId,
      },
    })

    if (produto.count === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    res.json({ message: 'Produto deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar produto:', error)
    res.status(500).json({ error: 'Erro ao deletar produto' })
  }
})

export default router
