'use server';

import cloudinary from '@/config/cloudinary';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';

async function deleteProperty(id: string) {
  const sessionUser = await getSessionUser();
  // Check for session
  if (!sessionUser || !sessionUser.userId) {
    throw new Error('User ID is required');
  }
  const { userId } = sessionUser;
  await connectDB();
  const property = await Property.findById(id);
  if (!property) throw new Error('Property Not Found');
  // Verify ownership
  if (property.owner.toString() !== userId) {
    throw new Error('Unauthorized');
  }
  // extract public id's from image url in DB
  const publicIds = property.images.map((imageUrl: string) => {
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
  // Revalidate the cache
  // NOTE: since properties are pretty much on every page, we can simply
  // revalidate everything that uses our top level layout
  revalidatePath('/', 'layout');
}

export default deleteProperty;
