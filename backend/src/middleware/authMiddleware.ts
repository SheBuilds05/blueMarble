import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1. Define the shape of your Token payload
interface AuthRequest extends Request {
  user?: {
    id: string;
    iat?: number;
    exp?: number;
  };
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Extract token - checking both header styles (standard and lowercase)
  const authHeader = req.header('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ 
      message: "Access Denied. Please log in to continue." 
    });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'erdtfygiuhjokjuhtfrdes';
    const verified = jwt.verify(token, JWT_SECRET) as { id: string };
    
    // 2. Attach verified user to request
    req.user = verified;
    next();
  } catch (err: any) {
    // 3. Differentiate between expired and malformed tokens
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }
    res.status(403).json({ message: "Invalid authentication token." });
  }
};
export default verifyToken;