import type { Express, Request, Response } from "express";

// ============================================
// CHATBOT INTELIGENTE - FAQ MATCHING
// ============================================

interface FAQMatch {
  faqId: number;
  question: string;
  answer: string;
  confidence: number;
  relatedQuestions: string[];
}

export function setupChatbot(app: Express) {
  app.post("/api/support/chatbot", async (req: Request, res: Response) => {
    try {
      const { message } = req.body;

      // Buscar melhor match na base de FAQ
      const match = await findBestFAQMatch(message);

      if (match && match.confidence > 0.7) {
        // Registrar visualização
        await incrementFAQView(match.faqId);

        res.json({
          answer: match.answer,
          relatedQuestions: match.relatedQuestions,
          confidence: match.confidence,
        });
      } else {
        // Não encontrou resposta com confiança suficiente
        res.json({
          answer: "Não encontrei uma resposta específica. Posso transferir você para um atendente humano?",
          suggestions: ["Abrir chamado", "Ver perguntas frequentes"],
          confidence: 0,
        });
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}

async function findBestFAQMatch(userMessage: string): Promise<FAQMatch | null> {
  // Normalizar mensagem
  const normalizedMessage = userMessage.toLowerCase().trim();

  // FAQ Database (idealmente virá do banco de dados)
  const faqDatabase = [
    {
      id: 1,
      question: "Como acessar o curso?",
      answer:
        "Para acessar o curso, faça login com o email usado na compra. Você receberá acesso imediato após a confirmação do pagamento. Verifique também sua caixa de spam.",
      keywords: ["acesso", "acessar", "login", "entrar", "curso"],
      category: "access",
      relatedQuestions: ["Esqueci minha senha", "Não recebi email de acesso"],
    },
    {
      id: 2,
      question: "Problemas com pagamento",
      answer:
        "Se você teve problemas com o pagamento: 1) Verifique se o cartão tem limite disponível, 2) Confirme os dados inseridos, 3) Tente outro método de pagamento. Para mais ajuda, abra um chamado.",
      keywords: ["pagamento", "cartão", "boleto", "pix", "cobrança", "pagar"],
      category: "payment",
      relatedQuestions: ["Quais formas de pagamento aceitas?", "Como parcelar?"],
    },
    {
      id: 3,
      question: "Como baixar materiais?",
      answer:
        "Os materiais estão disponíveis em cada aula. Clique no botão 'Download' ao lado de cada material. Os arquivos ficam salvos permanentemente na sua conta.",
      keywords: ["baixar", "download", "material", "pdf", "planilha"],
      category: "content",
      relatedQuestions: ["Materiais não aparecem", "Como imprimir materiais"],
    },
    {
      id: 4,
      question: "Quanto tempo tenho de acesso?",
      answer:
        "Seu acesso ao curso é VITALÍCIO! Você pode assistir as aulas quantas vezes quiser, no seu ritmo, sem prazo de expiração.",
      keywords: ["tempo", "acesso", "vitalício", "prazo", "validade"],
      category: "access",
      relatedQuestions: ["Posso assistir no celular?", "Posso baixar as aulas?"],
    },
    {
      id: 5,
      question: "Como funciona a garantia?",
      answer:
        "Oferecemos garantia incondicional de 7 dias. Se não ficar satisfeito por qualquer motivo, basta solicitar o reembolso total dentro desse prazo.",
      keywords: ["garantia", "reembolso", "devolver", "dinheiro de volta"],
      category: "payment",
      relatedQuestions: ["Como solicitar reembolso?", "Prazo de reembolso"],
    },
  ];

  // Calcular score de similaridade
  let bestMatch: FAQMatch | null = null;
  let highestScore = 0;

  for (const faq of faqDatabase) {
    const score = calculateSimilarity(normalizedMessage, faq.keywords);

    if (score > highestScore) {
      highestScore = score;
      bestMatch = {
        faqId: faq.id,
        question: faq.question,
        answer: faq.answer,
        confidence: score,
        relatedQuestions: faq.relatedQuestions,
      };
    }
  }

  return bestMatch;
}

function calculateSimilarity(message: string, keywords: string[]): number {
  let matches = 0;

  for (const keyword of keywords) {
    if (message.includes(keyword)) {
      matches++;
    }
  }

  return keywords.length > 0 ? matches / keywords.length : 0;
}

async function incrementFAQView(faqId: number) {
  // TODO: Incrementar contador no banco de dados
  console.log(`FAQ ${faqId} viewed`);
}

// ============================================
// SISTEMA DE TICKETS
// ============================================

export function setupTicketSystem(app: Express) {
  // Criar novo ticket
  app.post("/api/support/tickets", async (req: Request, res: Response) => {
    try {
      const { subject, category, message, priority } = req.body;
      const userId = (req as any).session?.userId;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Determinar prioridade automaticamente se não fornecida
      const autoPriority = priority || determinePriority(category, message);

      const ticket = {
        userId,
        subject,
        category,
        priority: autoPriority,
        status: "open",
        createdAt: new Date(),
      };

      // TODO: Salvar no banco
      console.log("Creating ticket:", ticket);

      // Se prioridade alta/crítica, enviar alerta imediato
      if (autoPriority === "high" || autoPriority === "critical") {
        await sendUrgentAlert(ticket);
      }

      // Enviar email de confirmação
      await sendTicketConfirmationEmail(userId, ticket);

      res.json({ success: true, ticket });
    } catch (error) {
      console.error("Ticket creation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Listar tickets do usuário
  app.get("/api/support/tickets", async (req: Request, res: Response) => {
    try {
      const userId = (req as any).session?.userId;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // TODO: Buscar do banco
      const tickets: any[] = [];

      res.json(tickets);
    } catch (error) {
      console.error("Tickets fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Adicionar mensagem ao ticket
  app.post("/api/support/tickets/:id/messages", async (req: Request, res: Response) => {
    try {
      const ticketId = parseInt(req.params.id);
      const userId = (req as any).session?.userId;
      const { message, attachments } = req.body;

      // TODO: Validar propriedade do ticket
      // TODO: Salvar mensagem no banco

      // Notificar equipe de suporte
      await notifySupportTeam(ticketId, message);

      res.json({ success: true });
    } catch (error) {
      console.error("Ticket message error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}

function determinePriority(category: string, message: string): string {
  const urgentKeywords = ["urgente", "emergência", "não consigo acessar", "pagamento não funcionou"];
  const messageText = message.toLowerCase();

  // Prioridade crítica para problemas de pagamento/acesso
  if (category === "payment" || category === "access") {
    return "high";
  }

  // Verificar palavras-chave urgentes
  for (const keyword of urgentKeywords) {
    if (messageText.includes(keyword)) {
      return "high";
    }
  }

  return "medium";
}

// ============================================
// SISTEMA DE ALERTAS CRÍTICOS
// ============================================

export function setupAlertSystem(app: Express) {
  // Monitorar métricas e criar alertas
  app.post("/api/alerts/check", async (req: Request, res: Response) => {
    try {
      await checkCriticalMetrics();
      res.json({ success: true });
    } catch (error) {
      console.error("Alert check error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Listar alertas ativos
  app.get("/api/alerts", async (req: Request, res: Response) => {
    try {
      // TODO: Buscar alertas do banco
      const alerts: any[] = [];
      res.json(alerts);
    } catch (error) {
      console.error("Alerts fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Resolver alerta
  app.post("/api/alerts/:id/resolve", async (req: Request, res: Response) => {
    try {
      const alertId = parseInt(req.params.id);
      // TODO: Marcar como resolvido no banco
      res.json({ success: true });
    } catch (error) {
      console.error("Alert resolve error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}

async function checkCriticalMetrics() {
  // 1. Taxa de reembolso alta
  const refundRate = await getRefundRate();
  if (refundRate > 5) {
    // Acima de 5%
    await createAlert({
      type: "high_refund_rate",
      severity: "critical",
      message: `Taxa de reembolso em ${refundRate.toFixed(2)}% - acima do limite de 5%`,
      metadata: { refundRate },
    });
  }

  // 2. Taxa de conversão baixa
  const conversionRate = await getConversionRate();
  if (conversionRate < 2) {
    // Abaixo de 2%
    await createAlert({
      type: "low_conversion_rate",
      severity: "warning",
      message: `Taxa de conversão em ${conversionRate.toFixed(2)}% - abaixo do esperado`,
      metadata: { conversionRate },
    });
  }

  // 3. Problemas de pagamento frequentes
  const paymentFailures = await getRecentPaymentFailures();
  if (paymentFailures > 10) {
    await createAlert({
      type: "payment_failures",
      severity: "error",
      message: `${paymentFailures} falhas de pagamento nas últimas 24h`,
      metadata: { failures: paymentFailures },
    });
  }

  // 4. Tickets de suporte não respondidos
  const unresolvedTickets = await getUnresolvedTicketsCount();
  if (unresolvedTickets > 20) {
    await createAlert({
      type: "support_backlog",
      severity: "warning",
      message: `${unresolvedTickets} tickets aguardando resposta`,
      metadata: { count: unresolvedTickets },
    });
  }
}

async function createAlert(alert: any) {
  console.log("Creating alert:", alert);
  // TODO: Salvar no banco

  // Enviar notificações
  await sendAlertNotifications(alert);
}

async function sendAlertNotifications(alert: any) {
  // Email para equipe
  console.log("Sending alert notifications:", alert);

  // Slack/Discord webhook
  if (process.env.SLACK_WEBHOOK_URL) {
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `🚨 *${alert.severity.toUpperCase()}*: ${alert.message}`,
      }),
    });
  }
}

// Helper functions
async function sendUrgentAlert(ticket: any) {
  console.log("Sending urgent alert for ticket:", ticket);
}

async function sendTicketConfirmationEmail(userId: string, ticket: any) {
  console.log("Sending ticket confirmation to user:", userId);
}

async function notifySupportTeam(ticketId: number, message: string) {
  console.log("Notifying support team about ticket:", ticketId);
}

async function getRefundRate() {
  return 0;
}
async function getConversionRate() {
  return 0;
}
async function getRecentPaymentFailures() {
  return 0;
}
async function getUnresolvedTicketsCount() {
  return 0;
}

export function registerSupportAutomation(app: Express) {
  setupChatbot(app);
  setupTicketSystem(app);
  setupAlertSystem(app);
}
