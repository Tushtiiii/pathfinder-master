import { connectToDatabase } from '../src/lib/mongodb';
import { College } from '../src/lib/models';

async function seedFromApi() {
  const url = process.env.COLLEGES_SOURCE_URL || process.env.NEXT_PUBLIC_COLLEGES_API;
  if (!url) {
    console.error('Set COLLEGES_SOURCE_URL or NEXT_PUBLIC_COLLEGES_API env var to the API endpoint');
    process.exit(1);
  }

  try {
    await connectToDatabase();
    console.log('Connected to MongoDB');

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) {
      console.error('API returned non-array data');
      process.exit(1);
    }

    const mapped = data.map((item: Record<string, unknown>) => {
      const get = (k: string) => {
        const v = item[k];
        if (v === undefined || v === null) return undefined;
        if (typeof v === 'string' || typeof v === 'number') return v;
        return undefined;
      };

      const yearKey = Object.keys(item).find(k => k.toLowerCase().includes('year of establishment')) || 'Year of Establishment';
      const yearVal = get(yearKey) || get('Year of Establishment\n') || get('Year of Establishment');

      const name = (get('College Name') || get('College_Name') || get('University Name') || get('University_Name') || '') as string;
      const location = (get('Location') || get('Address') || '') as string;
      const district = (get('District') || '') as string;
      const state = (get('State') || '') as string;
      const specialised = get('Specialised in') as string | undefined;
      const rating = (get('Rating') as number) || 0;
      const students = (get('Students') as number) || 0;
      const mediumVal = (get('Medium') as string) || '';
      const typeVal = (get('College Type') || get('University Type') || get('CollegeType') || '') as string;

      return {
        name,
        location,
        district,
        state,
        programs: specialised ? [specialised] : [],
        fees: { general: 0, sc_st: 0, obc: 0 },
        cutoffs: { general: 0, sc_st: 0, obc: 0 },
        facilities: [],
        rating,
        students,
        established: yearVal ? parseInt(String(yearVal).trim()) || undefined : undefined,
        medium: mediumVal ? [mediumVal] : [],
        type: typeVal,
      };
    });

    // Insert mapped docs, ignore ordering errors from duplicates
    await College.insertMany(mapped, { ordered: false });
    console.log(`Seeded ${mapped.length} colleges from API into DB`);
    process.exit(0);
  } catch (err: unknown) {
    console.error('Error seeding from API:', String(err));
    process.exit(1);
  }
}

seedFromApi();
