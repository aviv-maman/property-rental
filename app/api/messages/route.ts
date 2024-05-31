import connectDB from '@/config/database';
import MessageModel from '@/models/Message';
import { getSessionUser } from '@/utils/getSessionUser';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

// GET /api/messages
export const GET = async () => {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.user) {
      return new Response('User ID is required'), { status: 401 };
    }
    const { userId } = sessionUser;
    const readMessages = await MessageModel.find({ recipient: userId, read: true })
      .sort({ createdAt: -1 }) // Sort read messages in asc order
      .populate('sender', 'username')
      .populate('property', 'name');
    const unreadMessages = await MessageModel.find({
      recipient: userId,
      read: false,
    })
      .sort({ createdAt: -1 }) // Sort read messages in asc order
      .populate('sender', 'username')
      .populate('property', 'name');
    const messages = [...unreadMessages, ...readMessages];
    return Response.json(messages);
  } catch (error) {
    console.log(error);
    return new Response('Something went wrong', { status: 500 });
  }
};

// POST /api/messages
export const POST = async (request: NextRequest) => {
  try {
    await connectDB();
    const { name, email, phone, message, property, recipient } = await request.json();
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.user) {
      return Response.json({ message: 'You must be logged in to send a message' }), { status: 401 };
    }
    const { user } = sessionUser;
    // Can not send message to self
    if (user.id === recipient) {
      return Response.json({ message: 'Can not send a message to yourself' }), { status: 400 };
    }
    const newMessage = new MessageModel({
      sender: user.id,
      recipient,
      property,
      name,
      email,
      phone,
      body: message,
    });
    await newMessage.save();
    return Response.json({ message: 'Message Sent' });
  } catch (error) {
    console.log(error);
    return new Response('Something went wrong', { status: 500 });
  }
};
