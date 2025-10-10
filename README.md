# 🎬 StreamFlix - Professional Video Streaming Platform

A full-stack video streaming platform built with React, Node.js, Express, and MongoDB. Features include user authentication, admin video management, multi-quality video playback, and real-time database synchronization.

![StreamFlix](https://img.shields.io/badge/StreamFlix-Video%20Platform-red?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.0-blue?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen?style=flat-square&logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-Enabled-blue?style=flat-square&logo=typescript)

## ✨ Features

### 🔐 Authentication & Authorization

- User registration and login with JWT tokens
- Role-based access control (User/Admin)
- Secure password hashing with bcrypt
- Protected routes and API endpoints
- Persistent sessions with token storage

### 👤 User Management

- Profile editing (name, email, avatar)
- Avatar upload (file or URL)
- Real-time profile updates
- Personal watchlist functionality
- User dashboard

### 🎥 Video Management (Admin)

- Video upload with drag & drop
- Automatic thumbnail generation via FFmpeg
- Multi-quality video transcoding (360p, 480p, 720p, 1080p)
- Background processing for quality generation
- Video metadata management (title, description)
- Video deletion with cleanup
- View counter tracking

### 📺 Video Playback

- Adaptive quality selection
- Seamless quality switching
- Auto quality mode
- Playback position preservation
- Custom video player controls
- Responsive video player

### 🗄️ Database

- MongoDB with Mongoose ODM
- Real-time synchronization
- Relational data (users ↔ videos)
- Efficient querying with pagination
- Processing status tracking

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or Atlas)
- **FFmpeg** (for video processing)
- **npm** or **yarn**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/pratham-prog861/StreamFlix.git
cd streamflix
```

2.**Install FFmpeg**

**Windows:**

```bash
# Using Chocolatey
choco install ffmpeg

# Or download from https://ffmpeg.org/download.html
# Add to system PATH
```

**macOS:**

```bash
brew install ffmpeg
```

**Linux:**

```bash
sudo apt update
sudo apt install ffmpeg
```

Verify installation:

```bash
ffmpeg -version
```

3.**Setup Backend**

```bash
cd server
npm install
```

Create `.env` file:

```bash
copy .env.example .env  # Windows
cp .env.example .env    # macOS/Linux
```

Edit `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/streamflix
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

4.**Setup Frontend**

```bash
cd ../client
npm install
```

The `.env.local` is already configured:

```env
VITE_API_URL=http://localhost:5000/api
```

5.**Start MongoDB**

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
```

6.**Run the Application**

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd client
npm run dev
```

7.**Access the Application**

