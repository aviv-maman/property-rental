import connectDB from '@/config/database';
import PropertyModel from '@/models/Property';
import type { Property } from '@/utils/database.types';
import { NextResponse, type NextRequest } from 'next/server';

type RequestParams = { params: { id: string } };

// GET /api/properties/:id
export const GET = async (request: NextRequest, { params }: RequestParams) => {
  try {
    await connectDB();
    const property: Property | null = await PropertyModel.findById(params.id);
    if (!property) return NextResponse.json('Property not found', { status: 404 });
    return NextResponse.json(property, {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json('Something went wrong', { status: 500 });
  }
};
