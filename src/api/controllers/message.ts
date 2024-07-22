import db from '../../db';

export async function addMessage(
  set: { status: number },
  body: { userId: string; content: string }
) {
  const { userId, content } = body;

  try {
    const newMessage = await db.message.create({
      data: {
        userId,
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return newMessage;
  } catch (e) {
    set.status = 500;
    return e instanceof Error ? e.message : 'An unknown error occurred';
  }
}
