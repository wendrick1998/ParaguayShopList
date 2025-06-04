import {
  users,
  shoppingLists,
  listItems,
  type User,
  type UpsertUser,
  type ShoppingList,
  type InsertShoppingList,
  type ListItem,
  type InsertListItem,
} from "@shared/schema";
import { db } from "./db";
import { eq, or } from "drizzle-orm";

export interface IStorage {
  // User methods for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Shopping list methods
  getShoppingLists(userId: string): Promise<ShoppingList[]>;
  getShoppingList(id: number): Promise<ShoppingList | undefined>;
  createShoppingList(list: InsertShoppingList): Promise<ShoppingList>;
  updateShoppingList(id: number, updates: Partial<ShoppingList>): Promise<ShoppingList | undefined>;
  deleteShoppingList(id: number): Promise<boolean>;
  
  // List item methods
  getListItems(listId: number): Promise<ListItem[]>;
  getListItem(id: number): Promise<ListItem | undefined>;
  createListItem(item: InsertListItem): Promise<ListItem>;
  updateListItem(id: number, updates: Partial<ListItem>): Promise<ListItem | undefined>;
  deleteListItem(id: number): Promise<boolean>;
  
  // Admin methods
  getActiveShoppingLists(): Promise<ShoppingList[]>;
  getShoppingListsWithItems(): Promise<(ShoppingList & { items: ListItem[] })[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Shopping list methods
  async getShoppingLists(userId: string): Promise<ShoppingList[]> {
    return await db.select().from(shoppingLists).where(eq(shoppingLists.userId, userId));
  }

  async getShoppingList(id: number): Promise<ShoppingList | undefined> {
    const [list] = await db.select().from(shoppingLists).where(eq(shoppingLists.id, id));
    return list || undefined;
  }

  async createShoppingList(insertList: InsertShoppingList): Promise<ShoppingList> {
    const [list] = await db
      .insert(shoppingLists)
      .values({
        ...insertList,
        status: insertList.status || "draft",
        description: insertList.description || null,
      })
      .returning();
    return list;
  }

  async updateShoppingList(id: number, updates: Partial<ShoppingList>): Promise<ShoppingList | undefined> {
    const [updatedList] = await db
      .update(shoppingLists)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(shoppingLists.id, id))
      .returning();
    return updatedList || undefined;
  }

  async deleteShoppingList(id: number): Promise<boolean> {
    // First delete all items in this list
    await db.delete(listItems).where(eq(listItems.listId, id));
    
    // Then delete the list
    const result = await db.delete(shoppingLists).where(eq(shoppingLists.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // List item methods
  async getListItems(listId: number): Promise<ListItem[]> {
    return await db.select().from(listItems).where(eq(listItems.listId, listId));
  }

  async getListItem(id: number): Promise<ListItem | undefined> {
    const [item] = await db.select().from(listItems).where(eq(listItems.id, id));
    return item || undefined;
  }

  async createListItem(insertItem: InsertListItem): Promise<ListItem> {
    const [item] = await db
      .insert(listItems)
      .values({
        ...insertItem,
        status: insertItem.status || "pending",
        quantity: insertItem.quantity || 1,
        estimatedPrice: insertItem.estimatedPrice || null,
        actualPrice: insertItem.actualPrice || null,
        notes: insertItem.notes || null,
      })
      .returning();
    return item;
  }

  async updateListItem(id: number, updates: Partial<ListItem>): Promise<ListItem | undefined> {
    const [updatedItem] = await db
      .update(listItems)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(listItems.id, id))
      .returning();
    return updatedItem || undefined;
  }

  async deleteListItem(id: number): Promise<boolean> {
    const result = await db.delete(listItems).where(eq(listItems.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Admin methods
  async getActiveShoppingLists(): Promise<ShoppingList[]> {
    return await db
      .select()
      .from(shoppingLists)
      .where(eq(shoppingLists.status, "active"))
      .union(
        db.select().from(shoppingLists).where(eq(shoppingLists.status, "processing"))
      );
  }

  async getShoppingListsWithItems(): Promise<(ShoppingList & { items: ListItem[] })[]> {
    const lists = await db.select().from(shoppingLists);
    const result: (ShoppingList & { items: ListItem[] })[] = [];
    
    for (const list of lists) {
      const items = await db.select().from(listItems).where(eq(listItems.listId, list.id));
      result.push({ ...list, items });
    }
    
    return result;
  }
}

export const storage = new DatabaseStorage();
