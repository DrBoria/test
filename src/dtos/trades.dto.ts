import { IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateTradeDto {
  @IsNumber()
  public externalId: number;
  @IsNumber()
  public price: number;
  @IsNumber()
  public qty: number;
  @IsNumber()
  public quoteQty: number;
  @IsNumber()
  public time: number;
  @IsBoolean()
  public isBuyerMaker: boolean;
  @IsBoolean()
  public isBestMatch: boolean;
}
