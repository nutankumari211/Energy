import { IsString, IsNumber, IsDateString, IsNotEmpty } from 'class-validator';

export class MeterReadingDto {
  @IsString()
  @IsNotEmpty()
  meterId: string;

  @IsNumber()
  @IsNotEmpty()
  kwhConsumedAc: number;

  @IsNumber()
  @IsNotEmpty()
  voltage: number;

  @IsDateString()
  @IsNotEmpty()
  timestamp: string;
}
