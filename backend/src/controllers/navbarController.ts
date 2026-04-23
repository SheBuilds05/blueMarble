import { Request, Response } from 'express';

export const getNavbarData = async (req: Request, res: Response) => {
  try {
    // When you fix the MongoDB connection, you'll fetch this from your User collection
    const navbarData = {
      username: "",
      profileImage: "", // You can leave this empty or use a default placeholder URL
      unreadNotifications: 0,
      systemStatus: "Online"
    };

    res.status(200).json(navbarData);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching navbar data", 
      error: error instanceof Error ? error.message : error 
    });
  }
};