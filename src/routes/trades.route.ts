import { Router } from 'express';
import TradesController from '@controllers/trades.controller';
import { CreateTradeDto } from '@dtos/trades.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class TradesRoute implements Routes {
  public path = '/trades';
  public router = Router();
  public tradesController = new TradesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.tradesController.getTrades);
    this.router.get(`${this.path}/:id`, this.tradesController.getTradeById);
    this.router.post(`${this.path}/load`, this.tradesController.loadHistoricalTrades);
    this.router.post(`${this.path}`, validationMiddleware(CreateTradeDto, 'body'), this.tradesController.createTrade);
    this.router.put(`${this.path}/:id`, validationMiddleware(CreateTradeDto, 'body', true), this.tradesController.updateTrade);
    this.router.delete(`${this.path}/:id`, this.tradesController.deleteTrade);
  }
}

export default TradesRoute;
