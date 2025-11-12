import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { Button, Input } from '../components/ui'
import { useToastStore } from '../store/toastStore'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { success } = useToastStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      success('Login realizado com sucesso!')
      navigate('/dashboard')
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-600 to-primary-800">
      <div className="w-full max-w-md px-4">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-600 mb-2">SEC+</h1>
            <p className="text-gray-600">Faça login para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={18} className="text-gray-400" />}
              placeholder="seu@email.com"
              required
            />

            <Input
              label="Senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              leftIcon={<Lock size={18} className="text-gray-400" />}
              placeholder="••••••••"
              required
            />

            <Button type="submit" fullWidth loading={loading}>
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Use qualquer email e senha para entrar (demo)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
