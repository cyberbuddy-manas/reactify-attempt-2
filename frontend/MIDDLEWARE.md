# Middleware Architecture

## Overview

The middleware extracts the **subdomain** from incoming requests and makes it available to your application via request headers.

## How It Works

```
Browser Request
    ↓
gusto2.localhost:3000 or gusto2.example.com
    ↓
[middleware.ts] - /extractSubdomain()
    ↓
Extracts: "gusto2"
    ↓
Adds Header: x-subdomain: "gusto2"
    ↓
Request continues to Next.js App
```

## Middleware Code Structure

### `middleware.ts`

```typescript
function extractSubdomain(hostname: string): string | null {
  // 1. Remove port (gusto2.localhost:3000 → gusto2.localhost)
  // 2. Check for .localhost (development)
  // 3. Check for .local (testing)
  // 4. Check for multi-part domain (production: gusto2.example.com)
  // 5. Return subdomain or null
}

export function middleware(request: NextRequest) {
  // 1. Get hostname from request
  // 2. Extract subdomain using extractSubdomain()
  // 3. If found, add x-subdomain header
  // 4. Continue to next middleware/route
}
```

## Configuration

### Matcher

Defines which routes go through middleware:

```typescript
matcher: ["/((?!_next|favicon.ico|robots.txt|sitemap.xml|api|healthz).*)"]
```

**Excludes:**
- `_next/*` - Next.js build files
- `favicon.ico` - Favicon
- `robots.txt`, `sitemap.xml` - SEO files
- `api/*` - API routes (typically no subdomain logic needed)
- `healthz/*` - Health check endpoints

## Supported Formats

### Development
```
gusto2.localhost:3000     ✅
restaurant.localhost:3000 ✅
app.local:3000            ✅
```

### Production
```
gusto2.example.com        ✅
restaurant.mysite.org     ✅
app.co.uk                 ✅
subdomain.sub.example.com ✅
```

### Not Supported
```
example.com               ❌ (no subdomain)
localhost:3000            ❌ (no subdomain)
127.0.0.1:3000            ❌ (IP address)
```

## Usage in Components

### Get Subdomain in Server Components

```typescript
import { getSubdomainFromRequest } from "@/lib/subdomain";

export default async function Page() {
  const subdomain = await getSubdomainFromRequest();
  
  return <div>{subdomain}</div>; // "gusto2"
}
```

### Use with Route Parameters

```typescript
// app/[slug]/page.tsx
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function RestaurantPage({ params }: PageProps) {
  const { slug } = await params;
  const subdomain = await getSubdomainFromRequest();

  // slug could come from:
  // 1. Route param: example.com/gusto2
  // 2. Subdomain: gusto2.localhost:3000 (then slug = undefined)
  
  const identifier = slug || subdomain;
  
  return <RestaurantView id={identifier} />;
}
```

### Fallback Priority

```
1. URL slug (e.g., /gusto2)
2. Subdomain (e.g., gusto2.localhost)
3. Not found → 404
```

## Testing the Middleware

### Test 1: Check if Subdomain is Extracted

**/etc/hosts setup:**
```
127.0.0.1  gusto2.localhost
```

**/app/debug/page.tsx (temporary):**
```typescript
import { getSubdomainFromRequest } from "@/lib/subdomain";

export default async function Debug() {
  const subdomain = await getSubdomainFromRequest();
  return <div>Subdomain: {subdomain || "None"}</div>;
}
```

Visit: `http://gusto2.localhost:3000/debug`

Expected: "Subdomain: gusto2"

### Test 2: Different Hosts

```bash
curl -H "Host: gusto2.localhost" http://localhost:3000
curl -H "Host: restaurant.localhost" http://localhost:3000
curl -H "Host: localhost" http://localhost:3000  # No subdomain
```

## Troubleshooting

### Subdomain Not Detected

**Problem:** Browser shows `localhost:3000` is not `gusto2.localhost:3000`

**Solution:** 
1. Check `/etc/hosts` has the entry
2. Clear browser cache
3. Try incognito window
4. Check middleware matcher includes your route

### Middleware Not Running

**Problem:** `x-subdomain` header never set

**Solution:**
1. Check `config.matcher` includes your route
2. Verify file is named exactly `middleware.ts` (not `.middleware.ts`)
3. Must be in root or `src/` folder

### Issues with Dynamic Subdomains

**Problem:** Want to support ANY subdomain

**Current setup:** Works! Any subdomain will be extracted and available via `x-subdomain` header.

## Advanced: Custom Domain Pattern

To support different domain patterns, modify `extractSubdomain()`:

```typescript
// Example: Support company.com and api.company.com
function extractSubdomain(hostname: string): string | null {
  const host = hostname.split(":")[0];
  
  // Your custom logic here
  if (host === "api.company.com") {
    return "api";
  }
  
  // ... rest of logic
}
```

## Middleware Execution Order

Next.js executes middleware in this order:

1. **Early Middleware** (runs first on every request)
2. **Your Middleware** ← This extracts subdomain
3. **Route Handler** or **Page Component**
4. **API Routes**

## Performance

- ✅ Middleware executes in Edge Runtime (very fast)
- ✅ Only string operations, no database queries
- ✅ ~1ms overhead per request
- ✅ No memory leaks

## Best Practices

### ✅ DO
- Keep middleware simple (string operations only)
- Use for request inspection/modification
- Cache subdomain extraction results if needed
- Return early if subdomain not needed

### ❌ DON'T
- Make database queries in middleware
- Heavy computations in middleware
- Set client-side only headers (use RSC for that)
- Redirect on every request without caching

## Next Steps

1. [Configure /etc/hosts](#supported-formats)
2. [Test middleware](#testing-the-middleware)
3. [Use in components](#usage-in-components)
4. Read [SETUP.md](SETUP.md) for full project setup
