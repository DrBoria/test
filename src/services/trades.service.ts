import { hash } from 'bcrypt';
import axios from 'axios';
import { CreateTradeDto } from '@dtos/trades.dto';
import { HttpException } from '@exceptions/HttpException';
import { Trade } from '@interfaces/trades.interface';
import tradeModel from '@models/trades.model';
import { isEmpty } from '@utils/util';
import { BINANCE_API_KEY } from '@/config';

class TradeService {
  public trades = tradeModel;

  public async findAllTrade(): Promise<Trade[]> {
    const trades: Trade[] = await this.trades.find();
    return trades;
  }

  public async findTradeById(tradeId: string): Promise<Trade> {
    if (isEmpty(tradeId)) throw new HttpException(400, "TradeId is empty");

    const findTrade: Trade = await this.trades.findOne({ _id: tradeId });
    if (!findTrade) throw new HttpException(409, "Trade doesn't exist");

    return findTrade;
  }

  public async loadTrades(symbol: string, limit: number, fromId: number): Promise<Trade[]> {
    const historicalTradesResponse: { data: Trade[] } = await axios.get(`${BINANCE_API_KEY}/historicalTrades`, {
      params: {
        symbol,
        limit,
        fromId,
      },
    });

    if (!historicalTradesResponse?.data) {
      throw new HttpException(409, `Historical trades not found for provided symbol: ${symbol}`);
    }

    return historicalTradesResponse.data;
  }

  public async loadBySymbolAndPeriod(symbol: string, periodStart?: number, periodEnd?: number): Promise<Trade[]> {
    const historicalTradesResponse: { data: Trade[] } = await axios.get(`${BINANCE_API_KEY}/historicalTrades`, {
      params: {
        symbol,
        startTime: periodStart,
        endTime: periodEnd,
      },
    });

    if (!historicalTradesResponse?.data) {
      throw new HttpException(409, `Historical trades not found for provided symbol: ${symbol}`);
    }

    return historicalTradesResponse.data;
  }

  public async createTrade(tradeData: CreateTradeDto): Promise<Trade> {
    if (isEmpty(tradeData)) throw new HttpException(400, "tradeData is empty");

    const findTrade: Trade = await this.trades.findOne({ email: tradeData.email });
    if (findTrade) throw new HttpException(409, `This email ${tradeData.email} already exists`);

    const hashedPassword = await hash(tradeData.password, 10);
    const createTradeData: Trade = await this.trades.create({ ...tradeData, password: hashedPassword });

    return createTradeData;
  }

  public async bulkCreateTrade(tradeData: CreateTradeDto[]): Promise<Trade[]> {
    if (isEmpty(tradeData)) throw new HttpException(400, "tradeData is empty");

    let newTradingData = tradeData;
    const findExisting: Trade[] = await this.trades.find({ externalId: { $in: tradeData.map((item) => item.externalId) } });

    if (findExisting.length) {
      newTradingData = tradeData.filter((tradeData) => !findExisting.find((item) => item.externalId === tradeData.externalId));
    }

    const createdTradingData = this.trades.insertMany(newTradingData);

    return createdTradingData;
  }

  public async updateTrade(tradeId: string, tradeData: CreateTradeDto): Promise<Trade> {
    if (isEmpty(tradeData)) throw new HttpException(400, "tradeData is empty");

    if (tradeData.email) {
      const findTrade: Trade = await this.trades.findOne({ email: tradeData.email });
      if (findTrade && findTrade._id != tradeId) throw new HttpException(409, `This email ${tradeData.email} already exists`);
    }

    if (tradeData.password) {
      const hashedPassword = await hash(tradeData.password, 10);
      tradeData = { ...tradeData, password: hashedPassword };
    }

    const updateTradeById: Trade = await this.trades.findByIdAndUpdate(tradeId, { tradeData });
    if (!updateTradeById) throw new HttpException(409, "Trade doesn't exist");

    return updateTradeById;
  }

  public async deleteTrade(tradeId: string): Promise<Trade> {
    const deleteTradeById: Trade = await this.trades.findByIdAndDelete(tradeId);
    if (!deleteTradeById) throw new HttpException(409, "Trade doesn't exist");

    return deleteTradeById;
  }
}

export default TradeService;
