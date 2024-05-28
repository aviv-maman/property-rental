import connectDB from '@/config/database';
import PropertyModel from '@/models/Property';
import type { Property } from '@/utils/database.types';
import type { NextRequest } from 'next/server';

// GET /api/properties
export const GET = async (request: NextRequest) => {
  try {
    await connectDB();

    const page = Number(request.nextUrl.searchParams.get('page')) || 1;
    const pageSize = Number(request.nextUrl.searchParams.get('pageSize')) || 6;

    const skip = (page - 1) * pageSize;

    const total = await PropertyModel.countDocuments({});
    const properties: Property[] = await PropertyModel.find({}).skip(skip).limit(pageSize);

    const result = {
      total,
      properties,
    };

    return new Response(JSON.stringify(result), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response('Something Went Wrong', { status: 500 });
  }
};
