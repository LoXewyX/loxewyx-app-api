import { swagger } from '@elysiajs/swagger';

const swaggerConfig = swagger({
  path: '/swagger',
  documentation: {
    info: {
      title: 'Ekilox API',
      version: '1.0.0',
    },
    tags: [{ name: 'Auth', description: 'Authenticate users' }],
  },
});

export default swaggerConfig;
