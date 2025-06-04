import { users, shoppingLists, listItems, type User, type InsertUser, type ShoppingList, type InsertShoppingList, type ListItem, type InsertListItem } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Shopping list methods
  getShoppingLists(userId: number): Promise<ShoppingList[]>;
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

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private shoppingLists: Map<number, ShoppingList> = new Map();
  private listItems: Map<number, ListItem> = new Map();
  private currentUserId = 1;
  private currentListId = 1;
  private currentItemId = 1;

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Shopping list methods
  async getShoppingLists(userId: number): Promise<ShoppingList[]> {
    return Array.from(this.shoppingLists.values()).filter(list => list.userId === userId);
  }

  async getShoppingList(id: number): Promise<ShoppingList | undefined> {
    return this.shoppingLists.get(id);
  }

  async createShoppingList(insertList: InsertShoppingList): Promise<ShoppingList> {
    const id = this.currentListId++;
    const now = new Date();
    const list: ShoppingList = {
      ...insertList,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.shoppingLists.set(id, list);
    return list;
  }

  async updateShoppingList(id: number, updates: Partial<ShoppingList>): Promise<ShoppingList | undefined> {
    const list = this.shoppingLists.get(id);
    if (!list) return undefined;

    const updatedList: ShoppingList = {
      ...list,
      ...updates,
      updatedAt: new Date(),
    };
    this.shoppingLists.set(id, updatedList);
    return updatedList;
  }

  async deleteShoppingList(id: number): Promise<boolean> {
    // Also delete all items in this list
    const items = Array.from(this.listItems.values()).filter(item => item.listId === id);
    items.forEach(item => this.listItems.delete(item.id));
    
    return this.shoppingLists.delete(id);
  }

  // List item methods
  async getListItems(listId: number): Promise<ListItem[]> {
    return Array.from(this.listItems.values()).filter(item => item.listId === listId);
  }

  async getListItem(id: number): Promise<ListItem | undefined> {
    return this.listItems.get(id);
  }

  async createListItem(insertItem: InsertListItem): Promise<ListItem> {
    const id = this.currentItemId++;
    const item: ListItem = {
      ...insertItem,
      id,
      updatedAt: new Date(),
    };
    this.listItems.set(id, item);
    return item;
  }

  async updateListItem(id: number, updates: Partial<ListItem>): Promise<ListItem | undefined> {
    const item = this.listItems.get(id);
    if (!item) return undefined;

    const updatedItem: ListItem = {
      ...item,
      ...updates,
      updatedAt: new Date(),
    };
    this.listItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteListItem(id: number): Promise<boolean> {
    return this.listItems.delete(id);
  }

  // Admin methods
  async getActiveShoppingLists(): Promise<ShoppingList[]> {
    return Array.from(this.shoppingLists.values()).filter(list => 
      list.status === "active" || list.status === "processing"
    );
  }

  async getShoppingListsWithItems(): Promise<(ShoppingList & { items: ListItem[] })[]> {
    const lists = Array.from(this.shoppingLists.values());
    return lists.map(list => ({
      ...list,
      items: Array.from(this.listItems.values()).filter(item => item.listId === list.id)
    }));
  }
}

export const storage = new MemStorage();
