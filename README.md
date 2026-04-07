# RentFlow Maintenance Tracker

A comprehensive full-stack application for managing maintenance requests in rental properties. Built with React for the frontend and Node.js/Express for the backend, this system allows property managers and administrators to efficiently track, assign, and resolve maintenance issues.

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Role-Based Access**: Admin and Manager roles with different permissions
- **Maintenance Request Management**: Create, view, update, and track maintenance requests
- **Property Management**: Organize requests by property
- **Priority System**: Low, medium, and high priority levels for requests
- **Status Tracking**: Monitor request progress (pending, in progress, resolved)
- **Assignment System**: Assign requests to specific users
- **Notes System**: Add detailed notes to maintenance requests
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Real-time Analytics**: Vercel Analytics integration for usage insights

## Tech Stack

### Frontend

- **React 19** - Modern JavaScript library for building user interfaces
- **React Router** - Declarative routing for React
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icon library
- **Vercel Analytics** - Web analytics and performance monitoring

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or cloud service like MongoDB Atlas)

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/rentflow-maintenance.git
   cd rentflow-maintenance
   ```

2. **Backend Setup**

   ```bash
   cd maintenance-tracker-backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../rentflow-maintenance-frontend
   npm install
   ```

## Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `maintenance-tracker-backend` directory:

```env
MONGO_URI=mongodb://localhost:27017/rentflow-maintenance
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
NODE_ENV=development
```

### Frontend Environment Variables

Create a `.env` file in the `rentflow-maintenance-frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode

1. **Start the Backend Server**

   ```bash
   cd maintenance-tracker-backend
   npm run dev
   ```

   The server will start on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd rentflow-maintenance-frontend
   npm start
   ```
   The app will open in your browser at `http://localhost:3000`

### Production Build

1. **Build the Frontend**

   ```bash
   cd rentflow-maintenance-frontend
   npm run build
   ```

2. **Start the Backend in Production**
   ```bash
   cd maintenance-tracker-backend
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Users

- `GET /api/users` - Get all users (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Maintenance Requests

- `GET /api/requests` - Get all requests
- `POST /api/requests` - Create new request
- `PUT /api/requests/:id` - Update request
- `DELETE /api/requests/:id` - Delete request

## Project Structure

```
rentflow-maintenance/
├── maintenance-tracker-backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Request.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── requests.js
│   │   └── users.js
│   ├── package.json
│   └── server.js
├── rentflow-maintenance-frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## User Roles

- **Admin**: Full access to all features including user management
- **Manager**: Can manage maintenance requests and properties

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, please contact the KwesiTheDev or create an issue in the repository.

---

Built with ❤️ for efficient property maintenance management
