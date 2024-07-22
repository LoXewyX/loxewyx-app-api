import { Elysia } from 'elysia';
import { addMessage } from '../api/controllers/message';

interface User {
  id: string;
  name: string;
}

interface Message {
  type: string;
  body: string;
}

interface Body {
  user: User;
  date: string;
  text: string;
}

let users: { [key: string]: User } = {};
let messages: Body[] = [];

const websocketRoutes = new Elysia({ prefix: '/ws' }).ws('/room', {
  open(ws) {
    console.log(`  [User ${ws.id} was connected]`);
    ws.subscribe('room');
  },
  async message(ws, message) {
    const msg: Message = message as Message;
    switch (msg.type) {
      case 'connected':
        users[ws.id] = { id: ws.id, name: msg.body as string };
        ws.publish(
          'room',
          JSON.stringify({
            type: 'connected',
            body: { currUser: users[ws.id], users, messages },
          })
        );
        break;
      case 'send':
        const newMessage = {
          user: users[ws.id],
          date: new Date().toISOString(),
          text: msg.body as string,
        };

        const set = { status: 200 };

        try {
          const result = await addMessage(set, {
            userId: users[ws.id].id,
            content: msg.body as string,
          });

          if (typeof result === 'string') {
            console.error(`Failed to save message: ${result}`);
          } else {
            const savedMessage = result;
            messages.push({
              user: users[ws.id],
              date: savedMessage.createdAt?.toISOString() || newMessage.date,
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
    console.log(`  [User ${ws.id} was disconnected]`);
  },
});

export default websocketRoutes;
