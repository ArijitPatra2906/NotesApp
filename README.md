# Full Stack Project: Note taking app

This project contains two main components:

1. **Client**: A React-based frontend application.
2. **Server**: A Node.js and Express-based backend API.

## Prerequisites

Before starting, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16.x or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [TypeScript](https://www.typescriptlang.org/) (for the server)

## Getting Started

### 1. Clone the Repository

git clone <repository-url>
cd <repository-directory>

### 2. Install Dependencies

cd client
npm install

cd ../server
npm install

### 3. Running the Project

1. Run the Client

cd client
npm start

The React development server will start at http://localhost:3000. 2. Run the Server

cd server
npm run dev
The Express server will start at http://localhost:4040.
Building the Project

1. Build the Client

cd client
npm run build
The production build will be available in the client/build directory. 2. Build the Server

cd server
npm run build
The TypeScript files will be compiled into JavaScript in the server/dist directory.
Environment Variables
Server
Create a .env file in the server directory with the following variables:

env
PORT=4040
MONGO_URL=mongodb+srv://patraarijit440:9kgBSitcogHNdVe1@cluster0.6sy6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=rgergiubery59y459y454
EMAIL_USER=patraarijit440@gmail.com

Client
Create a .env file in the client directory for frontend-specific environment variables:

env
REACT_APP_BASEURL=https://notesapp-zo6e.onrender.com
