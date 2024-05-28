import connectDB from '@/config/database';
import type { NextRequest } from 'next/server';

// GET /api/properties
export const GET = async (request: NextRequest) => {
  try {
    await connectDB();

    const page = request.nextUrl.searchParams.get('page') || 1;
    const pageSize = request.nextUrl.searchParams.get('pageSize') || 6;

    const skip = (Number(page) - 1) * Number(pageSize);

    return new Response(JSON.stringify({}), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response('Something Went Wrong', { status: 500 });
  }
};
