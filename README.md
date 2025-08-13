# Connect Digitals Blog Backend

A comprehensive, modern blog backend API built with Node.js, Express, and MongoDB. Features include user authentication, blog post management, image uploads, and admin functionality.

## 🚀 Features

### Core Features
- **User Authentication & Authorization** - JWT-based auth with role-based access
- **Blog Post Management** - CRUD operations with rich content support
- **Image Upload** - Cloudinary integration with image optimization
- **Comment System** - User comments with moderation capabilities
- **Admin Dashboard** - Comprehensive admin panel with analytics
- **SEO Optimization** - Built-in SEO fields and metadata support

### Technical Features
- **RESTful API** - Clean, well-documented API endpoints
- **Database Indexing** - Optimized MongoDB queries with proper indexing
- **Security** - Helmet, rate limiting, CORS, input validation
- **Error Handling** - Comprehensive error handling and logging
- **File Upload** - Multer with Sharp image processing
- **Pagination** - Efficient pagination for large datasets

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd connect-digitals-blog-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/connect-digitals-blog
   MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/connect-digitals-blog

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d

   # Admin Configuration
   ADMIN_EMAIL=admin@connectdigitals.com
   ADMIN_PASSWORD=admin123456

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100

   # File Upload
   MAX_FILE_SIZE=5242880
   UPLOAD_PATH=./uploads

   # CORS
   CORS_ORIGIN=http://localhost:3000,https://yourdomain.com
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

5. **Seed the database** (optional)
   ```bash
   # The database will be automatically seeded on first run
   # Or you can run seeding manually in the code
   ```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Blog Endpoints

#### Get All Published Posts
```http
GET /api/blog?page=1&limit=6&category=Graphic Design&search=design
```

#### Get Featured Posts
```http
GET /api/blog/featured
```

#### Get Post by Slug
```http
GET /api/blog/the-power-of-visual-balance
```

#### Create New Post (Protected)
```http
POST /api/blog
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Blog Post",
  "excerpt": "Brief description...",
  "content": "Full blog content...",
  "category": "Graphic Design",
  "tags": ["design", "principles"],
  "featuredImage": {
    "url": "https://example.com/image.jpg",
    "alt": "Image description"
  },
  "status": "draft"
}
```

#### Add Comment
```http
POST /api/blog/:id/comments
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "comment": "Great article!"
}
```

### Upload Endpoints

#### Upload Single Image
```http
POST /api/upload/image
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- image: [file]
```

#### Upload Avatar
```http
POST /api/upload/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- avatar: [file]
```

### Admin Endpoints

#### Get Dashboard Stats
```http
GET /api/admin/dashboard
Authorization: Bearer <admin-token>
```

#### Get All Posts (Admin View)
```http
GET /api/admin/posts?status=draft&page=1&limit=10
Authorization: Bearer <admin-token>
```

#### Update Post Status
```http
PUT /api/admin/posts/:id/status
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "published"
}
```

#### Get Comments for Moderation
```http
GET /api/admin/comments?isApproved=false&page=1
Authorization: Bearer <admin-token>
```

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin|editor|author),
  avatar: { url: String, publicId: String },
  bio: String,
  socialLinks: { website, twitter, linkedin, instagram },
  isActive: Boolean,
  lastLogin: Date,
  // ... other fields
}
```

### Blog Model
```javascript
{
  title: String,
  slug: String (auto-generated),
  excerpt: String,
  content: String,
  author: ObjectId (ref: User),
  authorName: String,
  featuredImage: { url: String, alt: String, publicId: String },
  category: String,
  tags: [String],
  readTime: Number,
  status: String (draft|published|archived),
  isFeatured: Boolean,
  views: Number,
  likes: Number,
  comments: [CommentSchema],
  seo: { metaTitle, metaDescription, keywords },
  publishedAt: Date,
  // ... timestamps
}
```

## 🔐 Authentication & Authorization

### User Roles
- **Admin**: Full access to all features
- **Editor**: Can create, edit, and manage posts
- **Author**: Can create and edit their own posts

### JWT Token
Include the JWT token in the Authorization header:
```http
Authorization: Bearer <your-jwt-token>
```

## 🖼️ Image Upload

The system uses Cloudinary for image storage and processing:

- **Automatic Optimization**: Images are automatically resized and optimized
- **Multiple Formats**: Support for various image formats
- **Secure URLs**: All images are served via HTTPS
- **Organized Storage**: Images are organized in folders by type

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI_PROD=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
CORS_ORIGIN=https://yourdomain.com
```

### Deployment Platforms
- **Heroku**: Easy deployment with MongoDB Atlas
- **Vercel**: Serverless deployment option
- **DigitalOcean**: VPS deployment
- **AWS**: EC2 or Lambda deployment

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📊 Monitoring & Analytics

The API includes built-in monitoring:
- Request logging with Morgan
- Error tracking and logging
- Performance monitoring
- Rate limiting analytics

## 🔧 Customization

### Adding New Categories
Edit the Blog model in `models/Blog.js`:
```javascript
category: {
  type: String,
  enum: {
    values: [
      'Graphic Design',
      'Branding',
      // Add your new categories here
      'Your New Category'
    ]
  }
}
```

### Customizing Image Processing
Modify the upload routes in `routes/upload.js` to adjust:
- Image dimensions
- Quality settings
- File size limits
- Supported formats

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact: admin@connectdigitals.com

## 🔄 Updates

Stay updated with the latest features and security patches by regularly pulling from the main branch.

---

**Built with ❤️ by Connect Digitals** 
