# MongoDB Setup Guide

This project now uses MongoDB instead of Prisma/SQLite. Follow these steps to set up MongoDB:

## Prerequisites

1. **Install MongoDB**: Download and install MongoDB from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. **Start MongoDB**: Ensure MongoDB is running on your system

## Environment Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Update the MongoDB connection string in `.env.local`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/pathfinder
   ```

   For MongoDB Atlas (cloud), use:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pathfinder
   ```

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Seed the database (optional):
   ```bash
   npm run seed
   ```

## Database Schema

The MongoDB collections correspond to the following data models:

- **users** - User profiles and authentication data
- **quiz_results** - Career assessment quiz results
- **colleges** - College information and details
- **saved_colleges** - User's saved colleges
- **careers** - Career information and paths
- **timeline_events** - Important dates and deadlines
- **notifications** - User notifications
- **recommendations** - AI-generated recommendations
- **study_materials** - Educational resources
- **scholarships** - Scholarship opportunities
- **exams** - Entrance exam information

## Database Connection

The application uses both:
- **MongoDB Native Driver** - for NextAuth.js integration
- **Mongoose** - for schema validation and ODM features

Connection files:
- `src/lib/mongodb.ts` - Database connection setup
- `src/lib/models.ts` - Mongoose schemas and models

## Development

Start the development server:
```bash
npm run dev
```

The application will connect to MongoDB automatically when the server starts.