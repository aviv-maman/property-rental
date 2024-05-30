import connectDB from '@/config/database';
import PropertyModel from '@/models/Property';
import { type NextRequest } from 'next/server';

type RequestParams = { params: { id: string } };

// GET /api/properties/:id
export const GET = async (request: NextRequest, { params }: RequestParams) => {
  try {
    await connectDB();
    const property = await PropertyModel.findById(params.id);
    if (!property) return new Response(JSON.stringify({ message: 'Property not found' }), { status: 404, statusText: 'Not Found' });
    return new Response(JSON.stringify(property), { status: 200, statusText: 'OK' });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 500, statusText: 'Internal Server Error' });
  }
};
