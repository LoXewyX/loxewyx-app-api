import db from '../../db';

export async function addMessage(
  set: { status: number },
  body: { user_id: string; content: string }
) {
  const { user_id, content } = body;

  try {
    const newMessage = await db.message.create({
      data: {
        user_id,
        content,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
    set.status = 201;
    return newMessage;
  } catch (e) {
    set.status = 500;
    return e instanceof Error ? e.message : 'An unknown error occurred';
  }
}

export async function getAllMessages(set: { status: number }) {
  try {
    const messages = await db.message.findMany({
      orderBy: { created_at: 'asc' },
    });
    set.status = 200;
    return messages;
  } catch (e) {
    set.status = 500;
    return e instanceof Error ? e.message : 'An unknown error occurred';
  }
}
