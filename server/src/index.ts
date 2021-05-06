import Cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import router from './controllers';

const app = new Koa();

app.use(Cors({ origin: (ctx) => ctx.header.origin ?? '*', credentials: true }));
app.use(bodyParser());
app.use(router.routes());

const port = (process.env.NODE_ENV === 'test') ? 9001 : 9000;

const server = app.listen(port);
console.log(`Server started listening on port ${port}`);

export default server;
