import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import validateEnv from '@utils/validateEnv';
import TradesRoute from './routes/trades.route';

validateEnv();

const app = new App([new IndexRoute(), new AuthRoute(), new TradesRoute()]);

app.listen();
