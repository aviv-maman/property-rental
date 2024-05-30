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
