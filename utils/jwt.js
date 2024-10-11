import jwt from 'jsonwebtoken';
import config from "../config/env.js";

export async function generateToken(email) {
  return jwt.sign({email}, config.JWT_SECRET, { expiresIn: config.EXPIRY })
}

export const verifyToken = async (token) => {
  return jwt.verify(token, config.JWT_SECRET)
}