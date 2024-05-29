import connectDB from '@/config/database';
import PropertyModel from '@/models/Property';
import type { Property } from '@/utils/database.types';
import { type NextRequest } from 'next/server';

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
    return new Response(JSON.stringify(result), {
      status: 200,
      statusText: 'OK',
    });
  } catch (error) {
    if (error instanceof Error) {
      //(EvalError || RangeError || ReferenceError || SyntaxError || TypeError || URIError)
      console.error(`${error.name} - ${error.message}`);
    }
    const message = error instanceof Error ? error.message : 'Something went wrong';
    return new Response(JSON.stringify({ total: null, properties: null, message }), { status: 500, statusText: 'Internal Server Error' });
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();

    // Access all values from amenities and images
    const amenities = formData.getAll('amenities');
    const images = formData.getAll('images').filter((image) => image instanceof File && image.name !== '');

    // Create propertyData object for database
    const propertyData = {
      type: formData.get('type'),
      name: formData.get('name'),
      description: formData.get('description'),
      location: {
        street: formData.get('location.street'),
        city: formData.get('location.city'),
        state: formData.get('location.state'),
        zipcode: formData.get('location.zipcode'),
      },
      beds: formData.get('beds'),
      baths: formData.get('baths'),
      square_feet: formData.get('square_feet'),
      amenities,
      rates: {
        weekly: formData.get('rates.weekly'),
        monthly: formData.get('rates.monthly'),
        nightly: formData.get('rates.nightly.'),
      },
      seller_info: {
        name: formData.get('seller_info.name'),
        email: formData.get('seller_info.email'),
        phone: formData.get('seller_info.phone'),
      },
    };

    return new Response(JSON.stringify({ message: 'Success' }), {
      status: 200,
      statusText: 'OK',
    });
  } catch (error) {
    return new Response('Failed to add property', { status: 500, statusText: 'Internal Server Error' });
  }
};
