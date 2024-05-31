import connectDB from '@/config/database';
import PropertyModel from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';
import { type NextRequest } from 'next/server';
import cloudinary from '@/config/cloudinary';

// GET /api/properties
export const GET = async (request: NextRequest) => {
  try {
    await connectDB();
    const page = Number(request.nextUrl.searchParams.get('page')) || 1;
    const pageSize = Number(request.nextUrl.searchParams.get('pageSize')) || 6;
    const skip = (page - 1) * pageSize;
    const total = await PropertyModel.countDocuments({});
    const properties = await PropertyModel.find({}).skip(skip).limit(pageSize);
    const result = { total, properties, message: 'Properties fetched' };
    return Response.json(result);
  } catch (error) {
    if (error instanceof Error) {
      //(EvalError || RangeError || ReferenceError || SyntaxError || TypeError || URIError)
      console.error(`${error.name} - ${error.message}`);
    }
    const message = error instanceof Error ? error.message : 'Something went wrong';
    return Response.json({ total: null, properties: null, message }), { status: 500, statusText: 'Internal Server Error' };
  }
};

export const POST = async (request: NextRequest) => {
  try {
    await connectDB();
    const session = await getSessionUser();
    if (!session || !session.userId) {
      return Response.json({ message: 'Unauthorized' }), { status: 401, statusText: 'Unauthorized' };
    }
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
      owner: session.userId,
      images: [] as FormDataEntryValue[],
    };

    // Upload image(s) to Cloudinary
    const imageUrls = [];

    for (const image of images) {
      if (typeof image === 'string') {
        // Handle the case where image is a string.
        continue;
      }
      const imageBuffer = await image.arrayBuffer();
      const imageArray = Array.from(new Uint8Array(imageBuffer));
      const imageData = Buffer.from(imageArray);

      // Convert the image data to base64
      const imageBase64 = imageData.toString('base64');

      // Make request to upload to Cloudinary
      const result = await cloudinary.uploader.upload(`data:image/png;base64,${imageBase64}`, {
        folder: 'propertyrental',
      });

      imageUrls.push(result.secure_url);

      // Wait for all images to upload
      const uploadedImages = await Promise.all(imageUrls);
      // Add uploaded images to the propertyData object
      propertyData.images = uploadedImages;
    }

    const newProperty = new PropertyModel(propertyData);
    await newProperty.save();
    return Response.redirect(`${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`);
    // return Response.json({ message: 'Success' });
  } catch (error) {
    return Response.json({ message: 'Failed to add property' }), { status: 500, statusText: 'Internal Server Error' };
  }
};
