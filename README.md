# Server-Rendered E-commerce Product Management Dashboard

## Overview
A full-featured admin dashboard built with Next.js for managing e-commerce products with server-side rendering for improved performance and SEO.

## Key Features
- ✅ Server-side rendering using Next.js for improved performance and SEO
- ✅ Complete product management with Create, Read, Update, and Delete (CRUD) operations
- ✅ Multi-step product creation forms with strong input validation using Zod
- ✅ Interactive data visualization for sales and stock metrics using Recharts
- ✅ Secure image upload and storage using cloud services (Cloudinary or AWS S3)
- ✅ Authentication and Authorization to ensure only eligible admins can log in
- ✅ Secure admin onboarding visible only to admins

## Tech Stack
- **Frontend & Backend:** Next.js 14 (App Router)
- **Data Fetching:** Server Components & Server Actions
- **Form Validation:** Zod
- **Data Visualization:** Recharts
- **Image Storage:** Cloudinary or AWS S3
- **Database:** MongoDB or PostgreSQL
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS

## Prerequisites
- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- Cloudinary account (for image uploads)

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ecommerce-admin-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce-admin
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce-admin

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Admin Credentials (for first-time setup)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Default Admin Credentials
For initial access to the dashboard:
- **Email:** admin@example.com
- **Password:** admin123

**⚠️ Important:** Change these credentials immediately after first login!

## Project Structure
```
ecommerce-admin-dashboard/
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard pages
│   ├── login/            # Login page
│   └── layout.tsx        # Root layout
├── components/           # React components
├── lib/                  # Utility functions
├── models/              # Database models
├── public/              # Static files
└── types/               # TypeScript types
```

## Features in Detail

### 1. Product Management
- Add new products with validation
- View all products in a responsive table
- Edit existing product details
- Delete products with confirmation

### 2. Data Visualization
- Interactive charts showing sales trends
- Stock level monitoring
- Revenue analytics

### 3. Authentication
- Secure login with NextAuth.js
- Session management
- Protected routes

### 4. Image Upload
- Direct upload to Cloudinary
- Image preview before upload
- Automatic optimization

## Workflow
1. Admin requests the dashboard page
2. Server fetches product data from the API/database
3. Page is rendered on the server and sent to the browser
4. Admin interacts with product forms and charts
5. Product data is created, updated, or deleted
6. UI refreshes by re-fetching the latest data

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
- Can be deployed to any Node.js hosting platform
- Ensure environment variables are properly configured

## Demo Video
[Link to demo video showcasing core features]

## License
MIT

## Support
For issues or questions, please open an issue on GitHub.
