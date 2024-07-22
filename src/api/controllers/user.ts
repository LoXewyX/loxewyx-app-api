import db from '../../db';

export async function getUsers(set: { status: number }) {
  try {
    return await db.user.findMany({ orderBy: { created_at: 'asc' } });
  } catch (e) {
    set.status = 500;
    return e;
  }
}

export async function getAuth(set: { status: number }) {
  try {
    return await db.auth.findMany({
      orderBy: {
        user: {
          created_at: 'asc',
        },
      },
      include: {
        user: true,
      },
    });
  } catch (e) {
    set.status = 500;
    return e;
  }
}

export async function getUser(set: { status: number }, id: string) {
  try {
    const user = await db.user.findUnique({ where: { id } });

    if (!user) {
      set.status = 404;
      return 'User not found';
    }

    return user;
  } catch (e) {
    set.status = 500;
    return e;
  }
}

export async function createUser(
  set: { status: number },
  body: {
    alias: string;
    email: string;
    password: string;
    full_name: string;
  }
) {
  try {
    const { alias, email, password, full_name } = body;

    const existingUserByAlias = await db.user.findUnique({ where: { alias } });
    if (existingUserByAlias) {
      set.status = 409;
      return 'Alias already exists';
    }

    const existingUserByEmail = await db.user.findUnique({ where: { email } });
    if (existingUserByEmail) {
      set.status = 409;
      return 'Email already exists';
    }

    await db.user.create({
      data: {
        alias,
        email,
        password,
        full_name,
      },
    });

    set.status = 201;
    return 'Created';
  } catch (e) {
    set.status = 500;
    return e;
  }
}

export async function updateUser(
  set: { status: number },
  id: string,
  body: {
    alias?: string;
    email?: string;
    password?: string;
    full_name?: string;
  }
) {
  try {
    const { alias, email, password, full_name } = body;

    return await db.user.update({
      where: { id },
      data: {
        ...(alias ? { alias } : {}),
        ...(email ? { email } : {}),
        ...(password ? { password } : {}),
        ...(full_name ? { full_name } : {}),
      },
    });
  } catch (e) {
    set.status = 500;
    return e;
  }
}

export async function deleteUser(set: { status: number }, id: string) {
  try {
    const user = await db.user.findUnique({ where: { id } });

    if (user === null) {
      set.status = 404;
      return `Id ${id} does not exist.`;
    }

    return await db.user.delete({ where: { id } });
  } catch (e) {
    set.status = 500;
    return e;
  }
}
