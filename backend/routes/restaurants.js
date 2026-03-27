import express from 'express';
import asyncHandler from 'express-async-handler';
import { Restaurant } from '../models/Restaurant.js';

const router = express.Router();

// Get restaurant by subdomain
router.get('/:subdomain', asyncHandler(async (req, res) => {
  const { subdomain } = req.params;
  
  const restaurant = await Restaurant.findOne({ subdomain });
  
  if (!restaurant) {
    return res.status(404).json({ 
      error: 'Restaurant not found',
      subdomain 
    });
  }
  
  res.json(restaurant);
}));

// Get all restaurants
router.get('/', asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find().select('subdomain name description');
  res.json(restaurants);
}));

// Create restaurant (POST)
router.post('/', asyncHandler(async (req, res) => {
  const { subdomain, name, ...rest } = req.body;
  
  if (!subdomain || !name) {
    return res.status(400).json({ 
      error: 'Subdomain and name are required' 
    });
  }
  
  const existingRestaurant = await Restaurant.findOne({ subdomain });
  if (existingRestaurant) {
    return res.status(409).json({ 
      error: 'Subdomain already exists' 
    });
  }
  
  const restaurant = await Restaurant.create({
    subdomain,
    name,
    ...rest,
  });
  
  res.status(201).json(restaurant);
}));

// Update restaurant (PUT)
router.put('/:subdomain', asyncHandler(async (req, res) => {
  const { subdomain } = req.params;
  const { subdomain: newSubdomain, ...updateData } = req.body;
  
  const restaurant = await Restaurant.findOneAndUpdate(
    { subdomain },
    { ...updateData, updatedAt: new Date() },
    { new: true }
  );
  
  if (!restaurant) {
    return res.status(404).json({ 
      error: 'Restaurant not found' 
    });
  }
  
  res.json(restaurant);
}));

// Delete restaurant (DELETE)
router.delete('/:subdomain', asyncHandler(async (req, res) => {
  const { subdomain } = req.params;
  
  const restaurant = await Restaurant.findOneAndDelete({ subdomain });
  
  if (!restaurant) {
    return res.status(404).json({ 
      error: 'Restaurant not found' 
    });
  }
  
  res.json({ message: 'Restaurant deleted', subdomain });
}));

export default router;
