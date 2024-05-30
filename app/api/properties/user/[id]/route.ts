import connectDB from '@/config/database';
import Property from '@/models/Property';
import type { NextRequest } from 'next/server';

type RequestParams = { params: { id: string } };

// GET /api/properties/user/:userId
export const GET = async (request: NextRequest, { params }: RequestParams) => {
  try {
    await connectDB();
    const userId = params.id;
    if (!userId) {
      return new Response('User ID is required', { status: 400, statusText: 'Bad Request' });
    }
    const properties = await Property.find({ owner: userId });
    return new Response(JSON.stringify(properties), {
      status: 200,
      statusText: 'OK',
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: 'Failed to get property' }), { status: 500, statusText: 'Internal Server Error' });
  }
};
