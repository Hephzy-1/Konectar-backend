import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
}

export const comparePassword = async (password, userPassword) => {
  return bcrypt.compare(password, userPassword)
}