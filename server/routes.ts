import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertShoppingListSchema, insertListItemSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import session from "express-session";

// Extend session data interface
declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || "paraguay-shopping-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  const requireAdmin = async (req: any, res: any, next: any) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const user = await storage.getUser(req.session.userId!);
    if (!user?.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  };

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      req.session.userId = user.id;
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid registration data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Shopping lists routes
  app.get("/api/shopping-lists", requireAuth, async (req, res) => {
    try {
      const lists = await storage.getShoppingLists(req.session.userId);
      res.json(lists);
    } catch (error) {
      res.status(500).json({ message: "Failed to get shopping lists" });
    }
  });

  app.get("/api/shopping-lists/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const list = await storage.getShoppingList(id);
      
      if (!list) {
        return res.status(404).json({ message: "Shopping list not found" });
      }

      // Check if user owns the list or is admin
      const user = await storage.getUser(req.session.userId);
      if (list.userId !== req.session.userId && !user?.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }

      const items = await storage.getListItems(id);
      res.json({ ...list, items });
    } catch (error) {
      res.status(500).json({ message: "Failed to get shopping list" });
    }
  });

  app.post("/api/shopping-lists", requireAuth, async (req, res) => {
    try {
      const listData = insertShoppingListSchema.parse({
        ...req.body,
        userId: req.session.userId,
      });
      
      const list = await storage.createShoppingList(listData);
      res.json(list);
    } catch (error) {
      res.status(400).json({ message: "Invalid shopping list data" });
    }
  });

  app.patch("/api/shopping-lists/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const list = await storage.getShoppingList(id);
      
      if (!list) {
        return res.status(404).json({ message: "Shopping list not found" });
      }

      // Check if user owns the list or is admin
      const user = await storage.getUser(req.session.userId);
      if (list.userId !== req.session.userId && !user?.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updatedList = await storage.updateShoppingList(id, req.body);
      res.json(updatedList);
    } catch (error) {
      res.status(500).json({ message: "Failed to update shopping list" });
    }
  });

  app.delete("/api/shopping-lists/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const list = await storage.getShoppingList(id);
      
      if (!list) {
        return res.status(404).json({ message: "Shopping list not found" });
      }

      if (list.userId !== req.session.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const deleted = await storage.deleteShoppingList(id);
      if (deleted) {
        res.json({ message: "Shopping list deleted" });
      } else {
        res.status(404).json({ message: "Shopping list not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete shopping list" });
    }
  });

  // List items routes
  app.post("/api/shopping-lists/:listId/items", requireAuth, async (req, res) => {
    try {
      const listId = parseInt(req.params.listId);
      const list = await storage.getShoppingList(listId);
      
      if (!list) {
        return res.status(404).json({ message: "Shopping list not found" });
      }

      if (list.userId !== req.session.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const itemData = insertListItemSchema.parse({
        ...req.body,
        listId,
      });
      
      const item = await storage.createListItem(itemData);
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid item data" });
    }
  });

  app.patch("/api/list-items/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getListItem(id);
      
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      const list = await storage.getShoppingList(item.listId);
      const user = await storage.getUser(req.session.userId);
      
      // Check if user owns the list or is admin
      if (list?.userId !== req.session.userId && !user?.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updatedItem = await storage.updateListItem(id, req.body);
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update item" });
    }
  });

  app.delete("/api/list-items/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getListItem(id);
      
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      const list = await storage.getShoppingList(item.listId);
      if (list?.userId !== req.session.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const deleted = await storage.deleteListItem(id);
      if (deleted) {
        res.json({ message: "Item deleted" });
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete item" });
    }
  });

  // Admin routes
  app.get("/api/admin/shopping-lists", requireAdmin, async (req, res) => {
    try {
      const lists = await storage.getActiveShoppingLists();
      res.json(lists);
    } catch (error) {
      res.status(500).json({ message: "Failed to get active shopping lists" });
    }
  });

  app.get("/api/admin/shopping-lists-with-items", requireAdmin, async (req, res) => {
    try {
      const listsWithItems = await storage.getShoppingListsWithItems();
      res.json(listsWithItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to get shopping lists with items" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
