# Energy Ingestion Engine

High-scale energy telemetry ingestion system for Smart Meters and EV Fleets built with NestJS and PostgreSQL.

## Overview

This system handles ingestion of energy data from two independent streams:
- **Smart Meter Stream**: AC power consumption from the utility grid
- **Vehicle Stream**: DC power delivery to EV batteries

The system processes **14.4 million records daily** (10,000+ devices × 2 streams × 1,440 minutes/day) and provides real-time analytics on power efficiency and vehicle performance.

## Architecture

### Database Strategy

The system uses a dual-storage pattern:

**Hot Store** (Operational Data)
- `meter_current_status` - Latest meter readings
- `vehicle_current_status` - Latest vehicle readings
- Updated via UPSERT for fast dashboard access

**Cold Store** (Historical Data)
- `meter_readings_history` - Append-only meter telemetry
- `vehicle_readings_history` - Append-only vehicle telemetry
- Optimized for time-range queries with composite indexes

**Correlation**
- `meter_vehicle_correlation` - Links meters to vehicles for analytics

### Performance Optimizations

- Composite indexes on `(entityId, timestamp)` for efficient time-range queries
- Separate hot/cold stores to prevent full table scans on dashboard queries
- Pre-computed correlations for fast meter-vehicle joins

## Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 15+

## Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start PostgreSQL
docker-compose up -d postgres

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

## Running the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Ingestion

#### `POST /v1/ingestion/meter`
Ingest meter reading data.

**Request:**
```json
{
  "meterId": "meter-001",
  "kwhConsumedAc": 150.5,
  "voltage": 240.0,
  "timestamp": "2026-02-11T10:30:00Z"
}
```

#### `POST /v1/ingestion/vehicle`
Ingest vehicle reading data.

**Request:**
```json
{
  "vehicleId": "vehicle-001",
  "soc": 85,
  "kwhDeliveredDc": 142.3,
  "batteryTemp": 25.5,
  "timestamp": "2026-02-11T10:30:00Z"
}
```

#### `POST /v1/ingestion/correlate`
Establish correlation between a meter and vehicle.

**Request:**
```json
{
  "meterId": "meter-001",
  "vehicleId": "vehicle-001"
}
```

### Analytics

#### `GET /v1/analytics/performance/:vehicleId`
Get 24-hour performance summary for a vehicle.

**Response:**
```json
{
  "vehicleId": "vehicle-001",
  "period": "24 hours",
  "totalKwhConsumedAc": 1500.5,
  "totalKwhDeliveredDc": 1420.3,
  "efficiencyRatio": 0.9465,
  "averageBatteryTemp": 24.8,
  "recordCount": 1440
}
```

**Efficiency Ratio**: `DC/AC`. Normal range: 0.85-0.95. Values below 0.85 indicate potential hardware faults.

## Database Schema

### Tables

- `meter_readings_history` - Historical meter data (indexed on `meterId`, `timestamp`)
- `vehicle_readings_history` - Historical vehicle data (indexed on `vehicleId`, `timestamp`)
- `meter_current_status` - Current meter state (primary key: `meterId`)
- `vehicle_current_status` - Current vehicle state (primary key: `vehicleId`)
- `meter_vehicle_correlation` - Meter-vehicle relationships (unique on `meterId`, `vehicleId`)

## Development

```bash
# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## Docker

```bash
# Start all services
docker-compose up

# Stop services
docker-compose down
```

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Application port (default: 3000)

## License

MIT
