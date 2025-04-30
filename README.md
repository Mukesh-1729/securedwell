# Property Management Application

A web application for managing property listings, buyers, sellers, and admins.

## Deployment Guide for Render

### Prerequisites

- A [Render](https://render.com) account
- MongoDB database (e.g., MongoDB Atlas)
- Cloudinary account for image storage
- Node.js and npm installed locally for testing

### Steps to Deploy on Render

1. **Create a MongoDB Atlas Database**
   - Sign up/log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Create a database user and note the username/password
   - Add your IP address to the IP access list (or allow access from anywhere for development)
   - Get your MongoDB connection string

2. **Set Up Cloudinary for Image Storage**
   - Sign up/log in to [Cloudinary](https://cloudinary.com/)
   - Navigate to your Dashboard to find your cloud name, API key, and API secret
   - Note these values for your environment variables

3. **Environment Variables**
   Create these environment variables in your Render dashboard:
   - `PORT`: The port your application will run on (Render will set this automatically)
   - `NODE_ENV`: Set to `production`
   - `MONGODB_URI`: Your MongoDB connection string
   - `SESSION_SECRET`: A secure random string for session encryption
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

4. **Deploy to Render**
   - Sign in to your Render account
   - Click "New" and select "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - **Name**: Choose a name for your service
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `node server.js`
   - Add the environment variables
   - Click "Create Web Service"

5. **SSL/HTTPS**
   - Render automatically provisions SSL certificates for your services
   - Ensure your application uses HTTPS in production

6. **Monitoring**
   - Use the Render dashboard to monitor your application's logs and performance

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory with the required environment variables:
   ```
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_secure_random_string
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Run the application: `npm start` or `npm run dev` for development with nodemon

## Features

- User authentication (buyers, sellers, admins)
- Property listings management
- User profile management
- Secure document and image uploads via Cloudinary
- Contact functionality 