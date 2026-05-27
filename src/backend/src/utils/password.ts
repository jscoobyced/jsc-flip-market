import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export const hashPassword = (value: string): Promise<string> =>
  bcrypt.hash(value, SALT_ROUNDS);

export const comparePassword = async (
  value: string,
  hashed: string,
): Promise<boolean> => {
  if (!hashed) {
    return false;
  }

  return await bcrypt.compare(value, hashed);
};
