import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

router.use(authMiddleware)

// Abrir caixa
router.post('/abrir', async (req, res) => {
  try {
    const { saldoInicial } = req.body

    // Verificar se já existe caixa aberto
    const caixaAberto = await prisma.caixa.findFirst({
      where: {
        lojaId: req.user!.lojaId,
        status: 'aberto',
      },
    })

    if (caixaAberto) {
      return res.status(400).json({ error: 'Já existe um caixa aberto' })
    }

    const caixa = await prisma.caixa.create({
      data: {
        lojaId: req.user!.lojaId,
        usuarioId: req.user!.userId,
        saldoInicial,
      },
    })

    res.status(201).json(caixa)
  } catch (error) {
    console.error('Erro ao abrir caixa:', error)
    res.status(500).json({ error: 'Erro ao abrir caixa' })
  }
})

// Fechar caixa
router.post('/fechar/:id', async (req, res) => {
  try {
    const { saldoFinal, observacoes } = req.body

    const caixa = await prisma.caixa.findFirst({
      where: {
        id: Number(req.params.id),
        lojaId: req.user!.lojaId,
        status: 'aberto',
      },
    })

    if (!caixa) {
      return res.status(404).json({ error: 'Caixa não encontrado ou já fechado' })
    }

    // Calcular total de vendas do dia
    const vendas = await prisma.venda.findMany({
      where: {
        lojaId: req.user!.lojaId,
        createdAt: {
          gte: caixa.dataAbertura,
        },
      },
    })

    const totalVendas = vendas.reduce((acc, venda) => acc + Number(venda.total), 0)

    const caixaAtualizado = await prisma.caixa.update({
      where: { id: caixa.id },
      data: {
        status: 'fechado',
        dataFechamento: new Date(),
        saldoFinal,
        totalVendas,
        observacoes,
      },
    })

    res.json(caixaAtualizado)
  } catch (error) {
    console.error('Erro ao fechar caixa:', error)
    res.status(500).json({ error: 'Erro ao fechar caixa' })
  }
})

// Listar caixas
router.get('/', async (req, res) => {
  try {
    const caixas = await prisma.caixa.findMany({
      where: { lojaId: req.user!.lojaId },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json(caixas)
  } catch (error) {
    console.error('Erro ao listar caixas:', error)
    res.status(500).json({ error: 'Erro ao listar caixas' })
  }
})

// Buscar caixa aberto
router.get('/aberto', async (req, res) => {
  try {
    const caixa = await prisma.caixa.findFirst({
      where: {
        lojaId: req.user!.lojaId,
        status: 'aberto',
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    })

    res.json(caixa)
  } catch (error) {
    console.error('Erro ao buscar caixa aberto:', error)
    res.status(500).json({ error: 'Erro ao buscar caixa aberto' })
  }
})

export default router
