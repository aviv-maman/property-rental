'use server';
import connectDB from '@/config/database';
import UserModel from '@/models/User';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';

async function bookmarkProperty(id: string) {
  await connectDB();
  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    return { isBookmarked: null, message: null, error: 'User ID is required', status: 401 };
  }
  const { userId } = sessionUser;
  // Find user in database
  const user = await UserModel.findById(userId);
  if (!user) {
    return { isBookmarked: null, message: null, error: 'User not found', status: 404 };
  }
  // Check if property is bookmarked
  let isBookmarked: boolean = user.bookmarks.includes(id);
  let message = '';
  if (isBookmarked) {
    // If already bookmarked, remove it
    user.bookmarks.pull(id);
    message = 'Bookmark removed successfully';
    isBookmarked = false;
  } else {
    // If not bookmarked, add it
    user.bookmarks.push(id);
    message = 'Bookmark added successfully';
    isBookmarked = true;
  }
  await user.save();
  // revalidate the cache.
  revalidatePath('/properties/saved', 'page');
  // NOTE: A nice demonstration of NextJS caching can be done here by first
  // commenting out the above line, then bookmark or un-bookmark a property for
  // a user then visit /properties/saved (either via link or going back in the
  // browser) and you will see the old results until
  // you refresh the page. If you then add back in the above line and repeat,
  // you will see the users saved properties are up to date.
  return { isBookmarked, message, error: null, status: null };
}

export default bookmarkProperty;
