import Elysia, { t } from 'elysia';
import { auth, login, signup } from '../controllers/auth';

const authRoutes = new Elysia()
  .post('/signup', ({ set, body }) => signup(set as { status: number }, body), {
    body: t.Object({
      alias: t.String({
        minLength: 3,
        maxLength: 50,
        error: 'Alias must contain between 3 - 50 characters',
      }),
      email: t.String({
        format: 'email',
        error: 'Bad email',
      }),
      password: t.String({
        minLength: 8,
        error: 'Password must be at least 8 characters long',
      }),
      fullName: t.String({
        minLength: 1,
        maxLength: 100,
        error: 'Full name must contain between 1 - 100 characters',
      }),
    }),
    detail: {
      summary: 'Signup a new user',
      tags: ['Auth'],
      responses: {
        '201': {
          description: 'User created and auth code returned',
        },
        '409': {
          description: 'Alias or Email already exists',
        },
        '500': {
          description: 'Internal server error',
        },
      },
    },
  })
  .post('/login', ({ set, body }) => login(set as { status: number }, body), {
    body: t.Object({
      identifier: t.String({
        minLength: 3,
        maxLength: 50,
        error: 'Identifier must contain between 3 - 50 characters',
      }),
      password: t.String({
        minLength: 8,
        error: 'Password must be at least 8 characters long',
      }),
    }),
    detail: {
      summary: 'Login user',
      tags: ['Auth'],
      responses: {
        '200': {
          description: 'Login successful and auth code returned',
        },
        '401': {
          description: 'Invalid identifier or password',
        },
        '500': {
          description: 'Internal server error',
        },
      },
    },
  })
  .post('/auth', ({ set, body }) => auth(set as { status: number }, body), {
    body: t.Object({
      email: t.String({
        format: 'email',
        error: 'Bad email',
      }),
      authCode: t.String({
        format: 'uuid',
        error: 'Auth code must be a valid UUID',
      }),
    }),
    detail: {
      summary: 'Authenticate user with email and auth code',
      tags: ['Auth'],
      responses: {
        '200': {
          description: 'Authentication successful',
        },
        '401': {
          description: 'Invalid email or auth code',
        },
        '500': {
          description: 'Internal server error',
        },
      },
    },
  });

export default authRoutes;
