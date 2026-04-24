import { IsNumber, IsString, Min } from 'class-validator';

export class SetIncomeDto {
  @IsString()
  month: string;

  @IsNumber()
  @Min(0)
  amount: number;
}
