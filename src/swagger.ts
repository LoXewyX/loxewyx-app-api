import { swagger } from '@elysiajs/swagger';

const swaggerConfig = swagger({
  path: '/swagger',
  documentation: {
    info: {
      title: 'Ekilox API',
      version: '1.0.0',
    },
    tags: [
      {
        name: 'Auth',
        description:
          'Handle users and their creation and authentication, including login, registration, and user management.',
      },
      {
        name: 'Messages',
        description:
          'Handle messages and their creation, including sending, receiving, and listing messages.',
      },
    ],
  },
});

export default swaggerConfig;
