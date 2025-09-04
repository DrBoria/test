import { NextFunction, Request, Response } from 'express';
import { CreateTradeDto } from '@dtos/trades.dto';
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
      const { symbol, periodStart, periodEnd = (new Date()).getTime() } = req.body;

      const findOneTradeData: Trade[] = await this.tradeService.loadBySymbolAndPeriod(symbol, periodStart, periodEnd);
      const createdTradingData = await this.tradeService.bulkCreateTrade(findOneTradeData);

      res.status(200).json({ data: createdTradingData, message: 'loaded data' });
    } catch (error) {
      next(error);
    }
  };

  public createTrade = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tradeData: CreateTradeDto = req.body;
      const createTradeData: Trade = await this.tradeService.createTrade(tradeData);

      res.status(201).json({ data: createTradeData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateTrade = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tradeId: string = req.params.id;
      const tradeData: CreateTradeDto = req.body;
      const updateTradeData: Trade = await this.tradeService.updateTrade(tradeId, tradeData);

      res.status(200).json({ data: updateTradeData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteTrade = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tradeId: string = req.params.id;
      const deleteTradeData: Trade = await this.tradeService.deleteTrade(tradeId);

      res.status(200).json({ data: deleteTradeData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default TradesController;
