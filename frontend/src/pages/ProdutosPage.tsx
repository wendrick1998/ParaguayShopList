import Layout from '@/components/Layout'

export default function ProdutosPage() {
  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <button className="btn-primary">+ Novo Produto</button>
      </div>

      <div className="card">
        <p className="text-gray-500">Nenhum produto cadastrado</p>
      </div>
    </Layout>
  )
}
