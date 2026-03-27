import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  subdomain: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  tagline: String,
  logo: String,
  priceRange: String,
  openingNote: String,
  language: String,
  
  // Links
  links: [{
    id: String,
    icon: String,
    title: String,
    description: String,
    url: String,
  }],
  
  // hours
  hours: [{
    day: String,
    time: String,
  }],
  
  // Contact
  address: String,
  phone: String,
  email: String,
  
  // Branding
  primaryColor: {
    type: String,
    default: '#14b8a6', // teal
  },
  secondaryColor: {
    type: String,
    default: '#2563eb', // blue
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Restaurant = mongoose.model('Restaurant', restaurantSchema);
