# PropFi Database Scripts

This directory contains scripts to help you set up and manage the PostgreSQL database for the PropFi platform.

## Files Overview

- `create-tables.sql` - SQL script to create all necessary database tables
- `seed-data.sql` - SQL script to populate tables with initial sample data
- `setup-database.sh` - Shell script to run the SQL scripts and set up the database
- `migrate-to-postgres.js` - Node.js script to migrate data from in-memory storage to PostgreSQL

## Prerequisites

- PostgreSQL database (already set up via Replit's PostgreSQL database tool)
- Environment variables must be configured:
  - `DATABASE_URL`
  - `PGUSER`
  - `PGPASSWORD`
  - `PGDATABASE`
  - `PGHOST`
  - `PGPORT`

## Database Setup Steps

### Method 1: Using the setup script (recommended)

1. Make the script executable (if not already):
   ```bash
   chmod +x db-scripts/setup-database.sh
   ```

2. Run the script:
   ```bash
   ./db-scripts/setup-database.sh
   ```

This will create all tables and seed them with initial data.

### Method 2: Using individual SQL scripts

1. Create the database tables:
   ```bash
   psql -h $PGHOST -p $PGPORT -d $PGDATABASE -U $PGUSER -f db-scripts/create-tables.sql
   ```

2. Seed the database with initial data:
   ```bash
   psql -h $PGHOST -p $PGPORT -d $PGDATABASE -U $PGUSER -f db-scripts/seed-data.sql
   ```

### Method 3: Using Node.js migration script

This method uses Drizzle ORM to migrate the data from in-memory storage to PostgreSQL:

1. Install required dependencies:
   ```bash
   npm install drizzle-orm postgres
   ```

2. Run the migration script:
   ```bash
   node db-scripts/migrate-to-postgres.js
   ```

## Database Schema

The PropFi platform consists of the following tables:

1. `users` - User accounts with different roles (investor, developer, admin)
2. `properties` - Property listings available for fractional investment
3. `investments` - Records of user investments in properties
4. `token_transactions` - History of property token sales between users
5. `consultations` - Property consultation appointments

## Default Test Accounts

The seeding script creates the following test accounts:

| Username   | Password    | Role      | Email               |
|------------|-------------|-----------|---------------------|
| investor1  | password123 | investor  | john@example.com    |
| investor2  | password123 | investor  | sara@example.com    |
| developer1 | password123 | developer | alex@example.com    |
| admin1     | password123 | admin     | admin@example.com   |

**IMPORTANT**: These are sample accounts for development and testing only. Do not use these credentials in production.