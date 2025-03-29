#!/bin/bash

# This script sets up the PropFi database with tables and seed data

# Check if environment variables are available
if [ -z "$PGUSER" ] || [ -z "$PGPASSWORD" ] || [ -z "$PGDATABASE" ] || [ -z "$PGHOST" ] || [ -z "$PGPORT" ]; then
  echo "Error: Database environment variables are not set."
  echo "Make sure PGUSER, PGPASSWORD, PGDATABASE, PGHOST, and PGPORT are set."
  exit 1
fi

echo "Setting up PropFi database..."

# Execute the create-tables.sql script
echo "Creating database tables..."
psql -h $PGHOST -p $PGPORT -d $PGDATABASE -U $PGUSER -f db-scripts/create-tables.sql

# Check if table creation was successful
if [ $? -eq 0 ]; then
  echo "Tables created successfully."
else
  echo "Error: Failed to create tables."
  exit 1
fi

# Execute the seed-data.sql script
echo "Seeding database with initial data..."
psql -h $PGHOST -p $PGPORT -d $PGDATABASE -U $PGUSER -f db-scripts/seed-data.sql

# Check if data seeding was successful
if [ $? -eq 0 ]; then
  echo "Data seeded successfully."
else
  echo "Error: Failed to seed data."
  exit 1
fi

echo "Database setup complete!"

# Optional: dump the database structure
echo "Dumping database structure..."
pg_dump -h $PGHOST -p $PGPORT -d $PGDATABASE -U $PGUSER --schema-only > db-scripts/schema-dump.sql

echo "Database structure dumped to db-scripts/schema-dump.sql"
echo "PropFi database is ready for use."