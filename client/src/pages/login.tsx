import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBag } from 'lucide-react';

export default function Login() {
  const [, setLocation] = useLocation();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const { login, register, isLoggingIn, isRegistering: isRegisteringUser } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isRegistering) {
        await register(formData);
        toast({
          title: "Conta criada com sucesso!",
          description: "Bem-vindo ao Lista Paraguay",
        });
      } else {
        await login({ email: formData.email, password: formData.password });
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta",
        });
      }
      setLocation('/dashboard');
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const isLoading = isLoggingIn || isRegisteringUser;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-primary text-white pt-12 pb-8 px-6 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Lista Paraguay</h1>
            <p className="text-blue-100">Gerencie suas compras internacionais</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="flex-1 px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegistering && (
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Seu nome completo"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  {isRegistering ? 'Criando conta...' : 'Entrando...'}
                </div>
              ) : (
                isRegistering ? 'Cadastrar' : 'Entrar'
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              {isRegistering ? 'Já tem conta?' : 'Não tem conta?'}
            </p>
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-primary font-semibold"
            >
              {isRegistering ? 'Fazer login' : 'Cadastrar-se'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
