# Testing the Middleware Implementation

## 🚀 Quick Test (5 minutes)

### Step 1: Setup Hosts File

**macOS/Linux:**
```bash
sudo nano /etc/hosts
```

Add these lines:
```
127.0.0.1  gusto2.localhost
127.0.0.1  restaurant.localhost
127.0.0.1  localhost
```

**Windows:**
Edit `C:\Windows\System32\drivers\etc\hosts` as Administrator and add the same lines.

### Step 2: Start Development Server

```bash
npm run dev
```

You should see: `▲ Ready in 2.5s`

### Step 3: Test the Middleware

Visit these URLs and you should see the extracted subdomain:

#### Test 1: With Subdomain
```
http://gusto2.localhost:3000/middleware-test
```

**Expected Output:**
```
Subdomain Extracted by Middleware
"gusto2"
```

#### Test 2: Different Subdomain
```
http://restaurant.localhost:3000/middleware-test
```

**Expected Output:**
```
Subdomain Extracted by Middleware
"restaurant"
```

#### Test 3: No Subdomain (Main Domain)
```
http://localhost:3000/middleware-test
```

**Expected Output:**
```
Subdomain Extracted by Middleware
null (no subdomain)
```

---

## 🔍 Detailed Testing

### Test 4: How the Middleware Works (Debug Logs)

Add debug logging to see the exact flow:

**Edit `middleware.ts`:**
```typescript
export function middleware(request: NextRequest) {
  try {
    const host = request.headers.get("host") || "";
    console.log("🔍 Middleware - Host from request:", host);
    
    const subdomain = extractSubdomain(host);
    console.log("🔍 Middleware - Extracted subdomain:", subdomain);

    if (subdomain) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-subdomain", subdomain);
      console.log("🔍 Middleware - Added header x-subdomain:", subdomain);
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    console.log("🔍 Middleware - No subdomain found");
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}
```

**Then reload http://gusto2.localhost:3000/middleware-test and check your terminal:**

```
🔍 Middleware - Host from request: gusto2.localhost:3000
🔍 Middleware - Extracted subdomain: gusto2
🔍 Middleware - Added header x-subdomain: gusto2
```

### Test 5: Component Receiving the Header

Add debug logging to the test page component:

**Edit `app/middleware-test/page.tsx`:**
```typescript
import { getSubdomainFromRequest } from "@/lib/subdomain";

export default async function MiddlewareTestPage() {
  const subdomain = await getSubdomainFromRequest();
  
  // Debug log
  console.log("📄 Component - Subdomain from header:", subdomain);

  return (
    // ... rest of component
  );
}
```

**Terminal output:**
```
📄 Component - Subdomain from header: gusto2
```

### Test 6: Use in a Real Page Component

Create a test page that uses the subdomain:

**File: `app/test-subdomain/page.tsx`**
```typescript
import { getSubdomainFromRequest } from "@/lib/subdomain";

export default async function TestPage() {
  const subdomain = await getSubdomainFromRequest();

  if (!subdomain) {
    return (
      <div className="p-8">
        <p>No subdomain. Try: <code>gusto2.localhost:3000/test-subdomain</code></p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">
        Restaurant: {subdomain.toUpperCase()}
      </h1>
      <div className="bg-blue-100 p-4 rounded">
        <p className="text-lg">
          This page is served for the subdomain: <strong>{subdomain}</strong>
        </p>
        <p className="mt-2 text-gray-600">
          The middleware extracted "{subdomain}" from "gusto2.localhost:3000"
        </p>
      </div>

      <div className="mt-8 bg-gray-100 p-4 rounded font-mono text-sm">
        <p className="font-bold mb-2">How it worked:</p>
        <ol className="space-y-1 list-decimal list-inside">
          <li>Browser requests: gusto2.localhost:3000/test-subdomain</li>
          <li>Middleware intercepts the request</li>
          <li>extractSubdomain() parses "gusto2.localhost"</li>
          <li>Header x-subdomain: "gusto2" is added</li>
          <li>Component calls getSubdomainFromRequest()</li>
          <li>Reads x-subdomain header → returns "gusto2"</li>
        </ol>
      </div>
    </div>
  );
}
```

Visit: `http://gusto2.localhost:3000/test-subdomain`

---

## 🧪 Advanced Testing with cURL

If you prefer command line testing:

### Test 1: Extract with curl
```bash
curl -H "Host: gusto2.localhost" http://localhost:3000/middleware-test
```

