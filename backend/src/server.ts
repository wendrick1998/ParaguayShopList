import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import produtosRoutes from './routes/produtosRoutes.js'
import estoqueRoutes from './routes/estoqueRoutes.js'
import vendasRoutes from './routes/vendasRoutes.js'
import caixaRoutes from './routes/caixaRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SEC+ API is running' })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/produtos', produtosRoutes)
app.use('/api/estoque', estoqueRoutes)
app.use('/api/vendas', vendasRoutes)
app.use('/api/caixa', caixaRoutes)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
  })
})

app.listen(PORT, () => {
  console.log(`🚀 SEC+ Server running on port ${PORT}`)
})
