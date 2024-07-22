import bcrypt from 'bcryptjs';
import db from '../../db';
import { security } from '../../env';

export async function signup(
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

    const user = await db.user.create({
      data: {
        alias,
        email,
        password: await bcrypt.hash(security.SHA_SALT + password + alias, 10),
        full_name,
      },
    });

    const auth = await db.auth.create({
      data: {
        user_id: user.id,
      },
    });

    set.status = 201;
    return { userId: user.id, authCode: auth.code };
  } catch (e) {
    set.status = 500;
    return e instanceof Error ? e.message : 'An unknown error occurred';
  }
}

export async function login(
  set: { status: number },
  body: {
    identifier: string;
    password: string;
  }
) {
  try {
    const { identifier, password } = body;

    const user = await db.user.findFirst({
      where: {
        OR: [{ alias: identifier }, { email: identifier }],
      },
      include: {
        auths: true,
      },
    });

    if (!user) {
      set.status = 404;
      return 'Alias or email not found';
    }

    if (
      !(await bcrypt.compare(
        security.SHA_SALT + password + user.alias,
        user.password
      ))
    ) {
      set.status = 401;
      return 'Invalid password';
    }

    return { userId: user.id, authCode: user.auths[0].code };
  } catch (e) {
    set.status = 500;
    return e instanceof Error ? e.message : 'An unknown error occurred';
  }
}

export async function auth(
  set: { status: number },
  body: {
    user_id: string;
    auth_code: string;
  }
) {
  try {
    const { user_id, auth_code } = body;

    const user = await db.user.findFirst({
      where: {
        id: user_id,
        auths: {
          some: {
            code: auth_code,
          },
        },
      },
    });

    if (!user) {
      set.status = 401;
      return 'Invalid alias or auth code';
    }

    return user;
  } catch (e) {
    set.status = 500;
    return e instanceof Error ? e.message : 'An unknown error occurred';
  }
}