### Test 2: Different Subdomains
```bash
curl -H "Host: restaurant.localhost" http://localhost:3000/middleware-test
curl -H "Host: app.localhost" http://localhost:3000/middleware-test
curl -H "Host: localhost" http://localhost:3000/middleware-test
```

### Test 3: Verbose Output (see all headers)
```bash
curl -v -H "Host: gusto2.localhost" http://localhost:3000/middleware-test -s | grep -i "x-subdomain"
```

---

## ✅ Testing Checklist

### Middleware Functionality
- [ ] Subdomain extracted from `gusto2.localhost`
- [ ] Different subdomains work: `restaurant.localhost`, `app.localhost`
- [ ] No subdomain returns `null`: `localhost`
- [ ] Port number is handled correctly
- [ ] Header `x-subdomain` is set in request

### Component Integration
- [ ] `getSubdomainFromRequest()` returns the subdomain
- [ ] Component can render based on subdomain
- [ ] Works in async Server Components
- [ ] No errors in browser console
- [ ] Terminal logs show correct extraction

### Edge Cases
- [ ] Capital letters: `GUSTO2.localhost` → `GUSTO2` (or lowercased)
- [ ] Long subdomains: `very-long-restaurant-name.localhost`
- [ ] Single letter: `g.localhost`
- [ ] Multiple dots: `subdomain.gusto2.localhost` (should extract `subdomain`)
- [ ] No `.localhost` in URL: `localhost:3000` → `null`

### Browser Testing
- [ ] Regular browser tab
- [ ] Private/Incognito window (no cache)
- [ ] Multiple tabs with different subdomains
- [ ] Browser DevTools Network tab (see request headers)

---

## 🐛 Debugging Issues

### Problem: Subdomain not extracted

**Solution:**
1. Check `/etc/hosts` has the entry:
```bash
cat /etc/hosts | grep localhost
```

2. Clear browser cache:
   - Press `Ctrl+Shift+Delete` (or `Cmd+Shift+Delete` on Mac)
   - Clear all cache

3. Try incognito/private window:
   - No cache interference

4. Verify URL in address bar:
   - Should show: `gusto2.localhost:3000`
   - NOT: `localhost:3000` with path `/gusto2`

### Problem: Header not being read in component

**Solution:**
1. Check middleware is running (see debug logs)
2. Verify function name is `getSubdomainFromRequest` (exact spelling)
3. Make sure it's an async function: `async function`
4. Component should be a Server Component (not "use client")

### Problem: "Cannot find module" error

**Solution:**
```bash
# Clear cache and rebuild
rm -rf .next
npm run dev
```

---

## 📊 Full Test Scenario

### Scenario: Restaurant Subdomain Routing

```typescript
// app/[slug]/page.tsx
import { getSubdomainFromRequest } from "@/lib/subdomain";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function RestaurantPage({ params }: PageProps) {
  const { slug } = await params;
  const subdomain = await getSubdomainFromRequest();
  
  // Priority: subdomain > slug parameter
  const restaurantId = subdomain || slug;
  
  if (!restaurantId) {
    return <div>No restaurant found</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        Restaurant: {restaurantId}
      </h1>
      <p className="mt-2 text-gray-600">
        Accessed via:
        {subdomain ? ` (subdomain: ${subdomain})` : ` (path: /${slug})`}
      </p>
    </div>
  );
}
```

**Test cases for this page:**

| URL | Extracted | Expected |
|-----|-----------|----------|
| `gusto2.localhost:3000` | subdomain=gusto2 | Shows "gusto2 (subdomain)" |
| `gusto2.localhost:3000/anything` | subdomain=gusto2 | Still shows "gusto2" |
| `localhost:3000/gusto2` | slug=gusto2 | Shows "gusto2 (path)" |
| `localhost:3000` | neither | Shows "No restaurant" |

---

## 🎯 Success Criteria

Your middleware is working correctly when:

1. ✅ Browser shows `gusto2.localhost:3000/middleware-test`
2. ✅ Page displays: `"gusto2"`
3. ✅ Terminal logs show: `🔍 Middleware - Extracted subdomain: gusto2`
4. ✅ Changing subdomain changes displayed value
5. ✅ `localhost:3000/middleware-test` shows: `null (no subdomain)`
6. ✅ No errors in browser console
7. ✅ No errors in terminal

---

## 🚀 Next Steps

Once tested and working:

1. **Remove debug logs** from middleware and component
2. **Integrate with restaurant data loading**
3. **Create proper restaurant page** using subdomain
4. **Test with production domain** (gusto2.example.com)
5. **Add error handling** for missing restaurants

Good luck! 🎉
