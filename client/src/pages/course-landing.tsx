import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, TrendingUp, Users, Shield, Star, Play, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CourseLandingProps {
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
  };
}

export default function CourseLanding({ utmParams }: CourseLandingProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Pixel tracking
  useEffect(() => {
    // Track PageView
    trackPixelEvent("PageView");

    // Track video views
    const videoElements = document.querySelectorAll("video");
    videoElements.forEach((video) => {
      video.addEventListener("play", () => trackPixelEvent("VideoPlay"));
      video.addEventListener("ended", () => trackPixelEvent("VideoComplete"));
    });
  }, []);

  const trackPixelEvent = async (eventName: string, data?: any) => {
    try {
      await fetch("/api/analytics/pixel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName,
          platform: "facebook",
          eventData: { ...data, utmParams },
        }),
      });
    } catch (error) {
      console.error("Pixel tracking error:", error);
    }
  };

  const handleLeadCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: utmParams?.source || "organic",
          utmSource: utmParams?.source,
          utmMedium: utmParams?.medium,
          utmCampaign: utmParams?.campaign,
          utmContent: utmParams?.content,
        }),
      });

      if (response.ok) {
        trackPixelEvent("Lead", { email });
        toast({
          title: "Inscrição realizada!",
          description: "Você receberá um email com acesso ao material gratuito.",
        });
        setEmail("");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível completar sua inscrição. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCTAClick = (ctaType: string) => {
    trackPixelEvent("CTAClick", { ctaType });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* HERO SECTION */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge className="mb-4 bg-green-500 text-white">
          LANÇAMENTO EXCLUSIVO - Vagas Limitadas
        </Badge>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Domine a Importação do Paraguai
        </h1>

        <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
          Aprenda o sistema completo para <strong>lucrar de R$ 5 mil a R$ 50 mil por mês</strong> importando produtos do Paraguai com margem de até 300%
        </p>

        {/* VIDEO VSL */}
        <div className="max-w-4xl mx-auto mb-8 relative">
          <div className="aspect-video bg-black rounded-lg shadow-2xl flex items-center justify-center">
            <Play className="w-20 h-20 text-white opacity-80 cursor-pointer hover:opacity-100 transition" />
          </div>
        </div>

        {/* CTA PRINCIPAL */}
        <Button
          size="lg"
          className="text-xl px-12 py-6 bg-green-600 hover:bg-green-700 mb-4"
          onClick={() => handleCTAClick("hero-cta")}
        >
          QUERO COMEÇAR AGORA <ArrowRight className="ml-2" />
        </Button>

        <p className="text-sm text-gray-600">
          🔒 Acesso imediato após inscrição | ⏰ Promoção válida por 48 horas
        </p>
      </section>

      {/* SOCIAL PROOF */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">2.400+</div>
            <div className="text-blue-100">Alunos Ativos</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">R$ 12M+</div>
            <div className="text-blue-100">Em Vendas Geradas</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">4.8⭐</div>
            <div className="text-blue-100">Avaliação Média</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">98%</div>
            <div className="text-blue-100">Satisfação</div>
          </div>
        </div>
      </section>

      {/* O QUE VOCÊ VAI APRENDER */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">
          O Que Você Vai Dominar
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <TrendingUp className="w-12 h-12 text-green-600" />,
              title: "Produtos de Alta Margem",
              description: "Descubra os 47 produtos com margem de 200-300% que vendem todos os dias",
            },
            {
              icon: <Users className="w-12 h-12 text-blue-600" />,
              title: "Fornecedores Verificados",
              description: "Acesso direto aos melhores fornecedores do Paraguai com preços de atacado",
            },
            {
              icon: <Shield className="w-12 h-12 text-purple-600" />,
              title: "Importação Legal",
              description: "Passo a passo completo para importar legalmente sem dor de cabeça",
            },
          ].map((benefit, idx) => (
            <Card key={idx} className="border-2 hover:shadow-lg transition">
              <CardHeader>
                <div className="mb-4">{benefit.icon}</div>
                <CardTitle>{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* MÓDULOS DO CURSO */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Conteúdo Completo do Curso
          </h2>

          <div className="max-w-4xl mx-auto space-y-4">
            {[
              "Módulo 1: Mindset do Importador de Sucesso (3 aulas)",
              "Módulo 2: Produtos que Vendem no Brasil (8 aulas)",
              "Módulo 3: Encontrando Fornecedores Confiáveis (5 aulas)",
              "Módulo 4: Cálculo de Margem e Precificação (4 aulas)",
              "Módulo 5: Importação Legal - Passo a Passo (10 aulas)",
              "Módulo 6: Estratégias de Venda - Online e Offline (12 aulas)",
              "Módulo 7: Escala - De 5K para 50K/mês (6 aulas)",
              "BÔNUS: Templates, Planilhas e Ferramentas",
            ].map((module, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                <span className="font-medium">{module}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">
          Resultados Reais de Alunos
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "Carlos Mendes",
              result: "R$ 18.400 no primeiro mês",
              text: "Nunca imaginei que seria tão simples. Segui o método e já estou faturando mais que no meu emprego.",
            },
            {
              name: "Ana Paula Silva",
              result: "R$ 43.200 em 90 dias",
              text: "O curso me deu segurança para começar. Hoje tenho uma operação consistente e escalável.",
            },
            {
              name: "Roberto Oliveira",
              result: "R$ 7.800 na primeira viagem",
              text: "Recuperei o investimento do curso na primeira compra. Agora é só replicar o sistema.",
            },
          ].map((testimonial, idx) => (
            <Card key={idx}>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                <p className="text-green-600 font-bold">{testimonial.result}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* OFERTA FINAL */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Oferta Exclusiva de Lançamento
          </h2>

          <div className="max-w-2xl mx-auto bg-white text-gray-900 rounded-lg p-8 mb-8">
            <p className="text-gray-600 line-through text-2xl mb-2">De R$ 3.997</p>
            <p className="text-5xl font-bold text-green-600 mb-4">
              R$ 1.997
            </p>
            <p className="text-gray-600 mb-6">
              ou 12x de R$ 196,70 sem juros
            </p>

            <Button
              size="lg"
              className="w-full text-xl py-6 bg-green-600 hover:bg-green-700"
              onClick={() => handleCTAClick("final-cta")}
            >
              GARANTIR MINHA VAGA AGORA
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-6 h-6" />
              <span>Garantia de 7 dias</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-6 h-6" />
              <span>Acesso vitalício</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-6 h-6" />
              <span>Certificado de conclusão</span>
            </div>
          </div>
        </div>
      </section>

      {/* LEAD MAGNET */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto border-2 border-blue-600">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-2">
              🎁 Baixe Grátis: Lista dos 47 Produtos Mais Lucrativos
            </CardTitle>
            <p className="text-gray-600">
              Descubra os produtos com maior margem de lucro para começar hoje mesmo
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLeadCapture} className="space-y-4">
              <Input
                type="email"
                placeholder="Seu melhor email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-lg p-6"
              />
              <Button
                type="submit"
                className="w-full text-lg py-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "QUERO RECEBER GRÁTIS"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
