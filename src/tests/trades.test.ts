import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import request from 'supertest';
import App from '@/app';
import { CreateTradeDto } from '@dtos/trades.dto';
import TradesRoute from '@routes/trades.route';

beforeAll(async () => {
  jest.setTimeout(10000);
});
afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Trades', () => {
  describe('[GET] /trades', () => {
    it('response findAll Trades', async () => {
      const tradesRoute = new TradesRoute();
      const trades = tradesRoute.tradesController.tradeService.trades;

      trades.find = jest.fn().mockReturnValue([
        {
          _id: 'qpwoeiruty',
          email: 'a@email.com',
          password: await bcrypt.hash('q1w2e3r4!', 10),
        },
        {
          _id: 'alskdjfhg',
          email: 'b@email.com',
          password: await bcrypt.hash('a1s2d3f4!', 10),
        },
        {
          _id: 'zmxncbv',
          email: 'c@email.com',
          password: await bcrypt.hash('z1x2c3v4!', 10),
        },
      ]);

      (mongoose as any).connect = jest.fn();
      const app = new App([tradesRoute]);

      return request(app.getServer()).get(`${tradesRoute.path}`).expect(200);
    });
  });

  describe('[GET] /trades/:id', () => {
    it('response findOne Trade', async () => {
      const tradeId = 'qpwoeiruty';

      const tradesRoute = new TradesRoute();
      const trades = tradesRoute.tradesController.tradeService.trades;

      trades.findOne = jest.fn().mockReturnValue({
        _id: 'qpwoeiruty',
        email: 'a@email.com',
        password: await bcrypt.hash('q1w2e3r4!', 10),
      });

      (mongoose as any).connect = jest.fn();
      const app = new App([tradesRoute]);
      return request(app.getServer()).get(`${tradesRoute.path}/${tradeId}`).expect(200);
    });
  });

  describe('[POST] /trades/load', () => {
    it('response Creates and Analyses Trade', async () => {
      const tradeData = {
        "symbol": "BTCUSDT",
        "periodStart": 1757004127926,
      };

      const mockedTrades = [
        {
          "a": 26129,
          "p": "12623.14000000",
          "q": "0.05329300",
          "f": 26128,
          "l": 26129,
          "T": 1757004127916,
          "m": true,
          "M": true
        },
        {
          "a": 26130,
          "p": "42623.14000000",
          "q": "0.05329300",
          "f": 26128,
          "l": 26129,
          "T": 1757004127926,
          "m": true,
          "M": true
        },
        {
          "a": 26131,
          "p": "32623.14000000",
          "q": "0.05329300",
          "f": 26128,
          "l": 26129,
          "T": 1757004127326,
          "m": true,
          "M": true
        }
      ]

      const tradesRoute = new TradesRoute();
      const tradesService = tradesRoute.tradesController.tradeService;

      tradesService.loadBySymbolAndPeriod = jest.fn().mockReturnValue(mockedTrades);
      tradesService.bulkCreateTrade = jest.fn().mockReturnValue(mockedTrades);
      tradesService.analyzeTrades = jest.fn();

      (mongoose as any).connect = jest.fn();

      const app = new App([tradesRoute]);
      const response = request(app.getServer()).post(`${tradesRoute.path}/load`).send(tradeData).expect(200);
      await response;

      expect(tradesService.loadBySymbolAndPeriod).toBeCalledWith(tradeData.symbol, tradeData.periodStart, undefined);
      expect(tradesService.analyzeTrades).toBeCalledWith(mockedTrades);
      expect(tradesService.bulkCreateTrade).toBeCalledWith(mockedTrades);

      return response
    });
  });
});
