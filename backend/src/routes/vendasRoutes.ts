import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

router.use(authMiddleware)

// Listar vendas
router.get('/', async (req, res) => {
  try {
    const vendas = await prisma.venda.findMany({
      where: { lojaId: req.user!.lojaId },
      include: {
        itens: {
          include: {
            produto: true,
          },
        },
        usuario: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json(vendas)
  } catch (error) {
    console.error('Erro ao listar vendas:', error)
    res.status(500).json({ error: 'Erro ao listar vendas' })
  }
})

// Criar venda
router.post('/', async (req, res) => {
  try {
    const { itens, formaPagamento, desconto, observacoes } = req.body

    // Calcular total
    let total = 0
    for (const item of itens) {
      const produto = await prisma.produto.findUnique({
        where: { id: item.produtoId },
      })

      if (!produto) {
        return res.status(404).json({ error: `Produto ${item.produtoId} não encontrado` })
      }

      total += Number(produto.preco) * item.quantidade
    }

    total -= desconto || 0

    // Gerar número da venda
    const ultimaVenda = await prisma.venda.findFirst({
      orderBy: { id: 'desc' },
    })
    const numero = `V${String((ultimaVenda?.id || 0) + 1).padStart(6, '0')}`

    // Criar venda
    const venda = await prisma.venda.create({
      data: {
        numero,
        usuarioId: req.user!.userId,
        lojaId: req.user!.lojaId,
        total,
        desconto: desconto || 0,
        formaPagamento,
        observacoes,
        itens: {
          create: itens.map((item: any) => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            precoUnit: item.precoUnit,
            subtotal: item.precoUnit * item.quantidade,
          })),
        },
      },
      include: {
        itens: {
          include: {
            produto: true,
          },
        },
      },
    })

    // Atualizar estoque
    for (const item of itens) {
      const estoque = await prisma.estoque.findFirst({
        where: {
          produtoId: item.produtoId,
          lojaId: req.user!.lojaId,
        },
      })

      if (estoque) {
        await prisma.estoque.update({
          where: { id: estoque.id },
          data: { quantidade: estoque.quantidade - item.quantidade },
        })

        // Registrar movimentação
        await prisma.movimentacaoEstoque.create({
          data: {
            produtoId: item.produtoId,
            lojaId: req.user!.lojaId,
            tipo: 'saida',
            quantidade: item.quantidade,
            motivo: `Venda ${numero}`,
          },
        })
      }
    }

    res.status(201).json(venda)
  } catch (error) {
    console.error('Erro ao criar venda:', error)
    res.status(500).json({ error: 'Erro ao criar venda' })
  }
})

export default router
