import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: 'Energy Ingestion Engine',
      version: '1.0.0',
    };
  }
}
