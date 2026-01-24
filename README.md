AI Background Removal App

A full-stack AI-powered web application to remove the background from images instantly. Built with React.js, Node.js, MongoDB, and cloud storage, this project enables users to upload images and download them with the background removed.

Features

Upload Images: Users can upload images in various formats.

Automatic Background Removal: AI-powered background removal for seamless results.

Preview and Download: View the processed image before downloading.

User Authentication: Secure login and registration using Clerk (or JWT).

Cloud Storage Integration: Processed images stored in Google Cloud Storage.

Responsive UI: Works on desktop and mobile devices.

Tech Stack

Frontend: React.js, Tailwind CSS

Backend: Node.js, Express.js

Database: MongoDB

Authentication: Clerk (or custom JWT-based auth)

Cloud Storage: Google Cloud Storage

Image Processing: AI/ML API for background removal

Installation

Clone the repository
cd bg-removal


Install dependencies

npm install
cd client
npm install


Environment Variables
Create a .env file in the root directory:

MONGODB_URI=<your-mongodb-uri>
CLOUD_STORAGE_KEY=<your-google-cloud-key>
JWT_SECRET=<your-jwt-secret>
PORT=5000


Run the app

# Start backend
npm run server
# Start frontend
cd client
npm start


Open your browser at http://localhost:3000

Usage

Register or login to your account.

Upload an image you want to process.

Wait a few seconds while AI removes the background.

Preview and download the processed image.
