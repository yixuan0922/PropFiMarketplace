-- Seed data for PropFi database

-- Users data
INSERT INTO users (username, password, first_name, last_name, email, profile_image, role, is_investor, is_homebuyer)
VALUES
  ('investor1', 'password123', 'John', 'Smith', 'john@example.com', 'https://randomuser.me/api/portraits/men/1.jpg', 'investor', TRUE, FALSE),
  ('investor2', 'password123', 'Sara', 'Capital', 'sara@example.com', 'https://randomuser.me/api/portraits/women/2.jpg', 'investor', TRUE, FALSE),
  ('developer1', 'password123', 'Alex', 'Builder', 'alex@example.com', 'https://randomuser.me/api/portraits/men/3.jpg', 'developer', FALSE, FALSE),
  ('admin1', 'password123', 'Admin', 'User', 'admin@example.com', 'https://randomuser.me/api/portraits/women/4.jpg', 'admin', FALSE, FALSE)
ON CONFLICT (username) DO NOTHING;

-- Properties data
INSERT INTO properties (
  title, address, city, state, zip_code, price, price_per_sqft, 
  bedrooms, bathrooms, square_feet, description, property_type, 
  image_url, available_tokens, minimum_investment, status
)
VALUES
  (
    'Modern Downtown Condo',
    '123 Main St',
    'San Francisco',
    'CA',
    '94105',
    600000,
    1200,
    2,
    2,
    1200,
    'Beautiful modern condo in the heart of downtown San Francisco.',
    'condo',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
    45,
    10,
    'active'
  ),
  (
    'Suburban Family Home',
    '456 Oak Ave',
    'Austin',
    'TX',
    '78701',
    450000,
    225,
    4,
    2.5,
    2000,
    'Spacious family home in a quiet suburban neighborhood.',
    'house',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
    40,
    10,
    'active'
  ),
  (
    'Luxury Beachfront Villa',
    '789 Ocean Blvd',
    'Miami',
    'FL',
    '33139',
    1200000,
    800,
    3,
    3.5,
    1500,
    'Stunning beachfront villa with panoramic ocean views.',
    'house',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
    35,
    10,
    'active'
  )
ON CONFLICT DO NOTHING;

-- Investments data
-- First, we need to get the IDs of the inserted users and properties
DO $$
DECLARE
  investor1_id INTEGER;
  investor2_id INTEGER;
  condo_id INTEGER;
  suburban_home_id INTEGER;
  villa_id INTEGER;
BEGIN
  -- Get user IDs
  SELECT id INTO investor1_id FROM users WHERE username = 'investor1';
  SELECT id INTO investor2_id FROM users WHERE username = 'investor2';
  
  -- Get property IDs
  SELECT id INTO condo_id FROM properties WHERE title = 'Modern Downtown Condo';
  SELECT id INTO suburban_home_id FROM properties WHERE title = 'Suburban Family Home';
  SELECT id INTO villa_id FROM properties WHERE title = 'Luxury Beachfront Villa';
  
  -- Insert investments
  INSERT INTO investments (user_id, property_id, percentage, amount, is_occupier)
  VALUES
    (investor1_id, condo_id, 10, 60000, FALSE),
    (investor1_id, villa_id, 5, 60000, FALSE),
    (investor2_id, suburban_home_id, 15, 67500, FALSE)
  ON CONFLICT DO NOTHING;
  
  -- Insert consultations
  INSERT INTO consultations (
    user_id, property_id, type, notes, status, scheduled_date
  )
  VALUES
    (
      investor1_id, 
      suburban_home_id, 
      'investor', 
      'Interested in investing in this property, need more information.', 
      'scheduled', 
      CURRENT_TIMESTAMP + INTERVAL '7 days'
    ),
    (
      investor2_id, 
      villa_id, 
      'investor', 
      'Looking to diversify portfolio with luxury properties.', 
      'scheduled', 
      CURRENT_TIMESTAMP + INTERVAL '3 days'
    )
  ON CONFLICT DO NOTHING;
END $$;