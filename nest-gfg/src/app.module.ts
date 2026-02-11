import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { IngestionModule } from './ingestion/ingestion.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [IngestionModule, AnalyticsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
