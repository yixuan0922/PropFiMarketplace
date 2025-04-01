import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertPropertySchema, insertInvestmentSchema, insertTokenTransactionSchema, insertConsultationSchema, User } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod-validation-error";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import crypto from "crypto";

// Define session type
declare module 'express-session' {
  interface SessionData {
    passport: {
      user: number;
    };
  }
}

// Setup authentication middleware
function setupAuth(app: Express) {
  // Use Express session middleware
  app.use(session({
    secret: 'propfi-secret-key',
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: { secure: process.env.NODE_ENV === 'production' }
  }));

  // Initialize Passport and restore authentication state from session
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure Passport to use local strategy
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      
      // In a real application, you would hash passwords
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  // Serialize user to session
  passport.serializeUser((user: User, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(new Error(`User with id ${id} not found`));
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Authentication routes
  app.post('/api/login', passport.authenticate('local'), (req: Request, res: Response) => {
    // Remove password from user object before sending
    const user = req.user as User;
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  app.post('/api/logout', (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
      if (err) { return next(err); }
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });

  app.get('/api/current-user', (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const user = req.user as User;
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
}

// Middleware to check if user is authenticated
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  // API routes - all prefixed with /api
  app.get("/api/properties", async (req: Request, res: Response) => {
    try {
      const status = req.query.status as string | undefined;
      let properties;
      
      if (status) {
        properties = await storage.getPropertiesByStatus(status);
      } else {
        properties = await storage.getAllProperties();
      }
      
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving properties" });
    }
  });
  
  app.get("/api/properties/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }
      
      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving property" });
    }
  });

  app.post("/api/properties", isAuthenticated, async (req: Request, res: Response) => {
    try {
      // Format data for Drizzle compatibility - some fields need to be numbers, others strings
      const formattedData = {
        ...req.body,
        price: req.body.price?.toString(),
        pricePerSqft: req.body.pricePerSqft?.toString(),
        bedrooms: Number(req.body.bedrooms),
        bathrooms: req.body.bathrooms?.toString(),
        squareFeet: Number(req.body.squareFeet),
        availableTokens: req.body.availableTokens?.toString(),
        minimumInvestment: req.body.minimumInvestment?.toString(),
      };
      
      const propertyData = insertPropertySchema.parse(formattedData);
      const property = await storage.createProperty(propertyData);
      res.status(201).json(property);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid property data", errors: error.format() });
      }
      res.status(500).json({ message: "Error creating property" });
    }
  });
  
  app.get("/api/properties/:id/investments", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }
      
      const investments = await storage.getInvestmentsByProperty(id);
      res.json(investments);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving investments" });
    }
  });
  
  // Users
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(409).json({ message: "Email already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.format() });
      }
      res.status(500).json({ message: "Error creating user" });
    }
  });
  
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return password in response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving user" });
    }
  });
  
  // Investments
  app.post("/api/investments", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const investmentData = insertInvestmentSchema.parse(req.body);
      
      // Verify property exists
      const property = await storage.getProperty(investmentData.propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Verify user exists
      const user = await storage.getUser(investmentData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if enough tokens are available
      if (property.availableTokens < investmentData.percentage) {
        return res.status(400).json({ message: "Not enough tokens available" });
      }
      
      // Create investment
      const investment = await storage.createInvestment(investmentData);
      
      // Update property available tokens
      await storage.updatePropertyTokens(
        property.id, 
        Number(property.availableTokens) - Number(investmentData.percentage)
      );
      
      res.status(201).json(investment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid investment data", errors: error.format() });
      }
      res.status(500).json({ message: "Error creating investment" });
    }
  });
  
  app.get("/api/users/:id/investments", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const investments = await storage.getInvestmentsByUser(id);
      res.json(investments);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving investments" });
    }
  });
  
  // Token Transactions
  app.post("/api/token-transactions", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const transactionData = insertTokenTransactionSchema.parse(req.body);
      
      // Verify property exists
      const property = await storage.getProperty(transactionData.propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Create transaction
      const transaction = await storage.createTokenTransaction(transactionData);
      
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid transaction data", errors: error.format() });
      }
      res.status(500).json({ message: "Error creating transaction" });
    }
  });
  
  app.patch("/api/token-transactions/:id/status", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid transaction ID" });
      }
      
      const { status } = req.body;
      if (!status || !['pending', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const transaction = await storage.updateTokenTransactionStatus(id, status);
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Error updating transaction" });
    }
  });
  
  app.get("/api/token-transactions", async (req: Request, res: Response) => {
    try {
      const propertyId = req.query.propertyId ? parseInt(req.query.propertyId as string) : undefined;
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      
      let transactions = [];
      
      if (propertyId) {
        transactions = await storage.getTokenTransactionsByProperty(propertyId);
      } else if (userId) {
        transactions = await storage.getTokenTransactionsByUser(userId);
      } else {
        return res.status(400).json({ message: "Missing query parameters" });
      }
      
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving transactions" });
    }
  });
  
  // Consultations
  app.post("/api/consultations", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const consultationData = insertConsultationSchema.parse(req.body);
      
      // Verify property exists
      const property = await storage.getProperty(consultationData.propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Create consultation
      const consultation = await storage.createConsultation(consultationData);
      
      res.status(201).json(consultation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid consultation data", errors: error.format() });
      }
      res.status(500).json({ message: "Error creating consultation" });
    }
  });
  
  app.get("/api/users/:id/consultations", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Verify user is requesting their own consultations or is an admin
      const user = req.user as User;
      if (user.id !== id && user.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized to view these consultations" });
      }
      
      const consultations = await storage.getConsultationsByUser(id);
      res.json(consultations);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving consultations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
