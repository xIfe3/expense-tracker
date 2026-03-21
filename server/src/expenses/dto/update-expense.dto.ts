import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateExpenseDto {
  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsNumber()
  @IsOptional()
  categoryId?: number;
}
