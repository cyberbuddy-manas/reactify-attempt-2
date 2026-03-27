# Sample Data for VTap MongoDB

This directory contains sample restaurant data for testing the VTap platform.

## Files

- `sample-data.json` - 5 sample restaurants in JSON format

## Sample Restaurants

1. **Gusto 2** (gusto2) - Premium Italian Restaurant
2. **Pizza Palace** (pizza-palace) - Authentic Neapolitan Pizza
3. **Sushi Master** (sushi-master) - Premium Japanese Cuisine
4. **Bistro Belle** (bistro-belle) - French Elegance & Local Flavors
5. **Burger Haven** (burger-haven) - Gourmet Burgers & Craft Beer

## How to Insert Data

### Method 1: Using `mongoimport` (Recommended)

```bash
# Make sure MongoDB is running

# Import the sample data
mongoimport --db vtap --collection restaurants --file backend/sample-data.json --jsonArray
```

### Method 2: Using Node.js Script

Run the existing seed script:

```bash
cd backend
node seed.js
```

This will create Gusto 2 and Pizza Palace (hard-coded in the script).

### Method 3: Using MongoDB Shell

```bash
# Start MongoDB shell
mongosh

# Use the vtap database
use vtap

# Insert from file (paste JSON directly)
db.restaurants.insertMany([
  { /* Gusto 2 data */ },
  { /* Pizza Palace data */ },
  ...
])
```

### Method 4: Using MongoDB Compass (GUI)

1. Open MongoDB Compass
2. Connect to your MongoDB instance
3. Create database: `vtap`
4. Create collection: `restaurants`
5. Click "Add Data" → "Insert Document"
6. Paste each restaurant JSON object

## Sample Data Structure

Each restaurant has:

```javascript
{
  "subdomain": "restaurant-name",           // Unique identifier
  "name": "Restaurant Name",
  "tagline": "Short description",
  "description": "Long description",
  "logo": "🍕",                             // Emoji icon
  "priceRange": "€€",                       // €, €€, or €€€
  "openingNote": "Opens at 5:30 PM",
  "language": "English",
  
  "links": [
    {
      "id": "unique-id",
      "icon": "📋",                         // Emoji icon
      "title": "Link Title",
      "description": "Short description",
      "url": "https://example.com"
    }
    // ... more links
  ],
  
  "hours": [
    {
      "day": "Monday",
      "time": "11:30 AM - 2:00 PM | 5:30 PM - 10:00 PM"
    }
    // ... more days
  ],
  
  "address": "Street Address, City, Country",
  "phone": "+49 261 208090",
  "email": "info@restaurant.de",
  
  "primaryColor": "#14b8a6",                // Hex color
  "secondaryColor": "#2563eb"
}
```

## Testing the Data

### 1. Start Backend
```bash
cd backend
npm run dev
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test URLs

- **Main Page:** http://localhost:3000
- **Gusto 2:** http://gusto2.localhost:3000
- **Pizza Palace:** http://pizza-palace.localhost:3000
- **Sushi Master:** http://sushi-master.localhost:3000
- **Bistro Belle:** http://bistro-belle.localhost:3000
- **Burger Haven:** http://burger-haven.localhost:3000

### 4. API Testing

```bash
# Get all restaurants
curl http://localhost:5000/api/restaurants

# Get specific restaurant
curl http://localhost:5000/api/restaurants/gusto2

# Health check
curl http://localhost:5000/api/health
```

## Customizing Sample Data

Feel free to modify `sample-data.json` to match your test scenarios:

- Change subdomain names
- Update contact information
- Modify opening hours
- Add/remove links
- Change colors
- Add your own restaurants

## Adding More Restaurants

Step 1: Add new object to `sample-data.json`

```json
{
  "subdomain": "my-restaurant",
  "name": "My Restaurant",
  "tagline": "...",
  // ... rest of fields
}
```

Step 2: Import with mongoimport

```bash
mongoimport --db vtap --collection restaurants --file backend/sample-data.json --jsonArray --drop
```

The `--drop` flag will replace all existing data.

## Verify Data in MongoDB

### Using MongoDB Shell
```bash
mongosh
use vtap
db.restaurants.find()                    # Show all
db.restaurants.findOne({ subdomain: "gusto2" })  # Show one
db.restaurants.countDocuments()           # Count
```

### Using MongoDB Compass
1. Open Compass
2. Navigate to `vtap` database
3. Click `restaurants` collection
4. See all documents listed

## Cleanup

To remove all sample data:

```bash
mongosh
use vtap
db.restaurants.deleteMany({})
```

To remove a specific restaurant:

```bash
db.restaurants.deleteOne({ subdomain: "gusto2" })
```
