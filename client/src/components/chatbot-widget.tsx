import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  suggestions?: string[];
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá! 👋 Sou o assistente virtual do curso. Como posso ajudar?",
      sender: "bot",
      timestamp: new Date(),
      suggestions: [
        "Como acessar o curso?",
        "Problemas com pagamento",
        "Como baixar materiais?",
        "Falar com suporte",
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (text: string = inputValue) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Buscar resposta do bot
    const botResponse = await getBotResponse(text);

    setTimeout(() => {
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = async (userMessage: string): Promise<Message> => {
    try {
      // Buscar FAQ matching
      const response = await fetch("/api/support/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (data.answer) {
        return {
          id: Date.now().toString(),
          text: data.answer,
          sender: "bot",
          timestamp: new Date(),
          suggestions: data.relatedQuestions,
        };
      }
    } catch (error) {
      console.error("Chatbot error:", error);
    }

    // Resposta padrão se não encontrar match
    return {
      id: Date.now().toString(),
      text: "Desculpe, não encontrei uma resposta específica. Você gostaria de abrir um chamado com nossa equipe de suporte?",
      sender: "bot",
      timestamp: new Date(),
      suggestions: ["Abrir chamado", "Ver perguntas frequentes"],
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === "Abrir chamado") {
      // Abrir modal de ticket
      window.location.href = "/support/tickets/new";
    } else if (suggestion === "Ver perguntas frequentes") {
      window.location.href = "/support/faq";
    } else {
      handleSendMessage(suggestion);
    }
  };

  return (
    <>
      {/* Botão flutuante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition z-50"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            1
          </span>
        </button>
      )}

      {/* Widget do Chat */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6" />
                <div>
                  <CardTitle className="text-lg">Assistente Virtual</CardTitle>
                  <p className="text-xs text-blue-100">Online - Resposta imediata</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-900"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === "bot" && <Bot className="w-4 h-4 mt-1" />}
                    <div className="flex-1">
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {message.sender === "user" && <User className="w-4 h-4 mt-1" />}
                  </div>

                  {/* Sugestões */}
                  {message.suggestions && (
                    <div className="mt-3 space-y-2">
                      {message.suggestions.map((suggestion, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          className="w-full text-left justify-start bg-white hover:bg-slate-50 text-slate-900"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-lg p-3 flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  <div className="flex gap-1">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce delay-100">●</span>
                    <span className="animate-bounce delay-200">●</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite sua dúvida..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  );
}
