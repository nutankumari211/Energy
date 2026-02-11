import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { MeterReadingDto } from '../dto/meter-reading.dto';
import { VehicleReadingDto } from '../dto/vehicle-reading.dto';

@Controller('v1/ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('meter')
  @HttpCode(HttpStatus.ACCEPTED)
  async ingestMeter(@Body() dto: MeterReadingDto) {
    return this.ingestionService.ingestMeterReading(dto);
  }

  @Post('vehicle')
  @HttpCode(HttpStatus.ACCEPTED)
  async ingestVehicle(@Body() dto: VehicleReadingDto) {
    return this.ingestionService.ingestVehicleReading(dto);
  }

  @Post('correlate')
  @HttpCode(HttpStatus.CREATED)
  async correlate(
    @Body() body: { meterId: string; vehicleId: string },
  ) {
    return this.ingestionService.correlateMeterVehicle(
      body.meterId,
      body.vehicleId,
    );
  }
}
