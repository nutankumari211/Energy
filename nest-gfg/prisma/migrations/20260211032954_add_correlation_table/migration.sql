/*
  Warnings:

  - Added the required column `updatedAt` to the `meter_current_status` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `vehicle_current_status` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "meter_current_status" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "vehicle_current_status" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "meter_vehicle_correlation" (
    "id" BIGSERIAL NOT NULL,
    "meterId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meter_vehicle_correlation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "meter_vehicle_correlation_meterId_idx" ON "meter_vehicle_correlation"("meterId");

-- CreateIndex
CREATE INDEX "meter_vehicle_correlation_vehicleId_idx" ON "meter_vehicle_correlation"("vehicleId");

-- CreateIndex
CREATE UNIQUE INDEX "meter_vehicle_correlation_meterId_vehicleId_key" ON "meter_vehicle_correlation"("meterId", "vehicleId");

-- CreateIndex
CREATE INDEX "meter_readings_history_timestamp_idx" ON "meter_readings_history"("timestamp");

-- CreateIndex
CREATE INDEX "vehicle_readings_history_timestamp_idx" ON "vehicle_readings_history"("timestamp");
