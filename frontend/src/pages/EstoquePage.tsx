import Layout from '@/components/Layout'

export default function EstoquePage() {
  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Estoque</h1>
        <button className="btn-primary">+ Nova Movimentação</button>
      </div>

      <div className="card">
        <p className="text-gray-500">Nenhuma movimentação de estoque</p>
      </div>
    </Layout>
  )
}
