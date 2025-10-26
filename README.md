# CipherStudio 🚀

A browser-based React IDE that enables users to create, edit, and preview React applications directly in the browser. Built with modern web technologies, CipherStudio provides a seamless development experience similar to CodeSandbox or StackBlitz.

## ✨ Features

- **Full-Featured Code Editor**: Monaco Editor integration with syntax highlighting, IntelliSense, and code completion
- **Real-Time Preview**: Live preview of React applications using Sandpack
- **Project Management**: Create, save, and manage multiple projects
- **File System**: Intuitive file explorer with support for folders and files
- **Authentication**: Secure user authentication and authorization
- **Cloud Storage**: AWS S3 integration for file storage
- **Responsive Design**: Beautiful UI built with TailwindCSS
- **Hot Module Replacement**: Instant updates during development

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Monaco Editor** - Code editor
- **Sandpack** - Live preview environment
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Zustand** - State management
- **Axios** - HTTP client
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **AWS S3** - File storage
- **bcrypt** - Password hashing

## 📦 Project Structure

```
├── client/                    # Frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Common/      # Reusable components
│   │   │   ├── Editor/      # Code editor components
│   │   │   ├── FileExplorer/# File tree components
│   │   │   ├── Layout/      # Layout components
│   │   │   └── Preview/     # Preview components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json
│
└── server/                   # Backend application
    ├── src/
    │   ├── config/          # Configuration files
    │   ├── controllers/     # Request handlers
    │   ├── middleware/      # Express middleware
    │   ├── models/          # Mongoose models
    │   ├── routes/          # API routes
    │   └── utils/           # Utility functions
    ├── server.js            # Entry point
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- AWS Account (for S3 storage)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cipherstudio
   ```

2. **Install dependencies**

   For the client:
   ```bash
   cd client
   npm install
   ```

   For the server:
   ```bash
   cd server
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   AWS_BUCKET_NAME=your_s3_bucket_name
   CLIENT_URL=http://localhost:5173
   ```

   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development servers**

   Start the backend:
   ```bash
   cd server
   npm start
   ```

   Start the frontend:
   ```bash
   cd client
   npm run dev
   ```

5. **Access the application**
   
   Open your browser and navigate to `http://localhost:5173`

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all user projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Files
- `GET /api/files/project/:projectId` - Get all files for a project
- `POST /api/files` - Create a new file
- `PUT /api/files/:id` - Update file
- `DELETE /api/files/:id` - Delete file

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🎨 Key Components

### CodeEditor
Monaco Editor integration with:
- Syntax highlighting
- Auto-completion
- Multi-file support
- Tab management

### FileExplorer
Tree-based file system with:
- Folder creation
- File creation
- Drag and drop (future)
- Context menus

### SandpackPreview
Live preview using Sandpack with:
- Hot module replacement
- Error handling
- Console output

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Protected routes

## 🌟 Future Enhancements

- [ ] Collaborative editing (WebSockets)
- [ ] Version control integration
- [ ] Terminal integration
- [ ] Extension marketplace
- [ ] Theme customization
- [ ] Export to GitHub
- [ ] Multi-language support
- [ ] Code snippets library

## 📝 Scripts

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Server
- `npm start` - Start server
- `npm run dev` - Start server with nodemon (development)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

