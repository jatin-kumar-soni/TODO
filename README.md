Todo application project

This project uses Node.js and React with TypeScript for both backend and frontend.

Requirements
Install Node.js 20 or newer.
Create a free MongoDB Atlas cluster and connection string.

Setup steps
Run npm install in the project root.
Copy backend/env.example to backend/.env and fill real values for MongoDB, JWT secret, and client url.
Copy frontend/env.example to frontend/.env if you need to point to a different api url.

Development
Run npm run dev from the project root. This command starts the backend on port 4000 and the frontend on port 5173.

Build
Run npm run build to compile both applications.

Testing notes
Create an account, then log in and add, edit, complete, and delete todos.
Use the forgot password screen to generate a reset token that appears in the response for demo purposes.

Assumptions
Email delivery is not configured, so the reset token is returned in the response to keep the flow testable.
The demo runs on localhost and requires the backend and frontend to stay on ports 4000 and 5173.