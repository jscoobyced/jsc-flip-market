import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hashPassword = (value: string): Promise<string> => bcrypt.hash(value, SALT_ROUNDS);
export const comparePassword = (value: string, hashed: string): Promise<boolean> =>
  bcrypt.compare(value, hashed);
