import {
  users, properties, investments, tokenTransactions, consultations,
  type User, type InsertUser,
  type Property, type InsertProperty,
  type Investment, type InsertInvestment,
  type TokenTransaction, type InsertTokenTransaction,
  type Consultation, type InsertConsultation
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

export interface IStorage {
  // Session store for authentication
  sessionStore: session.Store;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserWalletBalance(userId: number, newBalance: number): Promise<User | undefined>;
  
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
  
  // Consultation operations
  getConsultation(id: number): Promise<Consultation | undefined>;
  getConsultationsByUser(userId: number): Promise<Consultation[]>;
  getConsultationsByProperty(propertyId: number): Promise<Consultation[]>;
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  updateConsultationStatus(id: number, status: string): Promise<Consultation | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private investments: Map<number, Investment>;
  private tokenTransactions: Map<number, TokenTransaction>;
  private consultations: Map<number, Consultation>;
  
  private userIdCounter: number;
  private propertyIdCounter: number;
  private investmentIdCounter: number;
  private tokenTransactionIdCounter: number;
  private consultationIdCounter: number;
  
  public sessionStore: session.Store;
  
  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.investments = new Map();
    this.tokenTransactions = new Map();
    this.consultations = new Map();
    
    this.userIdCounter = 1;
    this.propertyIdCounter = 1;
    this.investmentIdCounter = 1;
    this.tokenTransactionIdCounter = 1;
    this.consultationIdCounter = 1;
    
    // Initialize the memory store for sessions
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Initialize with sample data for development
    this.initSampleData();
  }
  
  private initSampleData() {
    // Add sample users for different roles
    const sampleUsers: InsertUser[] = [
      {
        username: "investor1",
        password: "password123",
        firstName: "John",
        lastName: "Investor",
        email: "john@example.com",
        profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
        role: "investor",
        isInvestor: true,
        isHomebuyer: false
      },
      {
        username: "investor2",
        password: "password123",
        firstName: "Sara",
        lastName: "Capital",
        email: "sara@example.com",
        profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
        role: "investor",
        isInvestor: true,
        isHomebuyer: false
      },
      {
        username: "developer1",
        password: "password123",
        firstName: "Alex",
        lastName: "Builder",
        email: "alex@example.com",
        profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
        role: "developer",
        isInvestor: false,
        isHomebuyer: false
      },
      {
        username: "developer2",
        password: "password123",
        firstName: "Michael",
        lastName: "Constructor",
        email: "michael@example.com",
        profileImage: "https://randomuser.me/api/portraits/men/5.jpg",
        role: "developer",
        isInvestor: false,
        isHomebuyer: false
      },
      {
        username: "admin1",
        password: "password123",
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        profileImage: "https://randomuser.me/api/portraits/women/4.jpg",
        role: "admin",
        isInvestor: false,
        isHomebuyer: false
      }
    ];
    
    const userPromises = sampleUsers.map(user => this.createUser(user));
    
    // Add sample properties - all assigned to developer1 (user ID 3)
    const sampleProperties: InsertProperty[] = [
      {
        title: "Modern Downtown Condo",
        address: "123 Main St",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        price: "600000",
        pricePerSqft: "1200",
        bedrooms: 2,
        bathrooms: "2",
        squareFeet: 1200,
        description: "Beautiful modern condo in the heart of downtown San Francisco.",
        propertyType: "condo",
        imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
        availableTokens: "45",
        minimumInvestment: "10",
        status: "active",
        developerId: 3 // developer1
      },
      {
        title: "Suburban Family Home",
        address: "456 Oak Ave",
        city: "Austin",
        state: "TX",
        zipCode: "78701",
        price: "450000",
        pricePerSqft: "225",
        bedrooms: 4,
        bathrooms: "2.5",
        squareFeet: 2000,
        description: "Spacious family home in a quiet suburban neighborhood.",
        propertyType: "house",
        imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
        availableTokens: "40",
        minimumInvestment: "10",
        status: "active",
        developerId: 3 // developer1
      },
      {
        title: "Luxury Beachfront Villa",
        address: "789 Ocean Blvd",
        city: "Miami",
        state: "FL",
        zipCode: "33139",
        price: "1200000",
        pricePerSqft: "800",
        bedrooms: 3,
        bathrooms: "3.5",
        squareFeet: 1500,
        description: "Stunning beachfront villa with panoramic ocean views.",
        propertyType: "house",
        imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
        availableTokens: "35",
        minimumInvestment: "10",
        status: "active",
        developerId: 3 // developer1
      }
    ];
    
    const propertyPromises = sampleProperties.map(property => this.createProperty(property));

    // Add sample investments for investors
    Promise.all([...userPromises, ...propertyPromises]).then(() => {
      const sampleInvestments: InsertInvestment[] = [
        {
          userId: 1, // investor1
          propertyId: 1, // Modern Downtown Condo
          percentage: "10",
          amount: "60000",
          isOccupier: false
        },
        {
          userId: 1, // investor1
          propertyId: 3, // Luxury Beachfront Villa
          percentage: "5",
          amount: "60000",
          isOccupier: false
        },
        {
          userId: 2, // investor2
          propertyId: 2, // Suburban Family Home
          percentage: "15",
          amount: "67500",
          isOccupier: false
        }
      ];
      
      sampleInvestments.forEach(investment => this.createInvestment(investment));
      
      // Add sample consultations
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const sampleConsultations: InsertConsultation[] = [
        {
          userId: 1, // investor1
          propertyId: 2, // Suburban Family Home
          type: "investor",
          notes: "Interested in investing in this property, need more information.",
          status: "scheduled",
          scheduledDate: nextWeek
        },
        {
          userId: 2, // investor2
          propertyId: 3, // Luxury Beachfront Villa
          type: "investor",
          notes: "Looking to diversify portfolio with luxury properties.",
          status: "scheduled",
          scheduledDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
        }
      ];
      
      sampleConsultations.forEach(consultation => this.createConsultation(consultation));
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
    
    // Ensure all fields have proper null values if they don't exist
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      profileImage: insertUser.profileImage || null,
      role: insertUser.role || 'investor',
      isInvestor: insertUser.isInvestor === undefined ? null : insertUser.isInvestor,
      isHomebuyer: insertUser.isHomebuyer === undefined ? null : insertUser.isHomebuyer,
      walletBalance: insertUser.walletBalance || "10000", // Default wallet balance
      createdAt: now
    };
    
    this.users.set(id, user);
    return user;
  }

  async updateUserWalletBalance(userId: number, newBalance: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      walletBalance: newBalance.toString()
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
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
    
    // Ensure all fields have proper null values if they don't exist
    const property: Property = {
      id,
      title: insertProperty.title,
      address: insertProperty.address,
      city: insertProperty.city,
      state: insertProperty.state,
      zipCode: insertProperty.zipCode,
      price: insertProperty.price,
      pricePerSqft: insertProperty.pricePerSqft || null,
      bedrooms: insertProperty.bedrooms,
      bathrooms: insertProperty.bathrooms,
      squareFeet: insertProperty.squareFeet,
      description: insertProperty.description || null,
      propertyType: insertProperty.propertyType,
      imageUrl: insertProperty.imageUrl || null,
      availableTokens: insertProperty.availableTokens,
      minimumInvestment: insertProperty.minimumInvestment,
      status: insertProperty.status || "active",
      developerId: insertProperty.developerId || null,
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
      availableTokens: availableTokens.toString()
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
    
    // Ensure all fields have proper null values if they don't exist
    const investment: Investment = {
      id,
      userId: insertInvestment.userId,
      propertyId: insertInvestment.propertyId,
      percentage: insertInvestment.percentage,
      amount: insertInvestment.amount,
      investmentDate: now,
      isOccupier: insertInvestment.isOccupier === undefined ? null : insertInvestment.isOccupier
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
    
    // Ensure all fields have proper null values if they don't exist
    const transaction: TokenTransaction = {
      id,
      propertyId: insertTransaction.propertyId,
      sellerId: insertTransaction.sellerId || null,
      buyerId: insertTransaction.buyerId || null,
      percentage: insertTransaction.percentage,
      amount: insertTransaction.amount,
      status: insertTransaction.status,
      createdAt: now,
      completedAt: insertTransaction.status === 'completed' ? now : null
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
      completedAt: status === 'completed' ? completedAt || new Date() : transaction.completedAt || null
    };
    this.tokenTransactions.set(id, updatedTransaction);
    return updatedTransaction;
  }
  
  // Consultation operations
  async getConsultation(id: number): Promise<Consultation | undefined> {
    return this.consultations.get(id);
  }
  
  async getConsultationsByUser(userId: number): Promise<Consultation[]> {
    return Array.from(this.consultations.values()).filter(
      (consultation) => consultation.userId === userId
    );
  }
  
  async getConsultationsByProperty(propertyId: number): Promise<Consultation[]> {
    return Array.from(this.consultations.values()).filter(
      (consultation) => consultation.propertyId === propertyId
    );
  }
  
  async createConsultation(insertConsultation: InsertConsultation): Promise<Consultation> {
    const id = this.consultationIdCounter++;
    const now = new Date();
    
    // Ensure all fields have proper null values if they don't exist
    const consultation: Consultation = {
      id,
      userId: insertConsultation.userId,
      propertyId: insertConsultation.propertyId,
      type: insertConsultation.type,
      notes: insertConsultation.notes || null,
      status: insertConsultation.status || "scheduled",
      scheduledDate: insertConsultation.scheduledDate,
      createdAt: now
    };
    
    this.consultations.set(id, consultation);
    return consultation;
  }
  
  async updateConsultationStatus(id: number, status: string): Promise<Consultation | undefined> {
    const consultation = this.consultations.get(id);
    if (!consultation) return undefined;
    
    const updatedConsultation: Consultation = {
      ...consultation,
      status
    };
    this.consultations.set(id, updatedConsultation);
    return updatedConsultation;
  }
}

export const storage = new MemStorage();
