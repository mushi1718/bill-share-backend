#!/bin/bash

# Script to run migrations in a new ephemeral container
echo "Running migrations in a new container..."
docker compose run --rm turtlehub-backend npm run migration:run:prod

# Check exit status
if [ $? -eq 0 ]; then
  echo "Migrations completed successfully."
else
  echo "Error: Migrations failed."
  exit 1
fi
