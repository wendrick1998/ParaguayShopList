import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertShoppingListSchema, insertListItemSchema } from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Shopping lists routes
  app.get("/api/shopping-lists", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const lists = await storage.getShoppingLists(userId);
      res.json(lists);
    } catch (error) {
      res.status(500).json({ message: "Failed to get shopping lists" });
    }
  });

  app.get("/api/shopping-lists/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const list = await storage.getShoppingList(id);
      
      if (!list) {
        return res.status(404).json({ message: "Shopping list not found" });
      }

      // Check if user owns the list or is admin
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (list.userId !== userId && !user?.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }

      const items = await storage.getListItems(id);
      res.json({ ...list, items });
    } catch (error) {
      res.status(500).json({ message: "Failed to get shopping list" });
    }
  });

  app.post("/api/shopping-lists", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const listData = insertShoppingListSchema.parse({
        ...req.body,
        userId,
      });
      
      const list = await storage.createShoppingList(listData);
      res.json(list);
    } catch (error) {
      res.status(400).json({ message: "Invalid shopping list data" });
    }
  });

  app.patch("/api/shopping-lists/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const list = await storage.getShoppingList(id);
      
      if (!list) {
        return res.status(404).json({ message: "Shopping list not found" });
      }

      // Check if user owns the list or is admin
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (list.userId !== userId && !user?.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updatedList = await storage.updateShoppingList(id, req.body);
      res.json(updatedList);
    } catch (error) {
      res.status(500).json({ message: "Failed to update shopping list" });
    }
  });

  app.delete("/api/shopping-lists/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const list = await storage.getShoppingList(id);
      
      if (!list) {
        return res.status(404).json({ message: "Shopping list not found" });
      }

      const userId = req.user.claims.sub;
      if (list.userId !== userId) {
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
  app.post("/api/shopping-lists/:listId/items", isAuthenticated, async (req: any, res) => {
    try {
      const listId = parseInt(req.params.listId);
      const list = await storage.getShoppingList(listId);
      
      if (!list) {
        return res.status(404).json({ message: "Shopping list not found" });
      }

      const userId = req.user.claims.sub;
      if (list.userId !== userId) {
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

  app.patch("/api/list-items/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getListItem(id);
      
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      const list = await storage.getShoppingList(item.listId);
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Check if user owns the list or is admin
      if (list?.userId !== userId && !user?.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updatedItem = await storage.updateListItem(id, req.body);
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update item" });
    }
  });

  app.delete("/api/list-items/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getListItem(id);
      
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      const list = await storage.getShoppingList(item.listId);
      const userId = req.user.claims.sub;
      if (list?.userId !== userId) {
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

  // Admin middleware
  const requireAdmin = async (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const userId = req.user.claims.sub;
    const user = await storage.getUser(userId);
    if (!user?.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  };

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