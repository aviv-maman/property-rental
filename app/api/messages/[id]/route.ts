import connectDB from '@/config/database';
import MessageModel from '@/models/Message';
import { getSessionUser } from '@/utils/getSessionUser';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

type RequestParams = { params: { id: string } };

// PUT /api/messages/:id
export const PUT = async (request: NextRequest, { params }: RequestParams) => {
  try {
    await connectDB();
    const { id } = params;
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.user) {
      return new Response('User ID is required', {
        status: 401,
      });
    }
    const { userId } = sessionUser;
    const message = await MessageModel.findById(id);
    if (!message) return new Response('Message Not Found', { status: 404 });
    // Verify ownership
    if (message.recipient.toString() !== userId) {
      return new Response('Unauthorized', { status: 401 });
    }
    // Update message to read/unread depending on the current status
    message.read = !message.read;
    await message.save();
    return Response.json(message);
  } catch (error) {
    console.log(error);
    return new Response('Something went wrong', { status: 500 });
  }
};

// DELETE /api/messages/:id
export const DELETE = async (request: NextRequest, { params }: RequestParams) => {
  try {
    await connectDB();
    const { id } = params;
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.user) {
      return new Response('User ID is required', {
        status: 401,
      });
    }
    const { userId } = sessionUser;
    const message = await MessageModel.findById(id);
    if (!message) return new Response('Message Not Found', { status: 404 });
    // Verify ownership
    if (message.recipient.toString() !== userId) {
      return new Response('Unauthorized', { status: 401 });
    }
    await message.deleteOne();
    return new Response('Message Deleted', { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response('Something went wrong', { status: 500 });
  }
};