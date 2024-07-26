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

interface User {
  id: string;
  name: string;
}

interface RequestMessage {
  type: string;
  body: string;
}

interface Body {
  user: { id: string; name: string };
  date: string;
  text: string;
}

let user: User;
let users: { [key: string]: { id: string; name: string } } = {};
let messages: Body[] = [];

const websocketRoutes = new Elysia({ prefix: '/ws' }).ws('/room', {
  open(ws) {
    console.log(`  [User ${user.id} (${ws.id}) was connected]`);
    ws.subscribe('room');
  },
  async message(ws, message) {
    const msg = message as RequestMessage;
    switch (msg.type) {
      case 'connected':
        user = msg.body as unknown as User;
        users[ws.id] = { id: user!.id, name: user!.alias };
        ws.publish(
          'room',
          JSON.stringify({
            type: 'connected',
            body: { currUser: users[ws.id].id, users, messages },
          })
        );
        break;
      case 'send':
        if (!users[ws.id]) {
          console.error(`  [User ${ws.id} not found!]`);
          return;
        }
        const newMessage = {
          user: users[ws.id],
          date: new Date().toISOString(),
          text: msg.body as string,
        };

        const set = { status: 200 };

        try {
          const result = await addMessage(set, {
            user_id: users[ws.id].id,
            content: msg.body as string,
          });

          if (typeof result === 'string') {
            console.error(`Failed to save message: ${result}`);
          } else {
            const savedMessage = result;
            messages.push({
              user: users[ws.id],
              date: savedMessage.created_at?.toISOString() || newMessage.date,
              text: savedMessage.content,
            });
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
    console.log(`  [User ${user.id} (${ws.id}) was disconnected]`);
  },
});

export default websocketRoutes;
