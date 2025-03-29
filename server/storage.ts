import {
  users, properties, investments, tokenTransactions,
  type User, type InsertUser,
  type Property, type InsertProperty,
  type Investment, type InsertInvestment,
  type TokenTransaction, type InsertTokenTransaction
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Property operations
  getProperty(id: number): Promise<Property | undefined>;
  getAllProperties(): Promise<Property[]>;
  getPropertiesByStatus(status: string): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updatePropertyTokens(id: number, availableTokens: number): Promise<Property | undefined>;
  
  // Investment operations
  getInvestment(id: number): Promise<Investment | undefined>;
  getInvestmentsByUser(userId: number): Promise<Investment[]>;
  getInvestmentsByProperty(propertyId: number): Promise<Investment[]>;
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  
  // Token transaction operations
  getTokenTransaction(id: number): Promise<TokenTransaction | undefined>;
  getTokenTransactionsByUser(userId: number): Promise<TokenTransaction[]>;
  getTokenTransactionsByProperty(propertyId: number): Promise<TokenTransaction[]>;
  createTokenTransaction(transaction: InsertTokenTransaction): Promise<TokenTransaction>;
  updateTokenTransactionStatus(id: number, status: string, completedAt?: Date): Promise<TokenTransaction | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private investments: Map<number, Investment>;
  private tokenTransactions: Map<number, TokenTransaction>;
  
  private userIdCounter: number;
  private propertyIdCounter: number;
  private investmentIdCounter: number;
  private tokenTransactionIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.investments = new Map();
    this.tokenTransactions = new Map();
    
    this.userIdCounter = 1;
    this.propertyIdCounter = 1;
    this.investmentIdCounter = 1;
    this.tokenTransactionIdCounter = 1;
    
    // Initialize with sample data for development
    this.initSampleData();
  }
  
  private initSampleData() {
    // Add sample properties
    const sampleProperties: InsertProperty[] = [
      {
        title: "Modern Downtown Condo",
        address: "123 Main St",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        price: 600000,
        pricePerSqft: 1200,
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1200,
        description: "Beautiful modern condo in the heart of downtown San Francisco.",
        propertyType: "condo",
        imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
        availableTokens: 45,
        minimumInvestment: 10,
        status: "active"
      },
      {
        title: "Suburban Family Home",
        address: "456 Oak Ave",
        city: "Austin",
        state: "TX",
        zipCode: "78701",
        price: 450000,
        pricePerSqft: 225,
        bedrooms: 4,
        bathrooms: 2.5,
        squareFeet: 2000,
        description: "Spacious family home in a quiet suburban neighborhood.",
        propertyType: "house",
        imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
        availableTokens: 40,
        minimumInvestment: 10,
        status: "active"
      },
      {
        title: "Luxury Beachfront Villa",
        address: "789 Ocean Blvd",
        city: "Miami",
        state: "FL",
        zipCode: "33139",
        price: 1200000,
        pricePerSqft: 800,
        bedrooms: 3,
        bathrooms: 3.5,
        squareFeet: 1500,
        description: "Stunning beachfront villa with panoramic ocean views.",
        propertyType: "house",
        imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
        availableTokens: 35,
        minimumInvestment: 10,
        status: "active"
      }
    ];
    
    sampleProperties.forEach(property => {
      this.createProperty(property);
    });
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  // Property operations
  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }
  
  async getAllProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }
  
  async getPropertiesByStatus(status: string): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.status === status,
    );
  }
  
  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.propertyIdCounter++;
    const now = new Date();
    const property: Property = {
      ...insertProperty,
      id,
      createdAt: now
    };
    this.properties.set(id, property);
    return property;
  }
  
  async updatePropertyTokens(id: number, availableTokens: number): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;
    
    const updatedProperty: Property = {
      ...property,
      availableTokens
    };
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }
  
  // Investment operations
  async getInvestment(id: number): Promise<Investment | undefined> {
    return this.investments.get(id);
  }
  
  async getInvestmentsByUser(userId: number): Promise<Investment[]> {
    return Array.from(this.investments.values()).filter(
      (investment) => investment.userId === userId,
    );
  }
  
  async getInvestmentsByProperty(propertyId: number): Promise<Investment[]> {
    return Array.from(this.investments.values()).filter(
      (investment) => investment.propertyId === propertyId,
    );
  }
  
  async createInvestment(insertInvestment: InsertInvestment): Promise<Investment> {
    const id = this.investmentIdCounter++;
    const now = new Date();
    const investment: Investment = {
      ...insertInvestment,
      id,
      investmentDate: now
    };
    this.investments.set(id, investment);
    return investment;
  }
  
  // Token transaction operations
  async getTokenTransaction(id: number): Promise<TokenTransaction | undefined> {
    return this.tokenTransactions.get(id);
  }
  
  async getTokenTransactionsByUser(userId: number): Promise<TokenTransaction[]> {
    return Array.from(this.tokenTransactions.values()).filter(
      (transaction) => transaction.sellerId === userId || transaction.buyerId === userId,
    );
  }
  
  async getTokenTransactionsByProperty(propertyId: number): Promise<TokenTransaction[]> {
    return Array.from(this.tokenTransactions.values()).filter(
      (transaction) => transaction.propertyId === propertyId,
    );
  }
  
  async createTokenTransaction(insertTransaction: InsertTokenTransaction): Promise<TokenTransaction> {
    const id = this.tokenTransactionIdCounter++;
    const now = new Date();
    const transaction: TokenTransaction = {
      ...insertTransaction,
      id,
      createdAt: now,
      completedAt: insertTransaction.status === 'completed' ? now : undefined
    };
    this.tokenTransactions.set(id, transaction);
    return transaction;
  }
  
  async updateTokenTransactionStatus(id: number, status: string, completedAt?: Date): Promise<TokenTransaction | undefined> {
    const transaction = this.tokenTransactions.get(id);
    if (!transaction) return undefined;
    
    const updatedTransaction: TokenTransaction = {
      ...transaction,
      status,
      completedAt: status === 'completed' ? completedAt || new Date() : transaction.completedAt
    };
    this.tokenTransactions.set(id, updatedTransaction);
    return updatedTransaction;
  }
}

export const storage = new MemStorage();
