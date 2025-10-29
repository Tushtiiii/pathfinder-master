import { connectToDatabase } from '../src/lib/mongodb';
import { 
  User, 
  College 
} from '../src/lib/models';

async function seed() {
  try {
    await connectToDatabase();
    console.log('Connected to MongoDB');

    // Sample data - you can customize this based on your needs
    
    // Sample Users
    const sampleUsers = [
      {
        email: 'student1@example.com',
        name: 'John Doe',
        age: 17,
        gender: 'Male',
        class: '12',
        location: 'Mumbai',
        state: 'Maharashtra',
        interests: ['Engineering', 'Technology', 'Mathematics']
      }
    ];

    // Sample Colleges
    const sampleColleges = [
      {
        name: 'Indian Institute of Technology Bombay',
        location: 'Mumbai',
        state: 'Maharashtra',
        district: 'Mumbai',
        type: 'Engineering',
        established: 1958,
        students: 10000,
        rating: 4.8,
        facilities: ['Library', 'Labs', 'Hostels', 'Sports'],
        programs: ['B.Tech', 'M.Tech', 'PhD'],
        fees: { general: 200000, obc: 150000, sc: 100000 },
        cutoffs: { general: 95, obc: 90, sc: 85 },
        medium: ['English'],
        website: 'https://www.iitb.ac.in'
      }
    ];

    // Insert sample data
    await User.insertMany(sampleUsers);
    await College.insertMany(sampleColleges);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

seed();