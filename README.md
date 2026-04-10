# TRIport by Helix

A request-based distributed manufacturing platform centred around 3D printing. TRIport connects customers with Helix members (manufacturers). Users browse products and submit requests — it is **not** an e-commerce checkout system.

---

## What is TRIport?

TRIport is the customer-facing platform of Helix. Customers browse a catalog of 3D-printable products, submit a request for the items they need, and Helix reviews and fulfils those requests. There is no instant checkout — every item is manufactured on demand following a request-and-confirm workflow.

---

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Server Actions** for form submissions
- **JSON file storage** for all request data (no database required)

---

## Running Locally

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm run start
```

---

## Project Structure

```
src/
  app/                        # Next.js App Router pages
    page.tsx                  # Home page
    layout.tsx                # Root layout (Navbar, Footer)
    not-found.tsx             # 404 page
    products/
      page.tsx                # All products with category filter
      [slug]/page.tsx         # Individual product + request form
    custom-request/page.tsx   # Custom print request form
    about/page.tsx            # About Helix and TRIport
    admin/
      requests/page.tsx       # Read-only requests dashboard
      submit-product/page.tsx # Product submission form
  components/
    Navbar.tsx                # Responsive navbar
    Footer.tsx                # Site footer
    ProductCard.tsx           # Product grid card
    Toast.tsx                 # Toast notification
  data/
    products.ts               # Mock product catalog (10 products)
  types/
    index.ts                  # TypeScript interfaces
  actions/
    requests.ts               # Server actions (read/write JSON files)

data/                         # Runtime data directory (git-ignored)
  buy-requests.json           # Submitted buy requests
  custom-requests.json        # Submitted custom requests
  product-submissions.json    # Admin product submissions
```

---

## How to Add or Edit Products

Products are defined in `src/data/products.ts` as a typed array of `Product` objects.

Each product has:

| Field              | Type      | Description                              |
|--------------------|-----------|------------------------------------------|
| `id`               | string    | Unique identifier                        |
| `name`             | string    | Display name                             |
| `slug`             | string    | URL slug (e.g. `adjustable-phone-stand`) |
| `shortDescription` | string    | One-line summary for cards               |
| `fullDescription`  | string    | Full detail page description             |
| `category`         | string    | Must match an entry in `categories`      |
| `estimatedPrice`   | number    | Starting price in USD                    |
| `image`            | string    | Absolute image URL                       |
| `featured`         | boolean   | Shows on homepage if true                |
| `tags`             | string[]  | Searchable tags                          |

To add a new product, append an object to the `products` array in `src/data/products.ts` and ensure the slug is unique.

To add a new category, append it to the `categories` array in the same file.

---

## How Requests are Stored

All requests are written to JSON files in the `data/` directory at the project root. The directory and files are created automatically on first submission if they do not exist.

| File                             | Content                          |
|----------------------------------|----------------------------------|
| `data/buy-requests.json`         | Product buy requests             |
| `data/custom-requests.json`      | Custom design requests           |
| `data/product-submissions.json`  | Admin product submissions        |

Each entry has an auto-generated `id` (timestamp + random string) and a `createdAt` ISO timestamp.

The Admin Requests page (`/admin/requests`) reads these files and displays them in a table/card layout. This page is a server component and fetches fresh data on every request.

---

## Pages Overview

| Route                      | Description                                      |
|----------------------------|--------------------------------------------------|
| `/`                        | Homepage — hero, process steps, featured products |
| `/products`                | Full catalog with category filter                 |
| `/products/[slug]`         | Product detail + buy request form                 |
| `/custom-request`          | Custom project request form                       |
| `/about`                   | About Helix and TRIport                          |
| `/admin/requests`          | Dashboard showing all submitted requests          |
| `/admin/submit-product`    | Form to add a product to the catalog              |

---

## Next Development Steps

1. **Authentication** — Protect `/admin/*` routes with a proper auth layer (NextAuth or Clerk)
2. **Database** — Migrate from JSON file storage to a database (Postgres via Prisma, or Supabase)
3. **Email notifications** — Send confirmation emails to customers on request submission (Resend or Nodemailer)
4. **Request status tracking** — Add status field to requests (pending / reviewed / confirmed / in-production / complete)
5. **Image uploads** — Replace image URL input with file upload (Cloudinary or Vercel Blob)
6. **Product CMS** — Move products from hardcoded TypeScript to a database or headless CMS
7. **Slug generation** — Auto-generate URL slugs from product names in the admin form
8. **Search** — Add full-text search across the product catalog
9. **Helix member portal** — Dashboard for manufacturers to claim and fulfil requests
10. **Deployment** — Deploy to Vercel with environment-based data storage

---

## Design System

- **Font:** Inter (Google Fonts)
- **Primary accent:** Gold `#C9A84C` (Tailwind class: `gold`)
- **Palette:** White dominant, neutral grays for text, dark `neutral-950` for dark sections
- **Style:** Minimal, premium, slightly technical aesthetic
- **Spacing:** Generous whitespace throughout
