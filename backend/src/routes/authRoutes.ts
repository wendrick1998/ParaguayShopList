import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { validate } from '../middleware/validation.js'

const router = Router()
const prisma = new PrismaClient()

const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(6),
})

const registerSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
  senha: z.string().min(6),
  lojaId: z.number(),
})

// Login
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, senha } = req.body

    const usuario = await prisma.usuario.findUnique({
      where: { email },
    })

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha)

    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const secret = process.env.JWT_SECRET || 'secret-key-change-in-production'
    const token = jwt.sign(
      { userId: usuario.id, lojaId: usuario.lojaId },
      secret,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        lojaId: usuario.lojaId,
      },
    })
  } catch (error) {
    console.error('Erro no login:', error)
    res.status(500).json({ error: 'Erro ao fazer login' })
  }
})

// Register
router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { nome, email, senha, lojaId } = req.body

    const usuarioExiste = await prisma.usuario.findUnique({
      where: { email },
    })

    if (usuarioExiste) {
      return res.status(400).json({ error: 'Email já cadastrado' })
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        lojaId,
      },
    })

    const secret = process.env.JWT_SECRET || 'secret-key-change-in-production'
    const token = jwt.sign(
      { userId: usuario.id, lojaId: usuario.lojaId },
      secret,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      token,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        lojaId: usuario.lojaId,
      },
    })
  } catch (error) {
    console.error('Erro ao registrar:', error)
    res.status(500).json({ error: 'Erro ao registrar usuário' })
  }
})

export default router
