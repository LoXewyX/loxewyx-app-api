import { Elysia, t } from 'elysia';
import { addMessage, getAllMessages } from '../controllers/message';

const messageRoutes = new Elysia()
  .get('/', ({ set }) => getAllMessages(set as { status: number }), {
    detail: {
      summary: 'Get all messages',
      tags: ['Messages'],
      responses: {
        '200': {
          description: 'Returns a list of all messages',
        },
        '500': {
          description: 'Internal server error',
        },
      },
    },
  })
  .post('/', ({ set, body }) => addMessage(set as { status: number }, body), {
    body: t.Object({
      user_id: t.String({
        minLength: 1,
        error: 'User ID is required',
      }),
      content: t.String({
        minLength: 1,
        error: 'Content is required',
      }),
    }),
    detail: {
      summary: 'Create message',
      tags: ['Messages'],
      responses: {
        '201': {
          description: 'Returns that the message was created',
        },
        '500': {
          description: 'Internal server error',
        },
      },
    },
  });

export default messageRoutes;
