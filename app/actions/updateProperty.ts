'use server';

import connectDB from '@/config/database';
import PropertyModel from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function updateProperty(id: string, formData: FormData) {
  await connectDB();
  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    return new Response('User ID is required', { status: 401 });
  }
  const { userId } = sessionUser;
  const existingProperty = await PropertyModel.findById(id);
  if (!existingProperty) {
    return new Response('Property does not exist', { status: 404 });
  }
  // Verify ownership
  if (existingProperty.owner.toString() !== userId) {
    return new Response('Unauthorized', { status: 401 });
  }
  // Access all values from amenities and images
  const amenities = formData.getAll('amenities');
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
  const updatedProperty = await PropertyModel.findByIdAndUpdate(id, propertyData);
  // Revalidate the cache
  // NOTE: since properties are pretty much on every page, we can simply
  // revalidate everything that uses our top level layout
  revalidatePath('/', 'layout');
  redirect(`/properties/${updatedProperty._id}`);
}

export default updateProperty;
