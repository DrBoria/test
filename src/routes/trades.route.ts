import { Router } from 'express';
import TradesController from '@controllers/trades.controller';
import { Routes } from '@interfaces/routes.interface';

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
  }
}

export default TradesRoute;
