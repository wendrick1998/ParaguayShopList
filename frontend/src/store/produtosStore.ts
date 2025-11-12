import { create } from 'zustand'
import { api } from '@/utils/api'

interface Produto {
  id: number
  nome: string
  descricao: string
  preco: number
  codigoBarras?: string
  lojaId: number
  createdAt: string
  updatedAt: string
}

interface ProdutosState {
  produtos: Produto[]
  loading: boolean
  fetchProdutos: () => Promise<void>
  addProduto: (produto: Omit<Produto, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateProduto: (id: number, produto: Partial<Produto>) => Promise<void>
  deleteProduto: (id: number) => Promise<void>
}

export const useProdutosStore = create<ProdutosState>((set) => ({
  produtos: [],
  loading: false,

  fetchProdutos: async () => {
    set({ loading: true })
    try {
      const response = await api.get('/produtos')
      set({ produtos: response.data, loading: false })
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
      set({ loading: false })
    }
  },

  addProduto: async (produto) => {
    try {
      const response = await api.post('/produtos', produto)
      set((state) => ({ produtos: [...state.produtos, response.data] }))
    } catch (error) {
      console.error('Erro ao adicionar produto:', error)
      throw error
    }
  },

  updateProduto: async (id, produto) => {
    try {
      const response = await api.put(`/produtos/${id}`, produto)
      set((state) => ({
        produtos: state.produtos.map((p) => (p.id === id ? response.data : p)),
      }))
    } catch (error) {
      console.error('Erro ao atualizar produto:', error)
      throw error
    }
  },

  deleteProduto: async (id) => {
    try {
      await api.delete(`/produtos/${id}`)
      set((state) => ({
        produtos: state.produtos.filter((p) => p.id !== id),
      }))
    } catch (error) {
      console.error('Erro ao deletar produto:', error)
      throw error
    }
  },
}))
