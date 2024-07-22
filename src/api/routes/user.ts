import { Elysia, t } from 'elysia';
import {
  createUser,
  deleteUser,
  getAuth,
  getUser,
  getUsers,
  updateUser,
} from '../controllers/user';

const userRoutes = new Elysia()
  .get('/', ({ set }) => getUsers(set as { status: number }), {
    detail: {
      summary: 'Get all users',
      tags: ['Users'],
      responses: {
        '200': {
          description: 'Returns a list of all users',
        },
        '500': {
          description: 'Internal server error',
        },
      },
    },
  })
  .get('/auth', ({ set }) => getAuth(set as { status: number }), {
    detail: {
      summary: 'Get all auths',
      tags: ['Users'],
      responses: {
        '200': {
          description: 'Returns a list of all auths',
        },
        '500': {
          description: 'Internal server error',
        },
      },
    },
  })
  .get(
    '/:id',
    ({ set, params: { id } }) => getUser(set as { status: number }, id),
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        summary: 'Get user by id',
        tags: ['Users'],
        responses: {
          '200': {
            description: 'Returns a specific user identified by their id',
          },
          '404': {
            description: 'This can happen due to the non-existence of the user',
          },
          '500': {
            description: 'Internal server error',
          },
        },
      },
    }
  )
  .post('/', ({ set, body }) => createUser(set as { status: number }, body), {
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
      full_name: t.String({
        minLength: 1,
        maxLength: 100,
        error: 'Full name must contain between 1 - 100 characters',
      }),
    }),
    detail: {
      summary: 'Create user',
      tags: ['Users'],
      responses: {
        '201': {
          description: 'Returns that the user was created',
        },
        '403': {
          description:
            'This can happen due to the presence of an already existing username or email',
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
  .patch(
    '/:id',
    ({ set, params: { id }, body }) =>
      updateUser(set as { status: number }, id, body),
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object(
        {
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
          full_name: t.String({
            minLength: 1,
            maxLength: 100,
            error: 'Full name must contain between 1 - 100 characters',
          }),
        },
        {
          minProperties: 1,
        }
      ),
      detail: {
        summary: 'Update user',
        tags: ['Users'],
        responses: {
          '200': {
            description: 'Returns that the user was updated',
          },
          '403': {
            description:
              'This can happen due to insufficient password complexity or non-existing email',
          },
          '500': {
            description: 'Internal server error',
          },
        },
      },
    }
  )
  .delete(
    '/:id',
    ({ set, params: { id } }) => deleteUser(set as { status: number }, id),
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        summary: 'Delete user',
        tags: ['Users'],
        responses: {
          '200': {
            description: 'Returns the user was deleted',
          },
          '404': {
            description: 'This can happen due to the non-existence of the user',
          },
          '500': {
            description: 'Internal server error',
          },
        },
      },
    }
  );

export default userRoutes;
