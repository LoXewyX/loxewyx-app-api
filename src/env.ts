import dotenv from 'dotenv';

export default dotenv.config();

const security = {
  SHA_SALT: process.env.SHA_SALT ?? '',
};

export { security };
