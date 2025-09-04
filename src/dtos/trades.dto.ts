import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateTradeDto {
  @IsNumber()
  public a: number;
  @IsString()
  public p: string;
  @IsString()
  public q: string;
  @IsNumber()
  public f: number;
  @IsNumber()
  public l: number;
  @IsNumber()
  public T: number;
  @IsBoolean()
  public m: boolean;
  @IsBoolean()
  public M: boolean;
}
