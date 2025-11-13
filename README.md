Todo List Application

This is a todo list app I built using React for the frontend and Node.js for the backend. Both are written in TypeScript. Users can sign up, log in, and manage their todos.

Project Structure

The project has two main folders:
- backend folder has the Node.js Express API
- frontend folder has the React app

What It Does

Users can:
- Sign up with email and password
- Log in and get a JWT token
- Reset password if they forget it
- Create todos with title and description
- See all their todos
- Edit todos
- Delete todos
- Mark todos as done or not done

Backend Stuff

The backend uses:
- Express for the API
- MongoDB with Mongoose
- JWT tokens for login
- bcrypt to hash passwords
- Zod to validate inputs
- All errors get logged to MongoDB
- Error handling middleware

Frontend Stuff

The frontend uses:
- React Router to navigate between pages
- Zustand to manage global state
- React Query to fetch data from API
- React Hook Form for forms
- Zod to validate forms
- Axios to make API calls

What You Need

Before starting:
- Install Node.js version 20 or newer
- Create a free MongoDB Atlas account
- Get your MongoDB connection string from Atlas

How to Set It Up

First, install all the packages:

npm install

This installs everything for both backend and frontend.

Next, set up the backend environment file. Go to the backend folder and copy the example file:

cd backend
copy env.example .env

Then open the .env file and fill in these values:

PORT=4000
MONGODB_URI=your-mongodb-connection-string-here
JWT_SECRET=your-long-random-secret-string-here
CLIENT_URL=http://localhost:5173
RESET_TOKEN_EXPIRY_MINUTES=30

You need to:
- Put your real MongoDB connection string in MONGODB_URI
- Generate a random string for JWT_SECRET (make it at least 32 characters long)
- CLIENT_URL should be the frontend URL

Now set up the frontend environment file. Go to the frontend folder:

cd frontend
copy env.example .env

Open the .env file and add:

VITE_API_URL=http://localhost:4000/api

If your backend runs on a different port, change this.

MongoDB Atlas Setup

To get your MongoDB connection string:
1. Log into MongoDB Atlas
2. Create a free cluster if you don't have one
3. Go to Database Access and create a database user with username and password
4. Go to Network Access and add your IP address, or add 0.0.0.0/0 to allow access from anywhere
5. Click Connect on your cluster
6. Choose Connect your application
7. Copy the connection string
8. Replace the username and password in the connection string with your actual credentials
9. Add your database name at the end, like /todo-app

How to Run

To start everything in development mode, run from the project root:

npm run dev

This starts:
- Backend on http://localhost:4000
- Frontend on http://localhost:5173

Open http://localhost:5173 in your browser to use the app.

To build for production:

npm run build

This compiles the TypeScript code and builds the React app. The built files go in backend/dist and frontend/dist.

How to Use the App

To create an account:
1. Click Sign up
2. Enter your name, email, and password
3. Submit the form
4. You will be logged in automatically

To log in:
1. Click Login
2. Enter your email and password
3. Click login
4. You will go to the todos page

To manage todos:
- Fill the form at the top to add a new todo
- Click Edit on any todo to change it
- Click the checkbox to mark it done or not done
- Click Delete to remove a todo

To reset password:
1. Click Forgot Password
2. Enter your email
3. The reset token will be in the API response (for testing)
4. Copy the token
5. Go to Reset Password page
6. Enter your email, the token, and your new password

Technical Info

Backend uses:
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for auth
- bcrypt for passwords
- Zod for validation
- Helmet and CORS

Frontend uses:
- React 18 with TypeScript
- Vite
- React Router
- Zustand
- React Query
- React Hook Form
- Zod
- Axios

Database Collections

There are three collections in MongoDB:
- users collection stores user accounts
- todos collection stores todo items
- logs collection stores error logs

Important Notes

1. Email is not set up, so password reset tokens come back in the API response. In real production you would send them by email.

2. The app runs on localhost. Backend is on port 4000 and frontend is on port 5173. You can change these in the env files.

3. All errors get saved to MongoDB in the logs collection so I can debug issues.

4. JWT tokens are used for login. They expire after some time and you need to log in again.

5. Most API routes need you to be logged in. Only signup, login, forgot password, and reset password don't need auth.

If Something Goes Wrong

If you can't connect:
- Check your MongoDB connection string is correct
- Make sure your IP is allowed in Atlas Network Access
- Make sure the backend is running before opening the frontend
- Look at the browser console and terminal for errors

If login doesn't work:
- Check JWT_SECRET is set in backend .env
- Check tokens are saved in browser localStorage
- Clear browser cache and try again

If todos don't load:
- Check frontend .env has the right API URL
- Make sure backend is running on the right port
- Check your MongoDB connection works
