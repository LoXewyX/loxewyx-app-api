import db from '../../db';

export async function addMessage(
  set: { status: number },
  body: { user_id: string; content: string }
) {
  const { user_id, content } = body;
  const text = content.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '');

  if (text.length > 1024 || text.length < 1) {
    set.status = 403;
    return 'Invalid content length';
  }

  try {
    const newMessage = await db.message.create({
      data: {
        user_id,
        content,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        user: {
          select: {
            alias: true,
          },
        },
      },
    });

    set.status = 201;
    return {
      ...newMessage,
    };
  } catch (e) {
    set.status = 500;
    return e instanceof Error ? e.message : 'An unknown error occurred';
  }
}

export async function getAllMessages(set: { status: number }) {
  try {
    const messages = await db.message.findMany({
      orderBy: { created_at: 'asc' },
      select: {
        user_id: true,
        content: true,
        created_at: true,
        user: {
          select: {
            alias: true,
          },
        },
      },
    });

    const formattedMessages = messages.map((message) => ({
      user_id: message.user_id,
      user_alias: message.user.alias,
      date: message.created_at!.toISOString(),
      text: message.content,
    }));

    set.status = 200;
    return formattedMessages;
  } catch (e) {
    set.status = 500;
    return e instanceof Error ? e.message : 'An unknown error occurred';
  }
}
