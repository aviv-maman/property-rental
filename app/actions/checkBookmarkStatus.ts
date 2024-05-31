'use server';
import connectDB from '@/config/database';
import UserModel from '@/models/User';
import { getSessionUser } from '@/utils/getSessionUser';

async function checkBookmarkStatus(id: string) {
  await connectDB();
  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    return { isBookmarked: null, error: 'User ID is required', status: 401 };
  }
  const { userId } = sessionUser;
  // Find user in database
  const user = await UserModel.findById(userId);
  // Check if property is bookmarked
  const isBookmarked: boolean = user.bookmarks.includes(id);
  return { isBookmarked, error: null, status: null };
}

export default checkBookmarkStatus;
