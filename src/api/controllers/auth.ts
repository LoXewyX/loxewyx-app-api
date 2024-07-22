import bcrypt from 'bcryptjs';
import db from '../../db';
import { security } from '../../env';

export async function signup(
  set: { status: number },
  body: {
    alias: string;
    email: string;
    password: string;
    fullName: string;
  }
) {
  try {
    const { alias, email, password, fullName } = body;

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
        fullName,
      },
    });

    const auth = await db.auth.create({
      data: {
        userId: user.id,
      },
    });

    set.status = 201;
    return { message: 'User created', authCode: auth.code };
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
      return 'User not found';
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

    return { message: 'Login successful', authCode: user.auths[0].code };
  } catch (e) {
    set.status = 500;
    return e instanceof Error ? e.message : 'An unknown error occurred';
  }
}

export async function auth(
  set: { status: number },
  body: {
    email: string;
    authCode: string;
  }
) {
  try {
    const { email, authCode } = body;

    const user = await db.user.findFirst({
      where: {
        email,
        auths: {
          some: {
            code: authCode,
          },
        },
      },
    });

    if (!user) {
      set.status = 401;
      return 'Invalid email or auth code';
    }

    return { message: 'Authentication successful', user };
  } catch (e) {
    set.status = 500;
    return e instanceof Error ? e.message : 'An unknown error occurred';
  }
}
