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
    return newMessage;
  } catch (e) {
    set.status = 500;
    return e instanceof Error ? e.message : 'An unknown error occurred';
  }
}
