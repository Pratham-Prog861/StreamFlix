# StreamFlix Backend

Complete video streaming platform backend with user management and admin video controls.

## Features

- JWT authentication with role-based access (user/admin)
- User registration, login, and profile management
- Admin video upload with automatic thumbnail generation
- Video CRUD operations with database sync
- Real-time updates between frontend and backend
- Secure password hashing
- File upload handling with validation
- FFmpeg video processing

## Setup

1. Install dependencies:

```bash
npm install
```

2. Install FFmpeg (required for thumbnail generation):

   - Windows: Download from https://ffmpeg.org/download.html
   - Add FFmpeg to your system PATH

3. Create `.env` file:

```bash
copy .env.example .env
```

4. Update `.env` with your configuration:

   - Set MongoDB URI
   - Set JWT secret
   - Configure ports and URLs

5. Start MongoDB (if running locally)

6. Run the server:

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Users

- `PUT /api/users/profile` - Update user profile (protected)
- `GET /api/users/profile/:id` - Get user profile

### Videos

- `GET /api/videos` - Get all videos (paginated)
- `GET /api/videos/:id` - Get single video
- `POST /api/videos` - Upload video (admin only)
- `PUT /api/videos/:id` - Update video (admin only)
- `DELETE /api/videos/:id` - Delete video (admin only)

## Default Admin Setup

To create an admin user, register normally then update the user in MongoDB:

```javascript
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } });
```

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Multer (file uploads)
- FFmpeg (video processing)
- bcryptjs (password hashing)
