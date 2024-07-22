import { Elysia } from 'elysia';
// import user from './routes/user';
import auth from './routes/auth';

const routes = new Elysia()
  // .group('/users', (app) => app.use(user))
  .group('/auth', (app) => app.use(auth));

export default routes;
