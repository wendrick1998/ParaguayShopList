import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Flame,
  Play,
  CheckCircle,
  Lock,
  Download,
  MessageCircle,
  Star,
  TrendingUp,
  Calendar,
  Award,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface Module {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
  unlocked: boolean;
  unlockDate?: Date;
}

interface Lesson {
  id: number;
  title: string;
  duration: number;
  completed: boolean;
  videoUrl?: string;
  materials?: { name: string; url: string }[];
}

interface StudentStats {
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  lessonsCompleted: number;
  completionPercentage: number;
}

export default function MembersArea() {
  const { user } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      // Carregar módulos e progresso
      const modulesRes = await fetch("/api/course/modules");
      const modulesData = await modulesRes.json();
      setModules(modulesData);

      // Carregar estatísticas
      const statsRes = await fetch("/api/course/stats");
      const statsData = await statsRes.json();
      setStats(statsData);

      // Carregar conquistas
      const achievementsRes = await fetch("/api/course/achievements");
      const achievementsData = await achievementsRes.json();
      setAchievements(achievementsData);
    } catch (error) {
      console.error("Error loading student data:", error);
    }
  };

  const handleWatchLesson = async (lesson: Lesson) => {
    setCurrentLesson(lesson);

    // Track lesson start
    await fetch("/api/course/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId: lesson.id,
        action: "start",
      }),
    });
  };

  const handleCompleteLesson = async (lessonId: number) => {
    try {
      await fetch("/api/course/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      });

      // Reload data to update progress and check for achievements
      await loadStudentData();
    } catch (error) {
      console.error("Error completing lesson:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Olá, {user?.firstName || "Aluno"}! 👋
              </h1>
              <p className="text-blue-100">
                Continue sua jornada rumo aos primeiros R$ 50K/mês
              </p>
            </div>

            {/* GAMIFICAÇÃO - STATS */}
            <div className="hidden md:flex gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-6 h-6 text-orange-400" />
                  <span className="text-2xl font-bold">
                    {stats?.currentStreak || 0}
                  </span>
                </div>
                <p className="text-sm text-blue-100">Dias seguidos</p>
              </div>

              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <span className="text-2xl font-bold">
                    {stats?.totalPoints || 0}
                  </span>
                </div>
                <p className="text-sm text-blue-100">Pontos</p>
              </div>

              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <span className="text-2xl font-bold">
                    {achievements.length}
                  </span>
                </div>
                <p className="text-sm text-blue-100">Conquistas</p>
              </div>
            </div>
          </div>

          {/* PROGRESSO GERAL */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Progresso do Curso</span>
              <span className="text-sm font-bold">
                {stats?.completionPercentage || 0}% concluído
              </span>
            </div>
            <Progress value={stats?.completionPercentage || 0} className="h-3" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="lessons" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="lessons">Aulas</TabsTrigger>
            <TabsTrigger value="achievements">Conquistas</TabsTrigger>
            <TabsTrigger value="community">Comunidade</TabsTrigger>
            <TabsTrigger value="support">Suporte</TabsTrigger>
          </TabsList>

          {/* AULAS */}
          <TabsContent value="lessons">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* PLAYER DE VÍDEO */}
              <div className="lg:col-span-2">
                {currentLesson ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>{currentLesson.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video bg-black rounded-lg mb-4 flex items-center justify-center">
                        <Play className="w-16 h-16 text-white opacity-50" />
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline">
                          {Math.floor(currentLesson.duration / 60)} minutos
                        </Badge>

                        <Button
                          onClick={() => handleCompleteLesson(currentLesson.id)}
                          disabled={currentLesson.completed}
                        >
                          {currentLesson.completed ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Concluída
                            </>
                          ) : (
                            "Marcar como Concluída"
                          )}
                        </Button>
                      </div>

                      {/* MATERIAIS */}
                      {currentLesson.materials && currentLesson.materials.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-3">Materiais da Aula</h3>
                          <div className="space-y-2">
                            {currentLesson.materials.map((material, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                className="w-full justify-start"
                                asChild
                              >
                                <a href={material.url} target="_blank" rel="noopener noreferrer">
                                  <Download className="w-4 h-4 mr-2" />
                                  {material.name}
                                </a>
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="h-full flex items-center justify-center">
                    <CardContent className="text-center py-16">
                      <Play className="w-20 h-20 mx-auto text-gray-400 mb-4" />
                      <p className="text-xl text-gray-600">
                        Selecione uma aula para começar
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* LISTA DE MÓDULOS */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Módulos do Curso</h2>

                {modules.map((module) => (
                  <Card key={module.id}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        {module.title}
                        {!module.unlocked && (
                          <Lock className="w-5 h-5 text-gray-400" />
                        )}
                      </CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {module.unlocked ? (
                        <div className="space-y-2">
                          {module.lessons.map((lesson) => (
                            <button
                              key={lesson.id}
                              onClick={() => handleWatchLesson(lesson)}
                              className="w-full text-left p-3 rounded-lg hover:bg-slate-100 transition flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                {lesson.completed ? (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                  <Play className="w-5 h-5 text-blue-600" />
                                )}
                                <span className="font-medium">{lesson.title}</span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {Math.floor(lesson.duration / 60)}min
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          <Lock className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">
                            Desbloqueia em: {module.unlockDate?.toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* CONQUISTAS */}
          <TabsContent value="achievements">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Award className="w-12 h-12 text-yellow-500" />,
                  title: "Primeira Aula",
                  description: "Assistiu sua primeira aula",
                  points: 10,
                  earned: true,
                },
                {
                  icon: <Flame className="w-12 h-12 text-orange-500" />,
                  title: "Sequência de 7 dias",
                  description: "7 dias consecutivos estudando",
                  points: 50,
                  earned: stats?.currentStreak ? stats.currentStreak >= 7 : false,
                },
                {
                  icon: <Trophy className="w-12 h-12 text-purple-500" />,
                  title: "Módulo Completo",
                  description: "Completou um módulo inteiro",
                  points: 100,
                  earned: false,
                },
                {
                  icon: <TrendingUp className="w-12 h-12 text-green-500" />,
                  title: "50% do Curso",
                  description: "Completou metade do curso",
                  points: 250,
                  earned: (stats?.completionPercentage || 0) >= 50,
                },
                {
                  icon: <Star className="w-12 h-12 text-blue-500" />,
                  title: "Curso Completo",
                  description: "Finalizou todas as aulas",
                  points: 500,
                  earned: (stats?.completionPercentage || 0) === 100,
                },
                {
                  icon: <Calendar className="w-12 h-12 text-red-500" />,
                  title: "Sequência de 30 dias",
                  description: "30 dias consecutivos estudando",
                  points: 200,
                  earned: stats?.longestStreak ? stats.longestStreak >= 30 : false,
                },
              ].map((achievement, idx) => (
                <Card
                  key={idx}
                  className={achievement.earned ? "border-2 border-green-500" : "opacity-50"}
                >
                  <CardHeader className="text-center">
                    <div className="mb-4 flex justify-center">{achievement.icon}</div>
                    <CardTitle className="text-xl">{achievement.title}</CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Badge variant={achievement.earned ? "default" : "outline"}>
                      {achievement.points} pontos
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* COMUNIDADE */}
          <TabsContent value="community">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  Comunidade Exclusiva
                </CardTitle>
                <CardDescription>
                  Conecte-se com outros importadores e compartilhe experiências
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full" size="lg">
                    Acessar Grupo do WhatsApp
                  </Button>
                  <Button className="w-full" size="lg" variant="outline">
                    Acessar Comunidade no Discord
                  </Button>
                  <Button className="w-full" size="lg" variant="outline">
                    Acessar Fórum de Dúvidas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SUPORTE */}
          <TabsContent value="support">
            <Card>
              <CardHeader>
                <CardTitle>Central de Suporte</CardTitle>
                <CardDescription>
                  Precisa de ajuda? Estamos aqui para você!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full justify-start" variant="outline">
                    📚 Acessar Base de Conhecimento
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    💬 Abrir Chamado de Suporte
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    ❓ Perguntas Frequentes
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    📧 Contato Direto
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
