# VTap - Restaurant Landing Pages Platform

A full-stack application for creating beautiful, subdomain-based landing pages for restaurants.

## Project Structure

```
reactify-attempt-2/
├── frontend/              # Next.js 15 application (Client)
│   ├── app/              # App Router components
│   ├── components/       # React components
│   ├── lib/              # Utilities & helpers
│   ├── public/           # Static assets
│   ├── middleware.ts     # Edge middleware for subdomain extraction
│   ├── next.config.ts    # Next.js configuration
│   ├── package.json      # Frontend dependencies
│   └── tsconfig.json     # TypeScript config
│
├── backend/               # Express.js API (Server)
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── server.js         # Express server
│   ├── seed.js           # Database seeder
│   ├── package.json      # Backend dependencies
│   └── .env.example      # Environment variables template
```

## Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000`

### Backend

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:5000`

#### Seed Database with Sample Data

With MongoDB running (local or Atlas):

```bash
cd backend
node seed.js
```

This creates two sample restaurants:
- **gusto2** - Premium Italian Restaurant
- **pizza-palace** - Authentic Neapolitan Pizza

## Technologies

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Server Components** - RSC for data fetching
- **Edge Middleware** - Subdomain extraction

### Backend
- **Express.js** - Node.js web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin requests
- **Nodemon** - Development auto-reload

## Features

✅ **Subdomain Routing** - Unique URLs for each restaurant (gusto2.localhost:3000)
✅ **Dynamic Data Loading** - Restaurant data from MongoDB via API
✅ **LinkTree-style Pages** - Beautiful restaurant landing pages
✅ **Easy Customization** - Colors, links, hours, contact info
✅ **Add Restaurant Form** - Create new restaurants via user-friendly interface
✅ **Fast Performance** - Next.js edge caching + API optimization

## Create a New Restaurant

### Via Web Form (Easiest)

1. Visit: `http://localhost:3000/add-restaurant`
2. Fill in restaurant details:
   - Basic info (subdomain, name, tagline, logo)
   - Contact information (address, phone, email)
   - Settings (colors, opening notes)
   - Links (menu, booking, social media, etc.)
   - Hours (opening times for each day)
3. Click "✨ Create Restaurant"
4. Auto-redirects to your new restaurant's page

See [frontend/app/add-restaurant/README.md](./frontend/app/add-restaurant/README.md) for complete form guide.

### Via API

```bash
curl -X POST http://localhost:5000/api/restaurants \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain": "my-pizza",
    "name": "My Pizza Place",
    "description": "Fresh wood-fired pizza",
    "tagline": "Authentic Italian",
    "logo": "🍕",
    "address": "123 Main St",
    "phone": "+1 234 567 8900",
    "email": "hello@mypizza.com",
    "primaryColor": "#14b8a6",
    "secondaryColor": "#2563eb",
    "links": [
      {
        "icon": "📋",
        "title": "Menu",
        "description": "View menu online",
        "url": "https://mypizza.com/menu"
      }
    ],
    "hours": []
  }'
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

**Get Restaurant by Subdomain**
```
GET /restaurants/:subdomain
```

Example: `curl http://localhost:5000/api/restaurants/gusto2`

**Create Restaurant**
```
POST /restaurants
Content-Type: application/json

{
  "subdomain": "my-restaurant",
  "name": "My Restaurant",
  "description": "Great food",
  "address": "123 Main St",
  "phone": "+1 234 567 8900"
}
```

**Update Restaurant**
```
PUT /restaurants/:subdomain
```

**Delete Restaurant**
```
DELETE /restaurants/:subdomain
```

See [backend/README.md](./backend/README.md) for detailed API documentation.

## Environment Variables

### Frontend (.env.local)
```
# Already configured, no environment variables needed
```

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/vtap
PORT=5000
NODE_ENV=development
```

## How It Works

1. **Request comes in** → User visits `gusto2.localhost:3000`
2. **Middleware extracts subdomain** → Identifies "gusto2"
3. **Header is set** → `x-subdomain: gusto2`
4. **Frontend fetches restaurant data** → Calls `GET /api/restaurants/gusto2`
5. **MongoDB returns data** → Restaurant details from database
6. **Beautiful page renders** → LinkTree-style landing page

## Database Schema

### Restaurant Model

```javascript
{
  subdomain: String (unique),
  name: String,
  description: String,
  tagline: String,
  logo: String,
  priceRange: String,
  openingNote: String,
  language: String,
  links: [{
    id: String,
    icon: String,
    title: String,
    description: String,
    url: String,
  }],
  hours: [{
    day: String,
    time: String,
  }],
  address: String,
  phone: String,
  email: String,
  primaryColor: String,
  secondaryColor: String,
  createdAt: Date,
  updatedAt: Date,
}
```

## Testing

### Test a restaurant in browser
- Main page: `http://localhost:3000`
- Add Restaurant form: `http://localhost:3000/add-restaurant`
- Gusto 2: `http://gusto2.localhost:3000`
- Pizza Palace: `http://pizza-palace.localhost:3000`
- Middleware test: `http://localhost:3000/middleware-test`

### Test Add Restaurant Form
1. Visit `http://localhost:3000/add-restaurant`
2. Fill in sample data:
   - Subdomain: `test-pizza`
   - Name: `Test Pizza Place`
   - Logo: `🍕`
   - Add at least one link
3. Click "✨ Create Restaurant"
4. Should redirect to `http://test-pizza.localhost:3000`
5. Verify new restaurant page displays with your data

### Test API with curl

```bash
# Get all restaurants
curl http://localhost:5000/api/restaurants

# Get specific restaurant
curl http://localhost:5000/api/restaurants/gusto2

# Create new restaurant (if form doesn't work)
curl -X POST http://localhost:5000/api/restaurants \
  -H "Content-Type: application/json" \
  -d '{"subdomain":"test","name":"Test Restaurant","logo":"🍔"}'

# Health check
curl http://localhost:5000/api/health
```

## Next Steps

1. **Production Setup**
   - Deploy backend to Heroku/Railway
   - Deploy frontend to Vercel
   - Configure MongoDB Atlas
   - Setup production domain

2. **Enhanced Features**
   - Admin dashboard for restaurant management
   - Image uploads for logos/photos
   - Reservation system integration
   - Analytics & click tracking
   - Custom domain support

3. **Performance**
   - Add Redis caching
   - Implement pagination
   - Optimize images
   - CDN integration

## License

MIT

## Support

For issues or questions, check:
- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)
- [Middleware Docs](./frontend/MIDDLEWARE.md)
