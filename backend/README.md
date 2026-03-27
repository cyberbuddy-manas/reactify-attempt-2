# VTap Backend API

Express.js + MongoDB backend for VTap restaurant platform.

## Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create `.env` file:

```bash
MONGODB_URI=mongodb://localhost:27017/vtap
PORT=5000
NODE_ENV=development
```

### Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server runs on `http://localhost:5000`

### Seed Database

Load sample restaurants into MongoDB:

```bash
node seed.js
```

This creates two sample restaurants:
- **gusto2** - Premium Italian Restaurant
- **pizza-palace** - Authentic Neapolitan Pizza

## API Endpoints

### Health Check
```
GET /api/health
```

### Get All Restaurants
```
GET /api/restaurants
```

### Get Restaurant by Subdomain
```
GET /api/restaurants/:subdomain
```

Example: `GET /api/restaurants/gusto2`

### Create Restaurant
```
POST /api/restaurants
Content-Type: application/json

{
  "subdomain": "my-restaurant",
  "name": "My Restaurant",
  "description": "My awesome restaurant",
  "tagline": "Great food",
  "address": "123 Main St",
  "phone": "+1 234 567 8900"
}
```

### Update Restaurant
```
PUT /api/restaurants/:subdomain
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description"
}
```

### Delete Restaurant
```
DELETE /api/restaurants/:subdomain
```

## Database Schema

### Restaurant Model

```javascript
{
  subdomain: String (unique, required),
  name: String (required),
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

## CORS Configuration

Currently allowing requests from:
- `http://localhost:3000` (NextJS Frontend)
- `http://localhost:3001`

Update in `server.js` for production domains.

## Error Handling

API returns consistent error responses:

```json
{
  "error": "Error message",
  "subdomain": "restaurant-name"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `409` - Conflict (subdomain exists)
- `500` - Server Error
