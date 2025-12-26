import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { User, College } from '../../../lib/models';
import { Types } from 'mongoose';
import { connectToDatabase } from '../../../lib/mongodb';
import staticColleges from '../../colleges/data';

type SavedCollegeResponse = {
  _id: string;
  collegeId: string;
  name: string;
  location: string;
  state: string;
  type: string;
  rating?: number;
  savedAt?: Date | string | null;
};

type SavedCollegeMetadata = {
  name?: string;
  location?: string;
  state?: string;
  type?: string;
  rating?: number;
};

const toNameSlug = (value: unknown) =>
  typeof value === 'string' ? value.trim().replace(/\s+/g, '-').toLowerCase() : '';

const deriveSlugBase = (value: string) => {
  const trimmed = value.trim();
  const withoutPrefix = trimmed.startsWith('college-') ? trimmed.slice(8) : trimmed;
  return withoutPrefix.replace(/-\d+$/, '');
};

const staticLookup = new Map<string, Record<string, unknown>>();
if (Array.isArray(staticColleges)) {
  (staticColleges as Array<Record<string, unknown>>).forEach((college) => {
    const slug = toNameSlug(college?.name);
    if (slug) {
      staticLookup.set(slug, college);
    }
  });
}

const buildResponseFromStatic = (slug: string): SavedCollegeResponse | null => {
  const base = deriveSlugBase(slug);
  const match = staticLookup.get(base);
  if (!match) return null;

  const name = typeof match.name === 'string' ? match.name : slug;
  const location = typeof match.location === 'string'
    ? match.location
    : typeof match.district === 'string'
    ? match.district
    : '';
  const state = typeof match.state === 'string' ? match.state : '';
  const type = typeof match.type === 'string' ? match.type : '';
  const rating = typeof match.rating === 'number' ? match.rating : undefined;

  return {
    _id: slug,
    collegeId: slug,
    name,
    location,
    state,
    type,
    rating,
    savedAt: new Date()
  };
};

const buildFallbackFromSlug = (slug: string): SavedCollegeResponse => {
  const base = deriveSlugBase(slug);
  const spaced = base.replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
  const restoredId = spaced.replace(/\(id: c (\d+)\)/gi, '(Id: C-$1)');
  const title = restoredId.replace(/\b([a-z])/g, (char) => char.toUpperCase());
  return {
    _id: slug,
    collegeId: slug,
    name: title,
    location: '',
    state: '',
    type: '',
    savedAt: new Date()
  };
};

const normalizeCollegeEntry = (entry: unknown) => {
  if (!entry) {
    return { response: null as SavedCollegeResponse | null, objectId: null as string | null };
  }

  if (typeof entry === 'string') {
    const trimmed = entry.trim();
    if (Types.ObjectId.isValid(trimmed)) {
      return { response: null, objectId: trimmed };
    }
    const staticResponse = buildResponseFromStatic(trimmed);
    return { response: staticResponse ?? buildFallbackFromSlug(trimmed), objectId: null };
  }

  if (typeof entry === 'object') {
    const obj = entry as Record<string, unknown>;
    const rawId = obj.collegeId ?? obj._id ?? obj.id;
    const collegeId =
      typeof rawId === 'string'
        ? rawId
        : rawId && typeof (rawId as { toString: () => string }).toString === 'function'
        ? (rawId as { toString: () => string }).toString()
        : '';

    const response: SavedCollegeResponse = {
      _id: collegeId || (typeof obj._id === 'string' ? obj._id : ''),
      collegeId: collegeId || (typeof obj._id === 'string' ? obj._id : ''),
      name: typeof obj.name === 'string' ? obj.name : '',
      location: typeof obj.location === 'string' ? obj.location : '',
      state: typeof obj.state === 'string' ? obj.state : '',
      type: typeof obj.type === 'string' ? obj.type : '',
      rating:
        typeof obj.rating === 'number'
          ? obj.rating
          : typeof obj.rating === 'string'
          ? Number(obj.rating) || undefined
          : undefined,
      savedAt:
        obj.savedAt instanceof Date
          ? obj.savedAt
          : typeof obj.savedAt === 'string'
          ? obj.savedAt
          : obj.createdAt instanceof Date
          ? obj.createdAt
          : null
    };

    if (!response.name && typeof obj.title === 'string') {
      response.name = obj.title;
    }
    if (!response.location && typeof obj.district === 'string') {
      response.location = obj.district;
    }

    const maybeObjectId =
      response.collegeId && Types.ObjectId.isValid(response.collegeId)
        ? response.collegeId
        : null;

    return { response, objectId: maybeObjectId };
  }

  return { response: null, objectId: null };
};

const mergeResponses = (
  existing: SavedCollegeResponse | undefined,
  incoming: SavedCollegeResponse
): SavedCollegeResponse => {
  if (!existing) return incoming;
  return {
    _id: incoming._id || existing._id,
    collegeId: incoming.collegeId || existing.collegeId,
    name: incoming.name || existing.name,
    location: incoming.location ?? existing.location,
    state: incoming.state ?? existing.state,
    type: incoming.type ?? existing.type,
    rating: incoming.rating ?? existing.rating,
    savedAt: incoming.savedAt ?? existing.savedAt
  };
};

