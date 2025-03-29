// Script to migrate data from in-memory storage to PostgreSQL using Drizzle ORM
const { drizzle } = require('drizzle-orm/postgres-js');
const { migrate } = require('drizzle-orm/postgres-js/migrator');
const postgres = require('postgres');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const crypto = require('crypto');

// Hash password function (same as in auth.ts)
async function hashPassword(password) {
  const scryptAsync = promisify(crypto.scrypt);
  const salt = crypto.randomBytes(16).toString('hex');
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString('hex')}.${salt}`;
}

async function main() {
  // Check if environment variables are available
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set.');
    process.exit(1);
  }

  // Connect to PostgreSQL
  const connectionString = process.env.DATABASE_URL;
  console.log('Connecting to PostgreSQL database...');
  const queryClient = postgres(connectionString);
  const db = drizzle(queryClient);

  try {
    // Sample users data (from memory storage)
    const users = [
      {
        username: 'investor1',
        password: 'password123',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@example.com',
        profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
        role: 'investor',
        isInvestor: true,
        isHomebuyer: false
      },
      {
        username: 'investor2',
        password: 'password123',
        firstName: 'Sara',
        lastName: 'Capital',
        email: 'sara@example.com',
        profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
        role: 'investor',
        isInvestor: true,
        isHomebuyer: false
      },
      {
        username: 'developer1',
        password: 'password123',
        firstName: 'Alex',
        lastName: 'Builder',
        email: 'alex@example.com',
        profileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
        role: 'developer',
        isInvestor: false,
        isHomebuyer: false
      },
      {
        username: 'admin1',
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        profileImage: 'https://randomuser.me/api/portraits/women/4.jpg',
        role: 'admin',
        isInvestor: false,
        isHomebuyer: false
      }
    ];

    // Sample properties data
    const properties = [
      {
        title: 'Modern Downtown Condo',
        address: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        price: 600000,
        pricePerSqft: 1200,
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1200,
        description: 'Beautiful modern condo in the heart of downtown San Francisco.',
        propertyType: 'condo',
        imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
        availableTokens: 45,
        minimumInvestment: 10,
        status: 'active'
      },
      {
        title: 'Suburban Family Home',
        address: '456 Oak Ave',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        price: 450000,
        pricePerSqft: 225,
        bedrooms: 4,
        bathrooms: 2.5,
        squareFeet: 2000,
        description: 'Spacious family home in a quiet suburban neighborhood.',
        propertyType: 'house',
        imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
        availableTokens: 40,
        minimumInvestment: 10,
        status: 'active'
      },
      {
        title: 'Luxury Beachfront Villa',
        address: '789 Ocean Blvd',
        city: 'Miami',
        state: 'FL',
        zipCode: '33139',
        price: 1200000,
        pricePerSqft: 800,
        bedrooms: 3,
        bathrooms: 3.5,
        squareFeet: 1500,
        description: 'Stunning beachfront villa with panoramic ocean views.',
        propertyType: 'house',
        imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
        availableTokens: 35,
        minimumInvestment: 10,
        status: 'active'
      }
    ];

    // Insert users with hashed passwords
    console.log('Migrating users...');
    for (const user of users) {
      const hashedPassword = await hashPassword(user.password);
      
      // Check if user already exists
      const existingUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.username, user.username)
      });
      
      if (existingUser) {
        console.log(`User ${user.username} already exists, skipping...`);
        continue;
      }
      
      // Insert user with Drizzle
      await db.insert(tables.users).values({
        username: user.username,
        password: hashedPassword,
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        profile_image: user.profileImage,
        role: user.role,
        is_investor: user.isInvestor,
        is_homebuyer: user.isHomebuyer
      });
      
      console.log(`Created user: ${user.username}`);
    }

    // Insert properties
    console.log('Migrating properties...');
    for (const property of properties) {
      // Check if property already exists
      const existingProperty = await db.query.properties.findFirst({
        where: (properties, { eq, and }) => 
          and(
            eq(properties.title, property.title),
            eq(properties.address, property.address)
          )
      });
      
      if (existingProperty) {
        console.log(`Property "${property.title}" already exists, skipping...`);
        continue;
      }
      
      // Insert property with Drizzle
      await db.insert(tables.properties).values({
        title: property.title,
        address: property.address,
        city: property.city,
        state: property.state,
        zip_code: property.zipCode,
        price: property.price,
        price_per_sqft: property.pricePerSqft,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        square_feet: property.squareFeet,
        description: property.description,
        property_type: property.propertyType,
        image_url: property.imageUrl,
        available_tokens: property.availableTokens,
        minimum_investment: property.minimumInvestment,
        status: property.status
      });
      
      console.log(`Created property: ${property.title}`);
    }

    // Fetch created users and properties
    const createdUsers = await db.query.users.findMany();
    const createdProperties = await db.query.properties.findMany();

    // Create investments
    console.log('Migrating investments...');
    const investments = [
      {
        userUsername: 'investor1',
        propertyTitle: 'Modern Downtown Condo', 
        percentage: 10,
        amount: 60000,
        isOccupier: false
      },
      {
        userUsername: 'investor1',
        propertyTitle: 'Luxury Beachfront Villa',
        percentage: 5,
        amount: 60000,
        isOccupier: false
      },
      {
        userUsername: 'investor2',
        propertyTitle: 'Suburban Family Home',
        percentage: 15,
        amount: 67500,
        isOccupier: false
      }
    ];

    for (const investment of investments) {
      // Find user and property IDs
      const user = createdUsers.find(u => u.username === investment.userUsername);
      const property = createdProperties.find(p => p.title === investment.propertyTitle);
      
      if (!user || !property) {
        console.log(`Could not find user or property for investment: ${investment.userUsername} - ${investment.propertyTitle}`);
        continue;
      }
      
      // Check if investment already exists
      const existingInvestment = await db.query.investments.findFirst({
        where: (investments, { eq, and }) => 
          and(
            eq(investments.user_id, user.id),
            eq(investments.property_id, property.id)
          )
      });
      
      if (existingInvestment) {
        console.log(`Investment already exists for ${user.username} on ${property.title}, skipping...`);
        continue;
      }
      
      // Insert investment with Drizzle
      await db.insert(tables.investments).values({
        user_id: user.id,
        property_id: property.id,
        percentage: investment.percentage,
        amount: investment.amount,
        is_occupier: investment.isOccupier
      });
      
      console.log(`Created investment: ${user.username} - ${property.title}`);
    }

    // Create consultations
    console.log('Migrating consultations...');
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    const consultations = [
      {
        userUsername: 'investor1',
        propertyTitle: 'Suburban Family Home',
        type: 'investor',
        notes: 'Interested in investing in this property, need more information.',
        status: 'scheduled',
        scheduledDate: nextWeek
      },
      {
        userUsername: 'investor2',
        propertyTitle: 'Luxury Beachfront Villa',
        type: 'investor',
        notes: 'Looking to diversify portfolio with luxury properties.',
        status: 'scheduled',
        scheduledDate: threeDaysLater
      }
    ];

    for (const consultation of consultations) {
      // Find user and property IDs
      const user = createdUsers.find(u => u.username === consultation.userUsername);
      const property = createdProperties.find(p => p.title === consultation.propertyTitle);
      
      if (!user || !property) {
        console.log(`Could not find user or property for consultation: ${consultation.userUsername} - ${consultation.propertyTitle}`);
        continue;
      }
      
      // Check if consultation already exists
      const existingConsultation = await db.query.consultations.findFirst({
        where: (consultations, { eq, and }) => 
          and(
            eq(consultations.user_id, user.id),
            eq(consultations.property_id, property.id)
          )
      });
      
      if (existingConsultation) {
        console.log(`Consultation already exists for ${user.username} on ${property.title}, skipping...`);
        continue;
      }
      
      // Insert consultation with Drizzle
      await db.insert(tables.consultations).values({
        user_id: user.id,
        property_id: property.id,
        type: consultation.type,
        notes: consultation.notes,
        status: consultation.status,
        scheduled_date: consultation.scheduledDate
      });
      
      console.log(`Created consultation: ${user.username} - ${property.title}`);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close the database connection
    await queryClient.end();
  }
}

main().catch(console.error);