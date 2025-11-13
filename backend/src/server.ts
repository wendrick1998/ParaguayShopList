import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Rotas antigas (Prisma) - Temporariamente desabilitadas devido a restrições de rede
// import authRoutes from './routes/authRoutes.js'
// import produtosRoutes from './routes/produtosRoutes.js'
// import estoqueRoutes from './routes/estoqueRoutes.js'
// import vendasRoutes from './routes/vendasRoutes.js'
// import caixaRoutes from './routes/caixaRoutes.js'

// Novas rotas - Sistema de Importação de iPhones (Supabase - FUNCIONANDO!)
import iphonesRoutes from './routes/iphones.routes.js'
import leiloesRoutes from './routes/leiloes.routes.js'
import enviosRoutes from './routes/envios.routes.js'
import cambioRoutes from './routes/cambio.routes.js'

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

// Routes - Originais (Temporariamente desabilitadas)
// app.use('/api/auth', authRoutes)
// app.use('/api/produtos', produtosRoutes)
// app.use('/api/estoque', estoqueRoutes)
// app.use('/api/vendas', vendasRoutes)
// app.use('/api/caixa', caixaRoutes)

// Routes - Sistema de Importação de iPhones (ATIVAS ✅)
app.use('/api/iphones', iphonesRoutes)
app.use('/api/leiloes', leiloesRoutes)
app.use('/api/envios', enviosRoutes)
app.use('/api/cambio', cambioRoutes)

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
