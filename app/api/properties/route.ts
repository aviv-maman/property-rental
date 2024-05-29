import connectDB from '@/config/database';
import PropertyModel from '@/models/Property';
import type { Property } from '@/utils/database.types';
import { NextResponse, type NextRequest } from 'next/server';

// GET /api/properties
export const GET = async (request: NextRequest) => {
  try {
    await connectDB();
    const page = Number(request.nextUrl.searchParams.get('page')) || 1;
    const pageSize = Number(request.nextUrl.searchParams.get('pageSize')) || 6;
    const skip = (page - 1) * pageSize;
    const total = await PropertyModel.countDocuments({});
    const properties: Property[] = await PropertyModel.find({}).skip(skip).limit(pageSize);
    const result = { total, properties, message: 'Properties fetched' };
    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
    if (error instanceof Error) {
      //(EvalError || RangeError || ReferenceError || SyntaxError || TypeError || URIError)
      console.error(`${error.name} - ${error.message}`);
    }
    const message = error instanceof Error ? error.message : 'Something went wrong';
    return NextResponse.json({ total: null, properties: null, message }, { status: 500 });
  }
};
