import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsResponseDto } from '../dto/analytics-response.dto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getVehiclePerformance(vehicleId: string): Promise<AnalyticsResponseDto> {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const correlation = await this.prisma.meterVehicleCorrelation.findFirst({
      where: { vehicleId },
    });

    if (!correlation) {
      throw new NotFoundException(
        `No meter correlation found for vehicle ${vehicleId}. Please establish correlation first.`,
      );
    }

    const vehicleReadings = await this.prisma.vehicleReadingHistory.findMany({
      where: {
        vehicleId,
        timestamp: {
          gte: twentyFourHoursAgo,
          lte: now,
        },
      },
      select: {
        kwhDeliveredDc: true,
        batteryTemp: true,
        timestamp: true,
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    if (vehicleReadings.length === 0) {
      throw new NotFoundException(
        `No vehicle readings found for vehicle ${vehicleId} in the last 24 hours`,
      );
    }

    const meterReadings = await this.prisma.meterReadingHistory.findMany({
      where: {
        meterId: correlation.meterId,
        timestamp: {
          gte: twentyFourHoursAgo,
          lte: now,
        },
      },
      select: {
        kwhConsumedAc: true,
        timestamp: true,
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    const totalKwhDeliveredDc = vehicleReadings.reduce(
      (sum, reading) => sum + reading.kwhDeliveredDc,
      0,
    );

    const totalKwhConsumedAc = meterReadings.reduce(
      (sum, reading) => sum + reading.kwhConsumedAc,
      0,
    );

    const averageBatteryTemp =
      vehicleReadings.reduce((sum, reading) => sum + reading.batteryTemp, 0) /
      vehicleReadings.length;

    const efficiencyRatio =
      totalKwhConsumedAc > 0 ? totalKwhDeliveredDc / totalKwhConsumedAc : 0;

    return {
      vehicleId,
      period: '24 hours',
      totalKwhConsumedAc: Number(totalKwhConsumedAc.toFixed(4)),
      totalKwhDeliveredDc: Number(totalKwhDeliveredDc.toFixed(4)),
      efficiencyRatio: Number(efficiencyRatio.toFixed(4)),
      averageBatteryTemp: Number(averageBatteryTemp.toFixed(2)),
      recordCount: vehicleReadings.length,
    };
  }
}
