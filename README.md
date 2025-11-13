Todo List Application

This is a full stack todo list application built with React and Node.js, both using TypeScript. The application includes user authentication with JWT tokens and full CRUD operations for managing todos.

Project Structure

The project is organized as a monorepo with two main workspaces:
- backend: Node.js Express API with TypeScript
- frontend: React application with Vite and TypeScript

Features

User Management
- User signup with email and password
- User login with JWT authentication
- Forgot password functionality
- Reset password with token validation

Todo Management
- Create new todos with title and description
- View all todos in a list
- Update existing todos
- Delete todos
- Mark todos as completed or incomplete

Backend Features
- RESTful API with Express
- MongoDB database using Mongoose
- JWT token authentication
- Password hashing with bcrypt
- Error logging to MongoDB
- Input validation with Zod schemas
- Proper error handling middleware

Frontend Features
- React Router for navigation
- Zustand for global state management
- React Query for API data fetching
- React Hook Form for form handling
- Zod schemas for form validation
- Responsive UI design

Requirements

Before running the application, make sure you have:
- Node.js version 20 or newer installed
- A MongoDB Atlas account with a free cluster created
- MongoDB connection string from Atlas

Setup Instructions

Step 1: Install Dependencies

Run the following command in the project root directory:

npm install

This will install all dependencies for both backend and frontend workspaces.

Step 2: Configure Backend Environment

Navigate to the backend directory and copy the example environment file:

cd backend
copy env.example .env

Open the .env file and update the following values:

PORT=4000
MONGODB_URI=your-mongodb-connection-string-here
JWT_SECRET=your-long-random-secret-string-here
CLIENT_URL=http://localhost:5173
RESET_TOKEN_EXPIRY_MINUTES=30

Important notes:
- Replace MONGODB_URI with your actual MongoDB Atlas connection string
- Generate a strong random string for JWT_SECRET (at least 32 characters)
- The CLIENT_URL should match your frontend URL

Step 3: Configure Frontend Environment

Navigate to the frontend directory and copy the example environment file:

cd frontend
copy env.example .env

Open the .env file and set the API URL:

VITE_API_URL=http://localhost:4000/api

If your backend runs on a different port, update this value accordingly.

Step 4: MongoDB Atlas Setup

To get your MongoDB connection string:
1. Log in to MongoDB Atlas
2. Create a free cluster if you haven't already
3. Go to Database Access and create a database user
4. Go to Network Access and add your IP address or allow access from anywhere (0.0.0.0/0)
5. Click Connect on your cluster and choose Connect your application
6. Copy the connection string and replace the username and password placeholders
7. Add your database name at the end of the connection string, for example: /todo-app

Running the Application

Development Mode

To start both backend and frontend in development mode, run from the project root:

npm run dev

This command will:
- Start the backend server on http://localhost:4000
- Start the frontend development server on http://localhost:5173

Open your browser and navigate to http://localhost:5173 to use the application.

Build for Production

To build both applications for production:

npm run build

This will:
- Compile the backend TypeScript code to JavaScript
- Build the frontend React application for production

The built files will be in:
- backend/dist for the backend
- frontend/dist for the frontend

Using the Application

Creating an Account

1. Click on Sign up in the navigation
2. Enter your name, email, and password
3. Submit the form to create your account
4. You will be automatically logged in after signup

Logging In

1. Click on Login in the navigation
2. Enter your email and password
3. Click the login button
4. You will be redirected to the todos page

Managing Todos

After logging in, you can:
- Add a new todo by filling the form at the top
- Click Edit on any todo to modify it
- Click the checkbox to mark a todo as completed or incomplete
- Click Delete to remove a todo permanently

Password Reset

If you forget your password:
1. Click on Forgot Password
2. Enter your email address
3. The reset token will be returned in the API response (for demo purposes)
4. Copy the token and go to Reset Password page
5. Enter your email, the reset token, and your new password

Technical Details

Backend Stack
- Node.js with Express framework
- TypeScript for type safety
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt for password hashing
- Zod for validation
- Helmet for security headers
- CORS for cross-origin requests

Frontend Stack
- React 18 with TypeScript
- Vite for build tooling
- React Router for routing
- Zustand for state management
- React Query for server state
- React Hook Form for forms
- Zod for validation schemas
- Axios for HTTP requests

Database Collections

The application uses three main collections in MongoDB:
- users: Stores user account information
- todos: Stores todo items with user references
- logs: Stores application error logs

Assumptions and Notes

1. Email service is not configured. Password reset tokens are returned in the API response for testing purposes. In a production environment, these tokens would be sent via email.

2. The application runs on localhost by default. Backend uses port 4000 and frontend uses port 5173. These ports can be changed in the environment files if needed.

3. Error logs are stored in MongoDB in a separate logs collection for debugging and monitoring purposes.

4. JWT tokens are used for authentication. Tokens expire after a set period and users need to log in again.

5. All API routes require authentication except for signup, login, forgot password, and reset password endpoints.

Troubleshooting

If you encounter connection issues:
- Verify your MongoDB Atlas connection string is correct
- Check that your IP address is allowed in MongoDB Atlas Network Access
- Ensure the backend server is running before accessing the frontend
- Check browser console and terminal for error messages

If authentication fails:
- Verify JWT_SECRET is set in backend .env file
- Check that tokens are being stored in browser localStorage
- Clear browser cache and try logging in again

If todos are not loading:
- Verify the frontend .env has the correct API URL
- Check that the backend is running on the expected port
- Verify your MongoDB connection is working

License

This project is created as part of a coding assignment.
