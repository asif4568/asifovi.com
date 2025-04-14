# Portfolio Backend

This is the backend API for MD ASIF HASAN OVI's portfolio website. It provides APIs for visitor tracking, contact form submissions, and project management.

## Features

- **Visitor Tracking**: Tracks website visitors and provides statistics
- **Contact Form**: Handles contact form submissions and sends email notifications
- **Project Management**: Manages project data for the portfolio

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Nodemailer
- Helmet (Security)
- CORS

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/portfolio
   NODE_ENV=development
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   JWT_SECRET=your-secret-key-change-this-in-production
   ```
5. Start the server:
   ```
   npm start
   ```
   
   For development with auto-restart:
   ```
   npm run dev
   ```

## API Endpoints

### Visitor API

- `GET /api/visitors` - Get visitor count
- `POST /api/visitors` - Increment visitor count
- `GET /api/visitors/stats` - Get visitor statistics

### Contact API

- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact submissions (protected)
- `PUT /api/contact/:id` - Update contact status (protected)

### Project API

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)

## Security Considerations

For production deployment:

1. Set up proper authentication for protected routes
2. Use environment variables for sensitive information
3. Set up HTTPS
4. Configure CORS properly
5. Use a production-ready MongoDB instance

## License

This project is licensed under the MIT License. 