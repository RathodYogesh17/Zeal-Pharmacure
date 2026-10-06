import bcrypt from "bcryptjs";

const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

const comparePassword = async ( plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

const sanitizeUser = <T extends Record<string, unknown>>(user: T): Omit<T, "password"> => {
  const { password: _password, ...sanitizedUser } = user;
  return sanitizedUser;
};

export { hashPassword, comparePassword, sanitizeUser,};
