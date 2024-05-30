import connectDB from '@/config/database';
import UserModel from '@/models/User';
import { getSessionUser } from '@/utils/getSessionUser';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

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
    const isBookmarked = user.bookmarks.includes(propertyId);
    return new Response(JSON.stringify({ isBookmarked }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response('Something went wrong', { status: 500 });
  }
};
