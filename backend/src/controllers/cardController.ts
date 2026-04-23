import { Request, Response } from 'express';
import Card from '../models/Card.js'; 
 
export const getCards = async (req: any, res: Response) => {
  try {
    // In a real app, use: await Card.find({ userId: req.user.id })
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cards", error });
  }
};
 
export const toggleCardStatus = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
   
    if (!card) return res.status(404).json({ message: "Card not found" });
 
    // Toggle between 'Active' and 'Frozen'
    card.status = card.status === 'Frozen' ? 'Active' : 'Frozen';
    await card.save();
 
    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({ message: "Error updating card status", error });
  }
};
 
export const updateLimits = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const { atmLimit } = req.body;
 
    const card = await Card.findByIdAndUpdate(
      cardId,
      { atmLimit },
      { new: true }
    );
 
    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({ message: "Error updating limits" });
  }
};
 