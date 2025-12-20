import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import { College } from '../../../lib/models';

// This route will either return colleges from the database or, if an external
// source is configured via COLLEGES_SOURCE_URL or NEXT_PUBLIC_COLLEGES_API, will
// proxy that remote API server-side and map its fields into the local shape.
export async function GET(request: Request) {
  const remoteUrl = process.env.COLLEGES_SOURCE_URL || process.env.NEXT_PUBLIC_COLLEGES_API;
  const url = new URL(request.url);
  const pageParam = Number(url.searchParams.get('page') || '1');
  const limitParam = Number(url.searchParams.get('limit') || '20');
  const fieldsParam = url.searchParams.get('fields') || ''; // comma-separated
  const page = Math.max(1, isNaN(pageParam) ? 1 : pageParam);
  const limit = Math.min(100, Math.max(1, isNaN(limitParam) ? 20 : limitParam));
  const fields = fieldsParam.split(',').map(f => f.trim()).filter(Boolean);

  // If a remote URL is provided, fetch and map it server-side (avoids CORS)
  if (remoteUrl) {
    try {
      const res = await fetch(remoteUrl);
      if (!res.ok) {
        console.error('Remote colleges API returned non-OK status', res.status);
        return NextResponse.json({ error: 'Remote API error' }, { status: 502 });
      }

      const data = await res.json();
      if (!Array.isArray(data)) {
        console.error('Remote colleges API returned non-array data');
        return NextResponse.json({ error: 'Remote API returned unexpected data' }, { status: 502 });
      }

      // Map remote items into the same shape the frontend expects.
      const mapped = data.map((item: Record<string, unknown>) => {
        const get = (k: string) => {
          const v = item[k as string];
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
          raw: item,
        } as Partial<typeof College>;
      });

      // Paginate the mapped results
      const total = mapped.length;
      const start = (page - 1) * limit;
      const end = start + limit;
      const pageItems = mapped.slice(start, end);

      // Optionally pick only requested fields
      const pick = (obj: Record<string, unknown>) => {
        if (fields.length === 0) return obj;
        const out: Record<string, unknown> = {};
        for (const k of fields) if (k in obj) out[k] = obj[k];
        return out;
      };

      return NextResponse.json({ data: pageItems.map(pick), meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }, { status: 200 });
    } catch (err) {
      console.error('Error proxying remote colleges API:', err);
      return NextResponse.json({ error: 'Failed to fetch remote API' }, { status: 502 });
    }
  }

  // Otherwise, return from the database
  try {
    await connectToDatabase();

    // Build projection if fields requested
    let projection: Record<string, 1> | undefined = undefined;
    if (fields.length > 0) {
      projection = {};
      for (const f of fields) projection[f] = 1;
    }

    const total = await College.countDocuments();
    const docs = await College.find({}, projection).skip((page - 1) * limit).limit(limit).lean();

    return NextResponse.json({ data: docs, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }, { status: 200 });
  } catch (err) {
    console.error('Error fetching colleges from DB:', err);
    return NextResponse.json({ error: 'Failed to fetch colleges' }, { status: 500 });
  }
}
