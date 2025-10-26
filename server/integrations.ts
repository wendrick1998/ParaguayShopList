import type { Express, Request, Response } from "express";
import crypto from "crypto";

// ============================================
// WEBHOOKS DE PAGAMENTO - HOTMART
// ============================================

interface HotmartWebhookPayload {
  event: string; // PURCHASE_COMPLETE, PURCHASE_REFUNDED, etc
  data: {
    buyer: {
      email: string;
      name: string;
    };
    product: {
      id: number;
      name: string;
    };
    purchase: {
      transaction: string;
      status: string;
      approved_date: number;
      price: {
        value: number;
        currency_code: string;
      };
    };
  };
}

export function setupHotmartWebhook(app: Express) {
  app.post("/api/webhooks/hotmart", async (req: Request, res: Response) => {
    try {
      const payload: HotmartWebhookPayload = req.body;

      // Validar assinatura do webhook
      const signature = req.headers["x-hotmart-hottok"] as string;
      if (!validateHotmartSignature(req.body, signature)) {
        return res.status(401).json({ error: "Invalid signature" });
      }

      // Log webhook recebido
      await logWebhook("hotmart", payload.event, payload);

      // Processar evento
      switch (payload.event) {
        case "PURCHASE_COMPLETE":
          await handlePurchaseComplete(payload);
          break;

        case "PURCHASE_REFUNDED":
          await handlePurchaseRefund(payload);
          break;

        case "PURCHASE_CANCELLED":
          await handlePurchaseCancel(payload);
          break;

        default:
          console.log("Unhandled Hotmart event:", payload.event);
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Hotmart webhook error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}

function validateHotmartSignature(payload: any, signature: string): boolean {
  const secret = process.env.HOTMART_SECRET || "";
  const hash = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(payload))
    .digest("hex");
  return hash === signature;
}

async function handlePurchaseComplete(payload: HotmartWebhookPayload) {
  // 1. Criar matrícula do aluno
  const enrollment = {
    email: payload.data.buyer.email,
    name: payload.data.buyer.name,
    productId: payload.data.product.id,
    transactionId: payload.data.purchase.transaction,
    amount: payload.data.purchase.price.value,
    status: "approved",
  };

  // TODO: Salvar no banco de dados
  console.log("Creating enrollment:", enrollment);

  // 2. Enviar email de boas-vindas
  await sendWelcomeEmail(payload.data.buyer.email, payload.data.buyer.name);

  // 3. Adicionar ao grupo do WhatsApp/Comunidade
  await addToCommunity(payload.data.buyer.email);

  // 4. Disparar pixel de conversão
  await trackConversion({
    email: payload.data.buyer.email,
    value: payload.data.purchase.price.value,
    transactionId: payload.data.purchase.transaction,
  });

  // 5. Agendar sequência de onboarding
  await scheduleOnboardingSequence(payload.data.buyer.email);
}

async function handlePurchaseRefund(payload: HotmartWebhookPayload) {
  console.log("Processing refund:", payload.data.purchase.transaction);

  // 1. Atualizar status da matrícula
  // 2. Remover acesso à área de membros
  // 3. Disparar alerta para equipe
  await createSystemAlert({
    type: "refund",
    severity: "warning",
    message: `Reembolso solicitado - ${payload.data.buyer.email}`,
    metadata: payload,
  });
}

async function handlePurchaseCancel(payload: HotmartWebhookPayload) {
  console.log("Processing cancellation:", payload.data.purchase.transaction);
  // Similar ao refund
}

// ============================================
// WEBHOOKS DE PAGAMENTO - KIWIFY
// ============================================

interface KiwifyWebhookPayload {
  order_id: string;
  order_status: string;
  Customer: {
    email: string;
    full_name: string;
  };
  Product: {
    product_id: string;
    product_name: string;
  };
  order_amount: number;
}

export function setupKiwifyWebhook(app: Express) {
  app.post("/api/webhooks/kiwify", async (req: Request, res: Response) => {
    try {
      const payload: KiwifyWebhookPayload = req.body;

      // Log webhook
      await logWebhook("kiwify", payload.order_status, payload);

      if (payload.order_status === "paid") {
        // Processar compra aprovada
        await handleKiwifyPurchase(payload);
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Kiwify webhook error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}

async function handleKiwifyPurchase(payload: KiwifyWebhookPayload) {
  // Similar ao Hotmart
  console.log("Processing Kiwify purchase:", payload.order_id);

  const enrollment = {
    email: payload.Customer.email,
    name: payload.Customer.full_name,
    productId: payload.Product.product_id,
    transactionId: payload.order_id,
    amount: payload.order_amount,
    status: "approved",
  };

  // TODO: Implementar lógica similar ao Hotmart
  await sendWelcomeEmail(payload.Customer.email, payload.Customer.full_name);
  await trackConversion({
    email: payload.Customer.email,
    value: payload.order_amount,
    transactionId: payload.order_id,
  });
}

// ============================================
// PIXELS DE RASTREAMENTO
// ============================================

export function setupPixelTracking(app: Express) {
  app.post("/api/analytics/pixel", async (req: Request, res: Response) => {
    try {
      const { eventName, platform, eventData } = req.body;

      // Salvar evento para processamento
      await savePixelEvent({
        eventName,
        platform,
        eventData,
        timestamp: new Date(),
      });

      // Enviar para plataformas de ads
      if (platform === "facebook") {
        await sendToFacebookPixel(eventName, eventData);
      } else if (platform === "google") {
        await sendToGoogleAnalytics(eventName, eventData);
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Pixel tracking error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}

async function sendToFacebookPixel(eventName: string, data: any) {
  const pixelId = process.env.FACEBOOK_PIXEL_ID;
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.warn("Facebook Pixel not configured");
    return;
  }

  const url = `https://graph.facebook.com/v18.0/${pixelId}/events`;

  const eventData = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        user_data: {
          em: data.email ? hashEmail(data.email) : undefined,
        },
        custom_data: data.customData,
      },
    ],
    access_token: accessToken,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      console.error("Facebook Pixel error:", await response.text());
    }
  } catch (error) {
    console.error("Failed to send to Facebook Pixel:", error);
  }
}

async function sendToGoogleAnalytics(eventName: string, data: any) {
  const measurementId = process.env.GOOGLE_ANALYTICS_ID;
  const apiSecret = process.env.GOOGLE_ANALYTICS_SECRET;

  if (!measurementId || !apiSecret) {
    console.warn("Google Analytics not configured");
    return;
  }

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`;

  const eventData = {
    client_id: data.clientId || generateClientId(),
    events: [
      {
        name: eventName.toLowerCase().replace(/ /g, "_"),
        params: data.params || {},
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      console.error("Google Analytics error:", await response.text());
    }
  } catch (error) {
    console.error("Failed to send to Google Analytics:", error);
  }
}

// ============================================
// DASHBOARD DE ANALYTICS EM TEMPO REAL
// ============================================

export function setupAnalyticsDashboard(app: Express) {
  app.get("/api/analytics/dashboard", async (req: Request, res: Response) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Métricas do dia
      const metrics = {
        today: {
          revenue: await getTodayRevenue(),
          leads: await getTodayLeads(),
          conversions: await getTodayConversions(),
          avgTicket: await getAvgTicket(),
        },
        week: {
          revenue: await getWeekRevenue(),
          leads: await getWeekLeads(),
          conversions: await getWeekConversions(),
        },
        month: {
          revenue: await getMonthRevenue(),
          leads: await getMonthLeads(),
          conversions: await getMonthConversions(),
        },
        realtime: {
          activeUsers: await getActiveUsers(),
          ongoingCheckouts: await getOngoingCheckouts(),
        },
      };

      res.json(metrics);
    } catch (error) {
      console.error("Analytics dashboard error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}

// ============================================
// UPSELLS AUTOMÁTICOS
// ============================================

export function setupUpsells(app: Express) {
  app.post("/api/upsells/trigger", async (req: Request, res: Response) => {
    try {
      const { userId, productId, transactionId } = req.body;

      // Determinar qual upsell oferecer baseado em regras
      const upsellOffer = await determineUpsellOffer(userId, productId);

      if (upsellOffer) {
        // Enviar email com oferta
        await sendUpsellEmail(userId, upsellOffer);

        // Exibir popup na área de membros
        res.json({
          showUpsell: true,
          offer: upsellOffer,
        });
      } else {
        res.json({ showUpsell: false });
      }
    } catch (error) {
      console.error("Upsell trigger error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}

async function determineUpsellOffer(userId: string, productId: string) {
  // Lógica de upsell inteligente
  // Exemplo: Se comprou curso básico, oferecer mentoria
  const offers = {
    "curso-basico": {
      product: "mentoria-premium",
      title: "Mentoria Premium - Suporte Direto",
      price: 997,
      discount: 50, // 50% off
      expiresIn: 3600, // 1 hora
    },
  };

  return offers[productId as keyof typeof offers] || null;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

async function logWebhook(provider: string, event: string, payload: any) {
  console.log(`[${provider}] ${event}:`, JSON.stringify(payload, null, 2));
  // TODO: Salvar no banco
}

async function sendWelcomeEmail(email: string, name: string) {
  console.log(`Sending welcome email to ${email}`);
  // TODO: Integrar com serviço de email (SendGrid, etc)
}

async function addToCommunity(email: string) {
  console.log(`Adding ${email} to community`);
  // TODO: Integrar com WhatsApp/Discord
}

async function trackConversion(data: { email: string; value: number; transactionId: string }) {
  console.log("Tracking conversion:", data);
  // Enviar para Facebook, Google, etc
  await sendToFacebookPixel("Purchase", {
    email: data.email,
    customData: {
      value: data.value,
      currency: "BRL",
    }
  });
}

async function scheduleOnboardingSequence(email: string) {
  console.log(`Scheduling onboarding for ${email}`);
  // TODO: Agendar sequência de emails automática
}

async function createSystemAlert(alert: any) {
  console.log("Creating system alert:", alert);
  // TODO: Salvar no banco e enviar notificação
}

async function savePixelEvent(event: any) {
  console.log("Saving pixel event:", event);
  // TODO: Salvar no banco
}

function hashEmail(email: string): string {
  return crypto.createHash("sha256").update(email.toLowerCase()).digest("hex");
}

function generateClientId(): string {
  return crypto.randomBytes(16).toString("hex");
}

// Placeholder functions para métricas
async function getTodayRevenue() { return 0; }
async function getTodayLeads() { return 0; }
async function getTodayConversions() { return 0; }
async function getAvgTicket() { return 0; }
async function getWeekRevenue() { return 0; }
async function getWeekLeads() { return 0; }
async function getWeekConversions() { return 0; }
async function getMonthRevenue() { return 0; }
async function getMonthLeads() { return 0; }
async function getMonthConversions() { return 0; }
async function getActiveUsers() { return 0; }
async function getOngoingCheckouts() { return 0; }
async function sendUpsellEmail(userId: string, offer: any) { }

export function registerIntegrations(app: Express) {
  setupHotmartWebhook(app);
  setupKiwifyWebhook(app);
  setupPixelTracking(app);
  setupAnalyticsDashboard(app);
  setupUpsells(app);
}
