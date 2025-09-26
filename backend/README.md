# Mini Social Media - Backend

A full-featured social media backend API built with Node.js, Express.js, and MongoDB.

## Features

- User authentication (registration, login, JWT tokens)
- User profiles with customizable information
- Create, read, update, delete posts
- Like and comment on posts
- Follow/unfollow users
- User feed with posts from followed users
- Search functionality
- Image support via URLs
- Hashtags and mentions support

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing
- **multer** - File upload handling
- **cloudinary** - Image hosting (optional)

## Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/social-media
   JWT_SECRET=your-super-secret-jwt-key-here
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   ```

5. Make sure MongoDB is running on your system

6. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Posts
- `GET /api/posts` - Get all posts (with pagination)
- `POST /api/posts` - Create a new post
- `GET /api/posts/:postId` - Get single post
- `DELETE /api/posts/:postId` - Delete post
- `POST /api/posts/:postId/like` - Like/unlike post
- `POST /api/posts/:postId/comment` - Add comment to post
- `GET /api/posts/user/:userId` - Get posts by user
- `GET /api/posts/search/:query` - Search posts

### Users
- `GET /api/users` - Get all users (with search)
- `GET /api/users/:userId` - Get user profile
- `POST /api/users/:userId/follow` - Follow/unfollow user
- `GET /api/users/:userId/followers` - Get user followers
- `GET /api/users/:userId/following` - Get user following
- `GET /api/users/:userId/feed` - Get personalized feed
- `GET /api/users/:userId/suggestions` - Get suggested users

## Database Schema

### User Model
- `username` - Unique username
- `email` - User email
- `password` - Hashed password
- `firstName` - First name
- `lastName` - Last name
- `bio` - User bio (optional)
- `profilePicture` - Profile picture URL
- `followers` - Array of user IDs
- `following` - Array of user IDs
- `isVerified` - Verification status

### Post Model
- `content` - Post content (max 280 characters)
- `author` - Reference to User
- `image` - Image URL (optional)
- `likes` - Array of user IDs who liked
- `comments` - Array of comment objects
- `shares` - Array of user IDs who shared
- `hashtags` - Array of hashtags
- `mentions` - Array of mentioned user IDs

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (not implemented yet)

## Environment Variables

Make sure to set up the following environment variables:

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT token signing
- `CLOUDINARY_*` - Cloudinary credentials (optional)

## License

MIT License