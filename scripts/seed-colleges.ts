
import { connectToDatabase } from '../src/lib/mongodb';
import { College } from '../src/lib/models';
import colleges from '../src/app/colleges/data';

async function seedColleges() {
  try {
    await connectToDatabase();
    console.log('Connected to MongoDB — seeding colleges...');

    if (!Array.isArray(colleges) || colleges.length === 0) {
      console.warn('No colleges found in data import. Nothing to seed.');
      process.exit(0);
    }

    // Normalize documents: remove `id` from static file and let MongoDB assign _id
    const docs = colleges.map((c: any) => {
      const copy = { ...c };
      delete copy.id;
      return copy;
    });

    // Insert many, ignore duplicate key errors (ordered: false)
    await College.insertMany(docs, { ordered: false });

    console.log(`Seeded ${docs.length} colleges into the database.`);
  } catch (err: any) {
    // If duplicates exist, insertMany with ordered:false will throw — still OK
    console.error('Seeding finished with error (this may be benign for duplicates):', err.message || err);
  } finally {
    process.exit(0);
  }
}

seedColleges();
