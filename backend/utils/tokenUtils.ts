import jwt from 'jsonwebtoken';

export const generateToken = (userId: string) => {
  return jwt.sign({ user: { _id: userId } }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};
