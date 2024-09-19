import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { JWT_SECRET, JWT_EXPIRATION, BCRYPT_SALT_ROUNDS } from '@/config';
import { JWTPayload } from '@/types';

// Function to hash a password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  // Use bcrypt.hash with the provided password and BCRYPT_SALT_ROUNDS
  const hashedPassword = await hash(password, BCRYPT_SALT_ROUNDS);
  // Return the resulting hash
  return hashedPassword;
}

// Function to compare a plain text password with a hashed password
export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  // Use bcrypt.compare with the plain password and hashed password
  const isMatch = await compare(plainPassword, hashedPassword);
  // Return the result of the comparison
  return isMatch;
}

// Function to generate a JWT token
export function generateToken(payload: JWTPayload): string {
  // Use jwt.sign with the payload, JWT_SECRET, and an expiration option
  const token = sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  // Return the generated token
  return token;
}

// Function to verify a JWT token
export async function verifyToken(token: string): Promise<JWTPayload> {
  // Use jwt.verify with the token and JWT_SECRET
  const decodedPayload = await verify(token, JWT_SECRET) as JWTPayload;
  // Return the decoded payload
  return decodedPayload;
}

// Function to generate a random token for password reset or email verification
export async function generateRandomToken(byteLength: number): Promise<string> {
  // Use crypto.randomBytes to generate random bytes
  const buffer = await randomBytes(byteLength);
  // Convert the bytes to a hexadecimal string
  const token = buffer.toString('hex');
  // Return the resulting token
  return token;
}