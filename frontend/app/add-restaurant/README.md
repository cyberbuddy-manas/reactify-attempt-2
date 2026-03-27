# Add Restaurant Form

A comprehensive form page for creating new restaurant entries in the VTap platform.

## Access

Visit: `http://localhost:3000/add-restaurant`

Or click the **"➕ Add Restaurant"** link on the home page.

## Features

### Form Sections

1. **Restaurant Information**
   - Subdomain (unique identifier)
   - Restaurant Name
   - Tagline
   - Description
   - Logo (emoji)

2. **Contact Information**
   - Address
   - Phone Number
   - Email
   - Price Range (€, €€, or €€€)

3. **Settings**
   - Opening Note
   - Language
   - Primary Color (with color picker)
   - Secondary Color (with color picker)

4. **Links**
   - Dynamically add/remove restaurant links
   - Each link has: Icon, Title, Description, URL
   - Examples: Menu, Booking, Reviews, Instagram, etc.

5. **Opening Hours**
   - Dynamically add/remove hours for each day
   - Format: Day and Time range
   - Examples: "Monday-Friday: 9:00 AM - 10:00 PM"

## Form Validation

✅ **Required Fields:**
- Subdomain (must be unique, no spaces)
- Restaurant Name

✅ **Field Requirements:**
- Subdomain: No spaces allowed
- Logo: Single emoji character
- Email: Valid email format (if provided)
- Phone: Any format (no validation)

## Creating a Restaurant

### Step 1: Fill Basic Information
```
Subdomain: my-pizza-place
Name: My Pizza Place
Tagline: Authentic Italian Pizza
Logo: 🍕
Description: Fresh ingredients, wood-fired oven, cozy atmosphere
```

### Step 2: Add Contact Details
```
Address: Downtown District, City, Country
Phone: +1 234 567 8900
Email: hello@mypizzaplace.com
Price Range: €€
```

### Step 3: Configure Settings
```
Opening Note: Opens at 5:00 PM
Language: English
Primary Color: #14b8a6 (teal)
Secondary Color: #2563eb (blue)
```

### Step 4: Add Links
Click "+ Add Link" and fill in:
- Icon: 📋
- Title: Digital Menu
- Description: View menu online
- URL: https://mypizzaplace.com/menu

Repeat for: Menu, Booking, Reviews, Instagram, Facebook, etc.

### Step 5: Add Opening Hours
Click "+ Add Hours" and fill in:
- Day: Monday - Friday
- Time: 11:00 AM - 2:00 PM | 5:00 PM - 11:00 PM

Add hours for each day of the week.

### Step 6: Submit
Click **"✨ Create Restaurant"** button.

## Success Flow

1. Form is validated
2. Data is sent to POST `/api/restaurants`
3. Backend creates MongoDB entry
4. Success message appears
5. **Auto-redirect** to the new restaurant page
   - After 2 seconds, redirects to: `http://my-pizza-place.localhost:3000`

## Error Handling

If something goes wrong:
- ❌ Error message displays
- Form stays open for corrections
- Can fix and resubmit

### Common Errors

| Error | Solution |
|-------|----------|
| "Subdomain already exists" | Choose a different subdomain name |
| "Subdomain cannot contain spaces" | Use hyphens instead: `my-restaurant` |
| "Subdomain and name are required" | Fill in both fields |
| "Link title and icon are required" | Add title and emoji when adding links |
| "Day and time are required" | Fill in both fields when adding hours |

## After Creation

Once created, the restaurant will be:

1. ✅ Available at `http://subdomain.localhost:3000`
2. ✅ Queryable via API: `GET /api/restaurants/subdomain`
3. ✅ Editable via API: `PUT /api/restaurants/subdomain`
4. ✅ Visible with all links and hours
5. ✅ Styled with your chosen colors

## API Integration

The form submits a POST request to:
```
POST http://localhost:5000/api/restaurants
```

With payload:
```json
{
  "subdomain": "my-pizza-place",
  "name": "My Pizza Place",
  "tagline": "Authentic Italian Pizza",
  "description": "...",
  "logo": "🍕",
  "priceRange": "€€",
  "openingNote": "Opens at 5:00 PM",
  "language": "English",
  "address": "Downtown District",
  "phone": "+1 234 567 8900",
  "email": "hello@mypizzaplace.com",
  "primaryColor": "#14b8a6",
  "secondaryColor": "#2563eb",
  "links": [
    {
      "id": "1711368000000",
      "icon": "📋",
      "title": "Menu",
      "description": "View menu online",
      "url": "https://..."
    }
  ],
  "hours": [
    {
      "day": "Monday - Friday",
      "time": "11:00 AM - 2:00 PM | 5:00 PM - 11:00 PM"
    }
  ]
}
```

## Tips & Best Practices

### Subdomain Naming
- Use lowercase
- Use hyphens for spaces: `my-pizza-place` ✅
- No special characters or spaces
- Keep it short and memorable

### Color Selection
- Use hex color codes
- Recommended contrasting colors
- Color picker makes it easy

### Links Strategy
- Prioritize important links first
- 4-6 links is ideal
- Use relevant emojis
- Add description for context

### Hours Format
- "Monday - Friday" or "Monday, Wednesday, Friday"
- "11:00 AM - 2:00 PM" or "11:00 - 14:00"
- Use pipes for multiple sessions: "11 AM - 2 PM | 5 PM - 11 PM"
- "Closed" for closed days

## Testing

### Local Testing
```bash
1. Start backend: npm run dev (in backend/)
2. Start frontend: npm run dev (in frontend/)
3. Visit http://localhost:3000/add-restaurant
4. Fill form and submit
5. Should redirect to http://subdomain.localhost:3000
```

### Verify in Database
```bash
mongosh
use vtap
db.restaurants.findOne({ subdomain: "my-pizza-place" })
```

### Verify via API
```bash
curl http://localhost:5000/api/restaurants/my-pizza-place
```

## Editing Existing Restaurants

To edit an existing restaurant, either:
1. Make a PUT request to `/api/restaurants/subdomain`
2. Use MongoDB Compass or mongosh to update directly
3. Create admin dashboard for easy editing (future feature)

## Screenshots

### Form Page
- Clean, organized layout
- Color pickers for theme colors
- Dynamic link/hours management
- Clear error messages
- Success feedback

### Success Flow
- "✅ Restaurant created successfully!"
- Auto-redirect after 2 seconds
- Lands on new restaurant's page
