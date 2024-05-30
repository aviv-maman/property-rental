import connectDB from '@/config/database';
import PropertyModel from '@/models/Property';
import type { NextRequest } from 'next/server';

// GET /api/properties/featured
export const GET = async (request: NextRequest) => {
  try {
    await connectDB();
    const properties = await PropertyModel.find({
      is_featured: true,
    });
    const total = await PropertyModel.countDocuments({});
    const result = { total, properties, message: 'Properties fetched' };
    return new Response(JSON.stringify(result), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response('Something Went Wrong', { status: 500 });
  }
};
