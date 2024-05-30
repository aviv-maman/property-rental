import cloudinary from '@/config/cloudinary';
import connectDB from '@/config/database';
import PropertyModel from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';
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

// DELETE /api/properties/:id
export const DELETE = async (request: NextRequest, { params }: RequestParams) => {
  try {
    const propertyId = params.id;
    const sessionUser = await getSessionUser();
    // Check for session
    if (!sessionUser || !sessionUser.userId) {
      return new Response('User ID is required', { status: 401 });
    }
    const { userId } = sessionUser;
    await connectDB();
    const property = await PropertyModel.findById(propertyId);
    if (!property) return new Response('Property Not Found', { status: 404 });
    // Verify ownership
    if (property.owner.toString() !== userId) {
      return new Response('Unauthorized', { status: 401 });
    }
    // extract public id's from image url in DB
    const publicIds = property.images.map((imageUrl: any) => {
      const parts = imageUrl.split('/');
      return parts?.at(-1)?.split('.').at(0);
    });
    // Delete images from Cloudinary
    if (publicIds.length > 0) {
      for (const publicId of publicIds) {
        await cloudinary.uploader.destroy('propertyrental/' + publicId);
      }
    }
    // Proceed with property deletion
    await property.deleteOne();
    return new Response('Property Deleted', {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response('Something Went Wrong', { status: 500 });
  }
};

// PUT /api/properties/:id
export const PUT = async (request: NextRequest, { params }: RequestParams) => {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return new Response('User ID is required', { status: 401 });
    }
    const { id } = params;
    const { userId } = sessionUser;
    const formData = await request.formData();
    // Access all values from amenities
    const amenities = formData.getAll('amenities');
    // Get property to update
    const existingProperty = await PropertyModel.findById(id);
    if (!existingProperty) {
      return new Response('Property does not exist', { status: 404 });
    }
    // Verify ownership
    if (existingProperty.owner.toString() !== userId) {
      return new Response('Unauthorized', { status: 401 });
    }
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
      owner: userId,
    };
    // Update property in database
    const updatedProperty = await PropertyModel.findByIdAndUpdate(id, propertyData);
    return new Response(JSON.stringify(updatedProperty), {
      status: 200,
      statusText: 'OK',
    });
  } catch (error) {
    console.log(error);
    return new Response('Failed to add property', { status: 500, statusText: 'Internal Server Error' });
  }
};
