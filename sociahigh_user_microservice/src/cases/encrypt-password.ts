import bcrypt from 'bcrypt';

export async function encryptPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}
