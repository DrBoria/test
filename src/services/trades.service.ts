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

  public async getServerTime() {
    const serverTimeResponse = await axios.get(`${BINANCE_API_KEY}/time`);
    return serverTimeResponse.data.serverTime;
  }


  public analyzeTrades(trades: Trade[]): { change: number, changePercent: string | number } {
    if (trades.length < 2) {
      return { change: 0, changePercent: 0 }
    }

    const firstPrice = parseFloat(trades[0].p);
    const lastPrice = parseFloat(trades[trades.length - 1].p);

    const change = lastPrice - firstPrice;
    const changePercent = ((change / firstPrice) * 100).toFixed(2);

    return { change, changePercent }
  }

  public async loadAggTrades(symbol: string, fromId: number, startTime: number, endTime: number, limit: number): Promise<Trade[]> {
    const aggTradesResponse: { data: Trade[] } = await axios.get(`${BINANCE_API_KEY}/aggTrades`, {
      params: {
        symbol,
        limit,
        ...(fromId ? { fromId } : { startTime, endTime }),
      },
    });

    if (!aggTradesResponse?.data) {
      throw new HttpException(409, `Historical trades not found for provided symbol: ${symbol}`);
    }

    return aggTradesResponse.data;
  }

  public async loadBySymbolAndPeriod(symbol: string, periodStart?: number, periodEnd?: number): Promise<Trade[]> {
    let historicalTrades = [];
    let fromId;
    const limit = 1000;
    const serverTime = await this.getServerTime();
    const minEndTime = periodEnd ? Math.min(periodEnd, serverTime) : serverTime;

    if (periodStart > serverTime) {
      throw new HttpException(400, "period is in the future");
    }

    while (true) {
      const trades = await this.loadAggTrades(symbol, fromId, periodStart, minEndTime, limit);
      if (!trades.length) {
        break;
      }
      const filteredTrades = trades.filter((trade) => trade.T >= periodStart && trade.T <= minEndTime);

      historicalTrades.push(...filteredTrades);

      const oldestTradeTime = trades[0].T;
      if (oldestTradeTime <= periodStart || trades.length < limit) {
        break;
      }

      fromId = trades[0].a - 1;
    }


    if (!historicalTrades) {
      throw new HttpException(409, `Historical trades not found for provided symbol: ${symbol}`);
    }

    return historicalTrades;
  }

  public async bulkCreateTrade(tradeData: CreateTradeDto[]): Promise<Trade[]> {
    if (isEmpty(tradeData)) throw new HttpException(400, "tradeData is empty");

    let newTradingData = tradeData;
    const findExisting: Trade[] = await this.trades.find({ a: { $in: tradeData.map((item) => item.a) } });

    if (findExisting.length) {
      newTradingData = tradeData.filter((tradeData) => !findExisting.find((item) => item.a === tradeData.a));
    }

    const createdTradingData = this.trades.insertMany(newTradingData);

    return createdTradingData;
  }

}

export default TradeService;
