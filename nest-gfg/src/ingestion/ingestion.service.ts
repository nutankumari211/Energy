import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MeterReadingDto } from '../dto/meter-reading.dto';
import { VehicleReadingDto } from '../dto/vehicle-reading.dto';

@Injectable()
export class IngestionService {
  constructor(private prisma: PrismaService) {}

  async ingestMeterReading(dto: MeterReadingDto) {
    const timestamp = new Date(dto.timestamp);

    await this.prisma.meterReadingHistory.create({
      data: {
        meterId: dto.meterId,
        kwhConsumedAc: dto.kwhConsumedAc,
        voltage: dto.voltage,
        timestamp: timestamp,
      },
    });

    await this.prisma.meterCurrentStatus.upsert({
      where: { meterId: dto.meterId },
      update: {
        lastKwhAc: dto.kwhConsumedAc,
        lastVoltage: dto.voltage,
        lastSeen: timestamp,
        updatedAt: new Date(),
      },
      create: {
        meterId: dto.meterId,
        lastKwhAc: dto.kwhConsumedAc,
        lastVoltage: dto.voltage,
        lastSeen: timestamp,
        updatedAt: new Date(),
      },
    });

    return { success: true, meterId: dto.meterId };
  }

  async ingestVehicleReading(dto: VehicleReadingDto) {
    const timestamp = new Date(dto.timestamp);

    await this.prisma.vehicleReadingHistory.create({
      data: {
        vehicleId: dto.vehicleId,
        soc: dto.soc,
        kwhDeliveredDc: dto.kwhDeliveredDc,
        batteryTemp: dto.batteryTemp,
        timestamp: timestamp,
      },
    });

    await this.prisma.vehicleCurrentStatus.upsert({
      where: { vehicleId: dto.vehicleId },
      update: {
        currentSoc: dto.soc,
        lastKwhDc: dto.kwhDeliveredDc,
        lastTemp: dto.batteryTemp,
        lastSeen: timestamp,
        updatedAt: new Date(),
      },
      create: {
        vehicleId: dto.vehicleId,
        currentSoc: dto.soc,
        lastKwhDc: dto.kwhDeliveredDc,
        lastTemp: dto.batteryTemp,
        lastSeen: timestamp,
        updatedAt: new Date(),
      },
    });

    return { success: true, vehicleId: dto.vehicleId };
  }

  async correlateMeterVehicle(meterId: string, vehicleId: string) {
    const existing = await this.prisma.meterVehicleCorrelation.findFirst({
      where: {
        meterId,
        vehicleId,
      },
    });

    if (!existing) {
      await this.prisma.meterVehicleCorrelation.create({
        data: {
          meterId,
          vehicleId,
        },
      });
    }

    return { success: true, meterId, vehicleId };
  }
}
