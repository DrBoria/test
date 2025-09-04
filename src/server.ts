import App from '@/app';
import validateEnv from '@utils/validateEnv';
import TradesRoute from './routes/trades.route';

validateEnv();

const app = new App([new TradesRoute()]);

app.listen();
