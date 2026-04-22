import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: any, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Get token from "Bearer <token>"

  if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'erdtfygiuhjokjuhtfrdes');
    req.user = verified; // Add user info to the request object
    next(); // Move to the actual route function
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};
