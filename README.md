# Mica Website

A Node.js website with product management and contact form functionality.

## Features

- Admin panel with authentication
- Product management (CRUD operations)
- Contact form for customer inquiries
- Responsive design using Tailwind CSS
- Image upload functionality
- MongoDB database integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd mica-website
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGO_URI=mongodb://localhost/mica
MONGO_URI_TEST=mongodb://localhost/mica-test
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=24h
```

4. Build the CSS:

```bash
npm run build:css
```

5. Create required directories:

```bash
mkdir -p public/uploads
```

## Running the Application

1. Start the development server:

```bash
npm run dev
```

2. For production:

```bash
npm run build:css
npm start
```

3. Run tests:

```bash
npm test
```

The application will be available at `http://localhost:3000`

## Admin Setup

1. Create an admin user in MongoDB:

```javascript
use mica
db.admins.insertOne({
  email: "admin@example.com",
  password: "$2a$10$..." // Use bcrypt to hash the password
})
```

2. Access the admin panel at `http://localhost:3000/admin/login`

## API Notes

- The endpoint `/api/admin/check-auth` is available for client-side authentication checks. It returns `{ success: true }` if the token is valid.

## Project Structure

```
.
├── public/
│   ├── css/
│   │   └── style.css (compiled from Tailwind)
│   ├── js/
│   ├── uploads/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── express.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── productController.js
│   │   ├── contactController.js
│   │   └── viewController.js
│   ├── css/
│   │   └── tailwind.css (source CSS)
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── admin.js
│   │   ├── product.js
│   │   └── contact.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── product.js
│   │   ├── contact.js
│   │   └── view.js
│   ├── services/
│   │   ├── adminService.js
│   │   ├── productService.js
│   │   └── contactService.js
│   ├── views/
│   │   ├── layouts/
│   │   │   ├── header.ejs
│   │   │   └── footer.ejs
│   │   ├── admin/
│   │   │   ├── dashboard.ejs
│   │   │   └── login.ejs
│   │   ├── 404.ejs
│   │   ├── index.ejs
│   │   ├── products.ejs
│   │   └── contact.ejs
│   └── index.js
├── .env
├── .gitignore
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── README.md
```
