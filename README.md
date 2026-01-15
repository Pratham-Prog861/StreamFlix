# 🎬 StreamFlix - Professional Video Streaming Platform

A full-stack video streaming platform built with React, Node.js, Express, and MongoDB. Features include user authentication, TMDB-powered video imports, Vidking player integration, and a modern, responsive UI.

![StreamFlix](https://img.shields.io/badge/StreamFlix-Video%20Platform-red?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.0-blue?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen?style=flat-square&logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-Enabled-blue?style=flat-square&logo=typescript)

## ✨ Features

### 🔐 Authentication & Authorization

- **Admin Bootstrapping**: The first user to register automatically becomes an **Admin**.
- User registration and login with JWT tokens.
- Role-based access control (User/Admin).
- Secure password hashing with bcrypt.
- Protected routes and API endpoints.

### 👤 User Management

- Profile editing (name, email, avatar).
- Avatar upload (file or URL).
- Personal watchlist functionality.
- Real-time profile updates.

### 🎥 Video Management (Admin)

- **TMDB Integration**: Search and import movies and TV shows directly from The Movie Database (TMDB).
- **Vidking Player**: Seamless integration with Vidking for high-quality video embedding.
- Automatic metadata fetching (posters, backdrops, descriptions, ratings).
- Video deletion with full cleanup.
- **Clear Cache**: Admin tool to clear local storage and sync with the backend.

### 📺 Video Playback & UI

- **Centered Search Bar**: Modern, accessible search bar centered in the header.
- **Real-time Search**: Instant search results with a dropdown preview.
- Responsive design optimized for mobile, tablet, and desktop.
- Premium aesthetics with glassmorphism and smooth transitions.

### 🗄️ Database

- MongoDB with Mongoose ODM.
- Real-time synchronization.
- Efficient querying with pagination.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or Atlas)
- **TMDB API Key** (Get one at [themoviedb.org](https://www.themoviedb.org/))
- **npm** or **yarn**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/pratham-prog861/StreamFlix.git
cd streamflix
```

2. **Setup Backend**

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
JWT_SECRET=your_super_secret_jwt_key
TMDB_API_KEY=your_tmdb_api_key_here
CLIENT_URL=http://localhost:3000
```

3. **Setup Frontend**

```bash
cd ../client
npm install
```

4. **Run the Application**

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

## 👨‍💼 Admin Access

StreamFlix features **Automatic Admin Bootstrapping**. The very first account registered on the platform will be granted the `admin` role automatically.

1. Go to the [Register](http://localhost:3000/register) page.
2. Create your account.
3. You will now have access to the **Admin** tab in the header.

## 📁 Project Structure

```bash
streamflix/
├── client/                      # React Frontend
│   ├── components/              # Reusable UI components
│   │   ├── Header.tsx          # Navigation header (Centered Search)
│   │   ├── SearchInput.tsx     # Real-time search component
│   │   └── ...
│   ├── context/                # React Context API
│   │   ├── AuthContext.tsx     # Authentication state
│   │   └── VideoContext.tsx    # Video state (Real data only)
│   ├── pages/                  # Page components
│   │   ├── HomePage.tsx        # Landing page (Empty state handled)
│   │   ├── AdminPage.tsx       # TMDB Import & Cache Management
│   │   └── ...
│   └── ...
├── server/                      # Node.js Backend
│   ├── models/                 # Mongoose models
│   │   ├── User.js             # User schema with roles
│   │   └── Video.js            # Video schema with TMDB support
│   ├── routes/                 # API routes
│   │   ├── auth.js             # Auth with bootstrapping & logs
│   │   └── video.js            # Video search & import logic
│   └── ...
└── README.md
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint             | Description       | Auth      |
| ------ | -------------------- | ----------------- | --------- |
| POST   | `/api/auth/register` | Register new user | Public    |
| POST   | `/api/auth/login`    | Login user        | Public    |
| GET    | `/api/auth/me`       | Get current user  | Protected |

### Videos

| Method | Endpoint                  | Description                | Auth   |
| ------ | ------------------------- | -------------------------- | ------ |
| GET    | `/api/videos`             | Get all videos (paginated) | Public |
| GET    | `/api/videos/search-tmdb` | Search TMDB for content    | Admin  |
| POST   | `/api/videos/import`      | Import video from TMDB     | Admin  |
| DELETE | `/api/videos/:id`         | Delete video               | Admin  |

## 🎬 Video Import System

StreamFlix uses a streamlined import system:

1. **Search**: Admins search for movies or TV shows using the TMDB API.
2. **Import**: One-click import fetches all metadata and sets up the Vidking embed.
3. **Sync**: The frontend immediately refreshes to show the new content.

## 🎨 Tech Stack

### Frontend

- **React 19** & **TypeScript**
- **Vite** (Build Tool)
- **Tailwind CSS** (Styling)
- **Context API** (State Management)

### Backend

- **Node.js** & **Express**
- **MongoDB** & **Mongoose**
- **JWT** (Authentication)
- **TMDB API** (Content Discovery)

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a Pull Request.

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Built with ❤️ by Pratham Darji

---

## Happy Streaming! 🎬✨
