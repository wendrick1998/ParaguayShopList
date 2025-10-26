import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./schema";

// ============================================
// FUNIL AUTOMATIZADO - TABLES
// ============================================

// Leads capturados no funil
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  email: varchar("email").unique().notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  phone: varchar("phone"),
  source: varchar("source").notNull(), // facebook, google, instagram, organic, referral
  utmSource: varchar("utm_source"),
  utmMedium: varchar("utm_medium"),
  utmCampaign: varchar("utm_campaign"),
  utmContent: varchar("utm_content"),
  landingPageId: integer("landing_page_id"),
  tags: jsonb("tags").$type<string[]>().default([]),
  status: text("status", { enum: ["new", "nurturing", "qualified", "converted", "churned"] }).default("new").notNull(),
  score: integer("score").default(0).notNull(), // Lead scoring 0-100
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Eventos comportamentais para tagging
export const leadEvents = pgTable("lead_events", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").references(() => leads.id).notNull(),
  eventType: varchar("event_type").notNull(), // page_view, video_watch, cta_click, cart_add, checkout_start, purchase
  eventData: jsonb("event_data"), // Dados contextuais do evento
  scoreImpact: integer("score_impact").default(0).notNull(), // Impacto no lead score
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Carrinho abandonado
export const abandonedCarts = pgTable("abandoned_carts", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").references(() => leads.id).notNull(),
  productId: integer("product_id").notNull(),
  abandonedAt: timestamp("abandoned_at").defaultNow().notNull(),
  recoveryEmailsSent: integer("recovery_emails_sent").default(0).notNull(),
  recovered: boolean("recovered").default(false).notNull(),
  recoveredAt: timestamp("recovered_at"),
});

// ============================================
// PLATAFORMA DE ENTREGA - ÁREA DE MEMBROS
// ============================================

// Produtos/Cursos
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  type: text("type", { enum: ["course", "upsell", "downsell", "bundle"] }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  salesPageUrl: varchar("sales_page_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Compras/Matrículas
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  transactionId: varchar("transaction_id").unique(), // ID externo (Hotmart/Kiwify)
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status", { enum: ["pending", "approved", "refunded", "cancelled"] }).default("pending").notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
});

// Módulos do Curso
export const courseModules = pgTable("course_modules", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  unlockDelay: integer("unlock_delay").default(0).notNull(), // Dias após matrícula
  isActive: boolean("is_active").default(true).notNull(),
});

// Aulas do Curso
export const courseLessons = pgTable("course_lessons", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").references(() => courseModules.id).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  videoUrl: varchar("video_url"),
  duration: integer("duration"), // Segundos
  order: integer("order").notNull(),
  materials: jsonb("materials").$type<{ name: string; url: string; type: string }[]>().default([]),
  isActive: boolean("is_active").default(true).notNull(),
});

// Progresso do Aluno
export const studentProgress = pgTable("student_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  lessonId: integer("lesson_id").references(() => courseLessons.id).notNull(),
  completed: boolean("completed").default(false).notNull(),
  watchedPercentage: integer("watched_percentage").default(0).notNull(),
  completedAt: timestamp("completed_at"),
  lastWatchedAt: timestamp("last_watched_at").defaultNow().notNull(),
});

// Sistema de Gamificação
export const studentAchievements = pgTable("student_achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  achievementType: varchar("achievement_type").notNull(), // first_lesson, module_complete, course_complete, streak_7, streak_30
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
  points: integer("points").default(0).notNull(),
});

export const studentStats = pgTable("student_stats", {
  userId: varchar("user_id").primaryKey().references(() => users.id).notNull(),
  totalPoints: integer("total_points").default(0).notNull(),
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  lessonsCompleted: integer("lessons_completed").default(0).notNull(),
  lastActivityAt: timestamp("last_activity_at"),
});

// ============================================
// INTEGRAÇÕES ESTRATÉGICAS
// ============================================

// Webhooks de Plataformas de Pagamento
export const paymentWebhooks = pgTable("payment_webhooks", {
  id: serial("id").primaryKey(),
  provider: varchar("provider").notNull(), // hotmart, kiwify, stripe
  event: varchar("event").notNull(), // purchase.approved, refund, subscription.cancel
  payload: jsonb("payload").notNull(),
  processed: boolean("processed").default(false).notNull(),
  processedAt: timestamp("processed_at"),
  receivedAt: timestamp("received_at").defaultNow().notNull(),
});

// Eventos de Pixel (Facebook/Google)
export const pixelEvents = pgTable("pixel_events", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").references(() => leads.id),
  eventName: varchar("event_name").notNull(), // PageView, ViewContent, AddToCart, Purchase
  platform: varchar("platform").notNull(), // facebook, google
  eventData: jsonb("event_data"),
  sent: boolean("sent").default(false).notNull(),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Analytics Dashboard
export const analyticsMetrics = pgTable("analytics_metrics", {
  id: serial("id").primaryKey(),
  metricDate: timestamp("metric_date").notNull(),
  metricType: varchar("metric_type").notNull(), // daily_revenue, leads_captured, conversion_rate, avg_ticket
  value: decimal("value", { precision: 12, scale: 2 }).notNull(),
  metadata: jsonb("metadata"),
});

// ============================================
// AUTOMAÇÕES DE SUPORTE
// ============================================

// FAQ para Chatbot
export const faqItems = pgTable("faq_items", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: varchar("category").notNull(), // payment, access, content, technical
  keywords: text("keywords").array(),
  viewCount: integer("view_count").default(0).notNull(),
  helpfulCount: integer("helpful_count").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// Sistema de Tickets
export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  subject: varchar("subject").notNull(),
  category: varchar("category").notNull(),
  priority: text("priority", { enum: ["low", "medium", "high", "critical"] }).default("medium").notNull(),
  status: text("status", { enum: ["open", "in_progress", "waiting_customer", "resolved", "closed"] }).default("open").notNull(),
  assignedTo: varchar("assigned_to").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});

export const ticketMessages = pgTable("ticket_messages", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").references(() => supportTickets.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  isInternal: boolean("is_internal").default(false).notNull(), // Nota interna da equipe
  attachments: jsonb("attachments").$type<{ name: string; url: string }[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Alertas Críticos
export const systemAlerts = pgTable("system_alerts", {
  id: serial("id").primaryKey(),
  alertType: varchar("alert_type").notNull(), // payment_failure, high_refund_rate, server_error, low_conversion
  severity: text("severity", { enum: ["info", "warning", "error", "critical"] }).notNull(),
  message: text("message").notNull(),
  metadata: jsonb("metadata"),
  resolved: boolean("resolved").default(false).notNull(),
  resolvedAt: timestamp("resolved_at"),
  notificationsSent: boolean("notifications_sent").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// SCHEMAS DE VALIDAÇÃO
// ============================================

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  enrolledAt: true,
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// ============================================
// TYPES
// ============================================

export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;

export type Product = typeof products.$inferSelect;
export type Enrollment = typeof enrollments.$inferSelect;

export type CourseModule = typeof courseModules.$inferSelect;
export type CourseLesson = typeof courseLessons.$inferSelect;

export type StudentProgress = typeof studentProgress.$inferSelect;
export type StudentAchievement = typeof studentAchievements.$inferSelect;

export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
