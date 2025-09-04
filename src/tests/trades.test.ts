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
    it('response Create Trade', async () => {
      const tradeData: CreateTradeDto = {
        "symbol": "BTCUSDT",
        "periodStart": 1757004127926,
      };

      const tradesRoute = new TradesRoute();
      const trades = tradesRoute.tradesController.tradeService.trades;

      trades.findOne = jest.fn().mockReturnValue(null);
      trades.create = jest.fn().mockReturnValue({
        _id: '60706478aad6c9ad19a31c84',
        email: tradeData.email,
        password: await bcrypt.hash(tradeData.password, 10),
      });

      (mongoose as any).connect = jest.fn();
      const app = new App([tradesRoute]);
      return request(app.getServer()).post(`${tradesRoute.path}`).send(tradeData).expect(201);
    });
  });
});
