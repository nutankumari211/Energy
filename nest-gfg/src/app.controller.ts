import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return {
      status: 'ok',
      service: 'Energy Ingestion Engine',
      version: '1.0.0',
      endpoints: {
        ingestion: {
          meter: 'POST /v1/ingestion/meter',
          vehicle: 'POST /v1/ingestion/vehicle',
          correlate: 'POST /v1/ingestion/correlate',
        },
        analytics: {
          performance: 'GET /v1/analytics/performance/:vehicleId',
        },
      },
    };
  }
}
