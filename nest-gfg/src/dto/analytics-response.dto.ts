export class AnalyticsResponseDto {
  vehicleId: string;
  period: string;
  totalKwhConsumedAc: number;
  totalKwhDeliveredDc: number;
  efficiencyRatio: number;
  averageBatteryTemp: number;
  recordCount: number;
}
