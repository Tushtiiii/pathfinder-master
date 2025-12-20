
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
    const docs = colleges.map((c) => {
      const copy = { ...c } as Record<string, unknown>;
      delete (copy as Record<string, unknown>)['id'];
      return copy;
    });

    // Insert many, ignore duplicate key errors (ordered: false)
    await College.insertMany(docs, { ordered: false });

    console.log(`Seeded ${docs.length} colleges into the database.`);
  } catch (err) {
    // If duplicates exist, insertMany with ordered:false will throw — still OK
    const e = err as { message?: string } | Error | undefined;
    const msg = e && 'message' in e ? (e as { message?: string }).message : String(e);
    console.error('Seeding finished with error (this may be benign for duplicates):', msg);
  } finally {
    process.exit(0);
  }
}

seedColleges();
