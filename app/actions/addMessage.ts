'use server';
import connectDB from '@/config/database';
import Message from '@/models/Message';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';

type FormState = {
  error?: string;
  submitted?: boolean;
};

async function addMessage(previousState: FormState, formData: FormData) {
  await connectDB();
  const sessionUser = await getSessionUser();
  // NOTE: Here we send an { error } object back which we can use to then show
  // the user a toast message.
  // We don't want to throw here like we did in our property server actions as that would
  // then be 'caught' by our error.tsx ErrorBoundary component and show the user
  // our Error page.
  if (!sessionUser || !sessionUser.user) {
    return { submitted: false, error: 'You must be logged in to send a message' };
  }
  const { user } = sessionUser;
  const recipient = formData.get('recipient');
  if (user.id === recipient) {
    return { submitted: false, error: 'You can not send a message to yourself' };
  }
  const newMessage = new Message({
    sender: user.id,
    recipient,
    property: formData.get('property'),
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    body: formData.get('message'),
  });
  await newMessage.save();
  // revalidate cache
  revalidatePath('/messages', 'page');
  return { submitted: true, error: undefined };
}

export default addMessage;
