import { NextFunction, Request, Response } from 'express';
import { Trade } from '@interfaces/trades.interface';
import tradeService from '@services/trades.service';

class TradesController {
  public tradeService = new tradeService();

  public getTrades = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllTradesData: Trade[] = await this.tradeService.findAllTrade();

      res.status(200).json({ data: findAllTradesData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getTradeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tradeId: string = req.params.id;
      const findOneTradeData: Trade = await this.tradeService.findTradeById(tradeId);

      res.status(200).json({ data: findOneTradeData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public loadHistoricalTrades = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { symbol, periodStart, periodEnd } = req.body;

      const findOneTradeData: Trade[] = await this.tradeService.loadBySymbolAndPeriod(symbol, periodStart, periodEnd);

      const analyzeData = this.tradeService.analyzeTrades(findOneTradeData);
      const createdTradingData = await this.tradeService.bulkCreateTrade(findOneTradeData);

      res.status(200).json({ data: { analyzeData, createdTradingData, }, message: 'loaded data' });
    } catch (error) {
      next(error);
    }
  };
}

export default TradesController;
