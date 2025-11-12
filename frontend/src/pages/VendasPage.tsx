import Layout from '@/components/Layout'

export default function VendasPage() {
  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vendas</h1>
        <button className="btn-primary">+ Nova Venda</button>
      </div>

      <div className="card">
        <p className="text-gray-500">Nenhuma venda registrada</p>
      </div>
    </Layout>
  )
}