- Frontend: [Frontend](http://localhost:3000)

- Backend API: [Backend](http://localhost:5000/api)

## 👨‍💼 Creating an Admin User

1. Register a normal user account at [Register](http://localhost:3000/#/register)
2. Connect to MongoDB and update the user role:

```bash
mongosh
use streamflix
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

3.Logout and login again to access admin features

## 📁 Project Structure

```bash
streamflix/
├── client/                      # React Frontend
│   ├── components/              # Reusable UI components
│   │   ├── Header.tsx          # Navigation header
│   │   ├── VideoPlayer.tsx     # Custom video player with quality selector
│   │   ├── VideoCard.tsx       # Video thumbnail card
│   │   └── ...
│   ├── context/                # React Context API
│   │   ├── AuthContext.tsx     # Authentication state
│   │   └── VideoContext.tsx    # Video state management
│   ├── pages/                  # Page components
│   │   ├── HomePage.tsx        # Landing page
│   │   ├── VideoDetailPage.tsx # Video player page
│   │   ├── AdminPage.tsx       # Admin upload page
│   │   ├── ProfilePage.tsx     # User profile
│   │   ├── LoginPage.tsx       # Login page
│   │   └── RegisterPage.tsx    # Registration page
│   ├── services/               # API services
│   │   └── api.ts              # API client
│   ├── utils/                  # Utility functions
│   │   └── videoMapper.ts      # Data transformation
│   ├── types.ts                # TypeScript types
│   ├── App.tsx                 # Main app component
│   └── package.json
│
├── server/                      # Node.js Backend
│   ├── config/                 # Configuration
│   │   └── db.js               # MongoDB connection
│   ├── middleware/             # Express middleware
│   │   ├── auth.js             # JWT authentication
│   │   └── upload.js           # Multer file upload
│   ├── models/                 # Mongoose models
│   │   ├── User.js             # User schema
│   │   └── Video.js            # Video schema
│   ├── routes/                 # API routes
│   │   ├── auth.js             # Authentication endpoints
│   │   ├── user.js             # User endpoints
│   │   └── video.js            # Video endpoints
│   ├── utils/                  # Utility functions
│   │   └── videoProcessor.js   # FFmpeg video processing
│   ├── uploads/                # Uploaded files
│   │   ├── videos/             # Video files
│   │   └── thumbnails/         # Generated thumbnails
│   ├── server.js               # Express server
│   └── package.json
│
├── README.md                    # This file
├── SETUP.md                     # Detailed setup guide
├── QUALITY_FEATURE.md          # Quality selector documentation
└── .gitignore
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint             | Description       | Auth      |
| ------ | -------------------- | ----------------- | --------- |
| POST   | `/api/auth/register` | Register new user | Public    |
| POST   | `/api/auth/login`    | Login user        | Public    |
| GET    | `/api/auth/me`       | Get current user  | Protected |

### Users

| Method | Endpoint                 | Description      | Auth      |
| ------ | ------------------------ | ---------------- | --------- |
| PUT    | `/api/users/profile`     | Update profile   | Protected |
| GET    | `/api/users/profile/:id` | Get user profile | Public    |

### Videos

| Method | Endpoint          | Description                | Auth   |
| ------ | ----------------- | -------------------------- | ------ |
| GET    | `/api/videos`     | Get all videos (paginated) | Public |
| GET    | `/api/videos/:id` | Get single video           | Public |
| POST   | `/api/videos`     | Upload video               | Admin  |
| PUT    | `/api/videos/:id` | Update video               | Admin  |
| DELETE | `/api/videos/:id` | Delete video               | Admin  |

### Query Parameters

```bash
GET /api/videos?page=1&limit=12
```

## 🎨 Tech Stack

### Frontend

- **React 19.2.0** - UI library
- **TypeScript** - Type safety
- **React Router DOM** - Routing
- **Vite** - Build tool
- **Context API** - State management
- **Tailwind CSS** - Styling (via classes)

### Backend

- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **FFmpeg** - Video processing
- **express-validator** - Input validation
- **CORS** - Cross-origin support
- **Morgan** - HTTP logging

## 🎬 Video Quality System

### Automatic Transcoding

When an admin uploads a video, the system automatically generates multiple quality versions:

| Quality       | Resolution | Bitrate | Use Case                 |
| ------------- | ---------- | ------- | ------------------------ |
| 360p          | 640x360    | 800k    | Mobile, slow connections |
| 480p          | 854x480    | 1400k   | Standard viewing         |
| 720p HD       | 1280x720   | 2800k   | HD viewing               |
| 1080p Full HD | 1920x1080  | 5000k   | Best quality             |

### Processing Flow

1. Video uploaded → Available immediately in original quality
2. Background processing starts
3. FFmpeg generates multiple qualities (1-5 minutes)
4. All qualities become available
5. Users can switch quality seamlessly

### Quality Selection

- **Auto Mode**: Automatically selects best available quality
- **Manual Selection**: Users choose specific quality
- **Seamless Switching**: Maintains playback position
- **Smart Generation**: Only creates qualities that make sense

## 📊 Database Schema

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  role: 'user' | 'admin',
  createdAt: Date,
  updatedAt: Date
}
```

### Video Model

```javascript
{
  title: String,
  description: String,
  videoPath: String,
  qualities: {
    '360p': String,
    '480p': String,
    '720p': String,
    '1080p': String,
    original: String
  },
  thumbnailPath: String,
  duration: Number,
  uploader: ObjectId (ref: User),
  uploaderName: String,
  views: Number,
  processingStatus: 'processing' | 'completed' | 'failed',
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Configuration

### Environment Variables

## Backend (.env)

```env
PORT=5000                                    # Server port
MONGODB_URI=mongodb://localhost:27017/streamflix  # MongoDB connection
JWT_SECRET=your_secret_key                   # JWT signing key
NODE_ENV=development                         # Environment
CLIENT_URL=http://localhost:3000            # Frontend URL (for CORS)
```

## Frontend (.env.local)

```env
VITE_API_URL=http://localhost:5000/api      # Backend API URL
```

## 🧪 Testing

### Test Video Upload

1. Login as admin
2. Go to [Admin](http://localhost:3000/#/admin)
3. Upload a short video (10-30 seconds recommended for testing)
4. Wait for processing (check server logs)
5. Play the video and test quality selector

### Check Processing Status

```bash
# Server logs will show:
Generated 360p for video.mp4
Generated 480p for video.mp4
Generated 720p for video.mp4
Video 507f1f77bcf86cd799439011 processing completed
```

### MongoDB Queries

```javascript
// Check video processing status
db.videos.find({ processingStatus: 'processing' });

// View video qualities
db.videos.findOne({}, { title: 1, qualities: 1, processingStatus: 1 });

// Count total videos
db.videos.countDocuments();

// Find admin users
db.users.find({ role: 'admin' });
```

## 🐛 Troubleshooting

### FFmpeg not found

```bash
# Verify FFmpeg installation
ffmpeg -version

# Add to PATH if needed (Windows)
# System Properties → Environment Variables → Path → Add FFmpeg bin folder
```

### MongoDB connection error

```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB
mongod

# Or use MongoDB Atlas connection string
```

### CORS errors

- Ensure `CLIENT_URL` in backend `.env` matches frontend URL
- Check if backend is running on correct port

### Video upload fails

- Check file size (max 500MB)
- Verify uploads folders exist
- Check FFmpeg is working
- Review server logs for errors

### Quality selector not showing

- Check browser console for errors
- Verify video has `qualities` field in database
- Wait for processing to complete
- See `DEBUG_QUALITY.md` for detailed debugging

### Token expired

- Tokens last 30 days
- Logout and login again
- Clear localStorage if needed

## 📈 Performance

### Optimization Features

- Pagination for video lists
- Lazy loading of video thumbnails
- Background video processing
- Efficient database queries
- Static file caching
- Fast start optimization (movflags +faststart)

### Processing Time Estimates

| Video Length | Processing Time |
| ------------ | --------------- |
| 1 minute     | ~30 seconds     |
| 5 minutes    | ~2 minutes      |
| 10 minutes   | ~4 minutes      |
| 30 minutes   | ~12 minutes     |
| 1 hour       | ~25 minutes     |

Times vary based on server CPU\_

## 🔒 Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token authentication
- Protected API routes
- Role-based access control
- Input validation and sanitization
- CORS configuration
- File type validation
- File size limits
- SQL injection prevention (Mongoose)
- XSS protection

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables
2. Ensure MongoDB is accessible
3. Install FFmpeg on server
4. Deploy with `npm start`

### Frontend Deployment (Vercel/Netlify)

1. Build: `npm run build`
2. Set `VITE_API_URL` to production API
3. Deploy `dist` folder

### Production Checklist

- Change JWT_SECRET to strong random string
- Use MongoDB Atlas for production database
- Enable HTTPS
- Set NODE_ENV=production
- Configure proper CORS origins
- Set up CDN for video files (optional)
- Enable rate limiting
- Set up monitoring and logging
- Configure backup strategy

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Built with ❤️ by Pratham Darji

## 🙏 Acknowledgments

- FFmpeg for video processing
- MongoDB for database
- React team for amazing framework
- Express.js community
- All open-source contributors

## 📞 Support

For issues and questions:

- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting guide

## 🗺️ Roadmap

### Planned Features

- Video comments system
- Like/dislike functionality
- Video categories and tags
- Advanced search with filters
- User subscriptions
- Video playlists
- Watch history
- Video recommendations
- Social sharing
- Email notifications
- Video analytics dashboard
- Subtitle support
- Live streaming

### Potential Enhancements

- Adaptive bitrate streaming (HLS/DASH)
- CDN integration
- Video compression optimization
- Thumbnail preview on hover
- Picture-in-picture mode
- Keyboard shortcuts
- Dark/light theme toggle
- Multi-language support
- Video download options
- Advanced admin dashboard

---

## Happy Streaming! 🎬✨