const sanitizeMetadata = (metadata: unknown): SavedCollegeMetadata => {
  if (!metadata || typeof metadata !== 'object') {
    return {};
  }

  const meta = metadata as Record<string, unknown>;

  const cleanNumber = (value: unknown) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    }
    return undefined;
  };

  return {
    name: typeof meta.name === 'string' ? meta.name : undefined,
    location: typeof meta.location === 'string' ? meta.location : undefined,
    state: typeof meta.state === 'string' ? meta.state : undefined,
    type: typeof meta.type === 'string' ? meta.type : undefined,
    rating: cleanNumber(meta.rating)
  };
};

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email }).lean();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const savedEntries = Array.isArray(user.savedColleges) ? user.savedColleges : [];
    if (savedEntries.length === 0) {
      return NextResponse.json([]);
    }

    const responseMap = new Map<string, SavedCollegeResponse>();
    const objectIdsToFetch = new Set<string>();

    savedEntries.forEach((entry) => {
      const { response, objectId } = normalizeCollegeEntry(entry);
      if (objectId) {
        objectIdsToFetch.add(objectId);
      }
      if (response && response.collegeId) {
        const merged = mergeResponses(responseMap.get(response.collegeId), response);
        responseMap.set(response.collegeId, merged);
      }
    });

    if (objectIdsToFetch.size > 0) {
      const ids = Array.from(objectIdsToFetch).map((id) => new Types.ObjectId(id));
      const colleges = await College.find({ _id: { $in: ids } })
        .select('name location district state type rating')
        .lean();

      colleges.forEach((college) => {
        const id = college._id.toString();
        const dbResponse: SavedCollegeResponse = {
          _id: id,
          collegeId: id,
          name: typeof college.name === 'string' ? college.name : '',
          location:
            typeof college.location === 'string'
              ? college.location
              : typeof college.district === 'string'
              ? college.district
              : '',
          state: typeof college.state === 'string' ? college.state : '',
          type: typeof college.type === 'string' ? college.type : '',
          rating: typeof college.rating === 'number' ? college.rating : undefined,
          savedAt: new Date()
        };
        const merged = mergeResponses(responseMap.get(id), dbResponse);
        responseMap.set(id, merged);
      });
    }

    return NextResponse.json(Array.from(responseMap.values()));
  } catch (error) {
    console.error('Failed to fetch saved colleges:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const collegeId = typeof body?.collegeId === 'string' ? body.collegeId.trim() : '';
    if (!collegeId) {
      return NextResponse.json({ error: 'collegeId is required' }, { status: 400 });
    }

    const metadata = sanitizeMetadata(body?.metadata);

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentSaved = Array.isArray(user.savedColleges) ? user.savedColleges : [];

    const existingIds = currentSaved
      .map((entry: unknown) => {
        if (!entry) return null;
        if (typeof entry === 'string') return entry.trim();
        if (typeof entry === 'object') {
          const obj = entry as Record<string, unknown>;
          const raw = obj.collegeId ?? obj._id ?? obj.id;
          if (typeof raw === 'string') return raw;
          if (raw && typeof (raw as { toString: () => string }).toString === 'function') {
            return (raw as { toString: () => string }).toString();
          }
        }
        return null;
      })
      .filter((id): id is string => typeof id === 'string' && id.length > 0);

    const alreadySaved = existingIds.includes(collegeId);

    if (alreadySaved) {
      const updated = currentSaved.filter((entry: unknown) => {
        if (!entry) return false;
        if (typeof entry === 'string') {
          return entry.trim() !== collegeId;
        }
        if (typeof entry === 'object') {
          const obj = entry as Record<string, unknown>;
          const raw = obj.collegeId ?? obj._id ?? obj.id;
          if (typeof raw === 'string') return raw !== collegeId;
          if (raw && typeof (raw as { toString: () => string }).toString === 'function') {
            return (raw as { toString: () => string }).toString() !== collegeId;
          }
          return true;
        }
        return true;
      });

      user.savedColleges = updated;
      user.markModified('savedColleges');
      await user.save();

      return NextResponse.json({ message: 'College unsaved successfully' });
    }

    const newEntry: Record<string, unknown> = {
      collegeId,
      savedAt: new Date()
    };

    if (metadata.name) newEntry.name = metadata.name;
    if (metadata.location) newEntry.location = metadata.location;
    if (metadata.state) newEntry.state = metadata.state;
    if (metadata.type) newEntry.type = metadata.type;
    if (metadata.rating !== undefined) newEntry.rating = metadata.rating;

    user.savedColleges = [...currentSaved, newEntry];
    user.markModified('savedColleges');
    await user.save();

    return NextResponse.json({ message: 'College saved successfully' });
  } catch (error) {
    console.error('Failed to save college:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: (error as Error).message }, { status: 500 });
  }
}
