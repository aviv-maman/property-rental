import connectDB from '@/config/database';
import UserModel from '@/models/User';
import PropertyModel from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

// GET /api/bookmarks
export const GET = async () => {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return new Response('User ID is required', { status: 401 });
    }
    const { userId } = sessionUser;
    // Find user in database
    const user = await UserModel.findOne({ _id: userId });
    // Get users bookmarks
    if (!user) {
      return new Response('User not found', { status: 404 });
    }
    const bookmarks = await PropertyModel.find({ _id: { $in: user.bookmarks } });
    return Response.json(bookmarks);
  } catch (error) {
    console.log(error);
    return new Response('Something went wrong', { status: 500 });
  }
};

export const POST = async (request: NextRequest) => {
  try {
    await connectDB();
    const { propertyId } = await request.json();
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return new Response('User ID is required', { status: 401 });
    }
    const { userId } = sessionUser;
    // Find user in database
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      return new Response('User not found', { status: 404 });
    }
    // Check if property is bookmarked
    let isBookmarked = user.bookmarks.includes(propertyId);
    let message;
    if (isBookmarked) {
      // If already bookmarked, remove it
      user.bookmarks.pull(propertyId);
      message = 'Bookmark removed successfully';
      isBookmarked = false;
    } else {
      // If not bookmarked, add it
      user.bookmarks.push(propertyId);
      message = 'Bookmark added successfully';
      isBookmarked = true;
    }

    await user.save();
    return Response.json({ message, isBookmarked });
  } catch (error) {
    console.log(error);
    return new Response('Something went wrong', { status: 500 });
  }
};
