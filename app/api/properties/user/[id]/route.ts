import connectDB from '@/config/database';
import PropertyModel from '@/models/Property';
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
    const properties = await PropertyModel.find({ owner: userId });
    return Response.json(properties);
  } catch (error) {
    console.log(error);
    return Response.json({ message: 'Failed to get property' }), { status: 500, statusText: 'Internal Server Error' };
  }
};
