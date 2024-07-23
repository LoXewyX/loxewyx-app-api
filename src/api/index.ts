import { Elysia } from 'elysia';
import auth from './routes/auth';
import message from './routes/message';

const routes = new Elysia()
  .group('/auth', (app) => app.use(auth))
  .group('/message', (app) => app.use(message));

export default routes;
