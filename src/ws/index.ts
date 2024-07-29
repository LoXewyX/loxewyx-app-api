import { Elysia } from 'elysia';
import { addMessage } from '../api/controllers/message';

interface User {
  id: string;
  alias: string;
  email: string;
  password: string;
  full_name: string;
  created_at: Date;
  updated_at: Date;
}

interface RequestMessage {
  type: string;
  body: string | User;
}

interface Body {
  user_id: string;
  user_alias: string;
  date: string;
  text: string;
}

let user: User | null = null;
let users: { [key: string]: { id: string; alias: string } } = {};
let messages: Body[] = [];

const websocketRoutes = new Elysia({ prefix: '/ws' }).ws('/room', {
  open(ws) {
    ws.subscribe('room');
  },
  async message(ws, message) {
    const msg = message as RequestMessage;
    switch (msg.type) {
      case 'connected':
        user = msg.body as User;
        if (!user) return;
        console.log(`  [User ID=${user.id}, WS=${ws.id} was connected]`);
        users[ws.id] = { id: user.id, alias: user.alias };
        ws.publish(
          'room',
          JSON.stringify({
            type: 'connected',
            body: { currUser: users[ws.id], users, messages },
          })
        );
        break;

      case 'send':
        if (!users[ws.id]) {
          console.error(`  [User ${ws.id} not found!]`);
          return;
        }

        const set = { status: 200 };

        try {
          const result = await addMessage(set, {
            user_id: users[ws.id].id,
            content: msg.body as string,
          });

          if (typeof result !== 'string') {
            const newMessage = {
              user_id: result.user_id,
              user_alias: result.user.alias,
              date: new Date().toISOString(),
              text: msg.body as string,
            };
            messages.push(newMessage);
            ws.publish(
              'room',
              JSON.stringify({
                type: 'message',
                body: newMessage,
              })
            );
          }
        } catch (e) {
          console.error(
            `Failed to save message: ${
              e instanceof Error ? e.message : 'Unknown error'
            }`
          );
        }
        break;
    }
  },
  close(ws) {
    delete users[ws.id];
    ws.publish(
      'room',
      JSON.stringify({ type: 'update', body: { users, messages } })
    );
    console.log(`  [User ID=${user ? user.id : 'undefined'}, WS=${ws.id} was disconnected]`);
  },
});

export default websocketRoutes;
