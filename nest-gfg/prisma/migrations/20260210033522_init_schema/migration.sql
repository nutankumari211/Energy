-- CreateTable
CREATE TABLE "meter_readings_history" (
    "id" BIGSERIAL NOT NULL,
    "meterId" TEXT NOT NULL,
    "kwhConsumedAc" DOUBLE PRECISION NOT NULL,
    "voltage" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meter_readings_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_readings_history" (
    "id" BIGSERIAL NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "soc" INTEGER NOT NULL,
    "kwhDeliveredDc" DOUBLE PRECISION NOT NULL,
    "batteryTemp" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicle_readings_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meter_current_status" (
    "meterId" TEXT NOT NULL,
    "lastKwhAc" DOUBLE PRECISION NOT NULL,
    "lastVoltage" DOUBLE PRECISION NOT NULL,
    "lastSeen" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meter_current_status_pkey" PRIMARY KEY ("meterId")
);

-- CreateTable
CREATE TABLE "vehicle_current_status" (
    "vehicleId" TEXT NOT NULL,
    "currentSoc" INTEGER NOT NULL,
    "lastKwhDc" DOUBLE PRECISION NOT NULL,
    "lastTemp" DOUBLE PRECISION NOT NULL,
    "lastSeen" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicle_current_status_pkey" PRIMARY KEY ("vehicleId")
);

-- CreateIndex
CREATE INDEX "meter_readings_history_meterId_timestamp_idx" ON "meter_readings_history"("meterId", "timestamp");

-- CreateIndex
CREATE INDEX "vehicle_readings_history_vehicleId_timestamp_idx" ON "vehicle_readings_history"("vehicleId", "timestamp");
