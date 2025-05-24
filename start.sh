#!/bin/bash

# Start database
echo "Starting database..."
docker-compose up -d

# Start backend in background
echo "Starting backend..."
cd conecta-backend
npm run start:dev &
BACKEND_PID=$!

# Start frontend in background
echo "Starting frontend..."
cd ../conecta-front
npm run dev &
FRONTEND_PID=$!

# Wait for user to press Ctrl+C
echo "Services started. Press Ctrl+C to stop all services."
function cleanup() {
  echo "Stopping services..."
  kill $BACKEND_PID $FRONTEND_PID
  exit 0
}

trap cleanup SIGINT
wait 