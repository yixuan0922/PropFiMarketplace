-- Create PropFi database tables

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL UNIQUE,
  profile_image TEXT,
  role TEXT NOT NULL DEFAULT 'investor',
  is_investor BOOLEAN DEFAULT FALSE,
  is_homebuyer BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  price NUMERIC NOT NULL,
  price_per_sqft NUMERIC,
  bedrooms INTEGER NOT NULL,
  bathrooms NUMERIC NOT NULL,
  square_feet INTEGER NOT NULL,
  description TEXT,
  property_type TEXT NOT NULL,  -- condo, house, townhouse, multi-family
  image_url TEXT,
  available_tokens NUMERIC NOT NULL,  -- percentage available for investors
  minimum_investment NUMERIC NOT NULL,  -- minimum percentage/amount
  status TEXT NOT NULL DEFAULT 'active',  -- active, pending, sold
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Investments table
CREATE TABLE IF NOT EXISTS investments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  percentage NUMERIC NOT NULL,  -- percentage of ownership
  amount NUMERIC NOT NULL,  -- dollar amount invested
  investment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_occupier BOOLEAN DEFAULT FALSE  -- whether this investor is occupying the property
);

-- Token Transactions table
CREATE TABLE IF NOT EXISTS token_transactions (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  buyer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  percentage NUMERIC NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL,  -- pending, completed, cancelled
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- Consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  type TEXT NOT NULL,  -- homebuyer, investor
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled',  -- scheduled, completed, cancelled
  scheduled_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for commonly accessed columns
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_investments_property_id ON investments(property_id);
CREATE INDEX idx_token_transactions_property_id ON token_transactions(property_id);
CREATE INDEX idx_token_transactions_seller_id ON token_transactions(seller_id);
CREATE INDEX idx_token_transactions_buyer_id ON token_transactions(buyer_id);
CREATE INDEX idx_consultations_user_id ON consultations(user_id);
CREATE INDEX idx_consultations_property_id ON consultations(property_id);