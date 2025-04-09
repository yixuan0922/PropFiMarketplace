import { pgTable, text, serial, integer, numeric, boolean, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export type UserRole = 'investor' | 'developer' | 'admin';

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").notNull().unique(),
  profileImage: text("profile_image"),
  role: text("role").notNull().default("investor"),
  isInvestor: boolean("is_investor").default(false),
  isHomebuyer: boolean("is_homebuyer").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  price: numeric("price").notNull(),
  pricePerSqft: numeric("price_per_sqft"),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: numeric("bathrooms").notNull(),
  squareFeet: integer("square_feet").notNull(),
  description: text("description"),
  propertyType: text("property_type").notNull(), // condo, house, townhouse, multi-family
  imageUrl: text("image_url"), 
  availableTokens: numeric("available_tokens").notNull(), // percentage available for investors
  minimumInvestment: numeric("minimum_investment").notNull(), // minimum percentage/amount
  status: text("status").notNull().default("active"), // active, pending, sold
  developerId: integer("developer_id").references(() => users.id), // developer who created this property
  createdAt: timestamp("created_at").defaultNow(),
});

export const investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  propertyId: integer("property_id").references(() => properties.id, { onDelete: "cascade" }).notNull(),
  percentage: numeric("percentage").notNull(), // percentage of ownership
  amount: numeric("amount").notNull(), // dollar amount invested
  investmentDate: timestamp("investment_date").defaultNow(),
  isOccupier: boolean("is_occupier").default(false), // whether this investor is occupying the property
});

export const tokenTransactions = pgTable("token_transactions", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").references(() => properties.id, { onDelete: "cascade" }).notNull(),
  sellerId: integer("seller_id").references(() => users.id, { onDelete: "cascade" }),
  buyerId: integer("buyer_id").references(() => users.id, { onDelete: "cascade" }),
  percentage: numeric("percentage").notNull(),
  amount: numeric("amount").notNull(),
  status: text("status").notNull(), // pending, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  propertyId: integer("property_id").references(() => properties.id, { onDelete: "cascade" }).notNull(),
  type: text("type").notNull(), // homebuyer, investor
  notes: text("notes"),
  status: text("status").notNull().default("scheduled"), // scheduled, completed, cancelled
  scheduledDate: timestamp("scheduled_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true, 
  email: true,
  firstName: true,
  lastName: true,
  profileImage: true,
  role: true,
  isInvestor: true,
  isHomebuyer: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
});

export const insertInvestmentSchema = createInsertSchema(investments).omit({
  id: true,
  investmentDate: true,
});

export const insertTokenTransactionSchema = createInsertSchema(tokenTransactions).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertConsultationSchema = createInsertSchema(consultations).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;
export type Investment = typeof investments.$inferSelect;

export type InsertTokenTransaction = z.infer<typeof insertTokenTransactionSchema>;
export type TokenTransaction = typeof tokenTransactions.$inferSelect;

export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type Consultation = typeof consultations.$inferSelect;
