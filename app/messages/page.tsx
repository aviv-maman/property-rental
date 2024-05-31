import Message from '@/components/Message';
import connectDB from '@/config/database';
import MessageModel from '@/models/Message';
// NOTE: Import the Property model so it is instantiated in our serverless
// environment to be able to call Message.populate
import '@/models/Property';
import { convertToSerializeableObject } from '@/utils/convertToObject';
import type { MessageType } from '@/utils/database.types';
import { getSessionUser } from '@/utils/getSessionUser';

const MessagesPage: React.FC = async () => {
  await connectDB();
  const sessionUser = await getSessionUser();
  const { userId } = sessionUser;
  const readMessages = await MessageModel.find({ recipient: userId, read: true })
    .sort({ createdAt: -1 }) // Sort read messages in asc order
    .populate('sender', 'username')
    .populate('property', 'name')
    .lean();
  const unreadMessages = await MessageModel.find({
    recipient: userId,
    read: false,
  })
    .sort({ createdAt: -1 }) // Sort read messages in asc order
    .populate('sender', 'username')
    .populate('property', 'name')
    .lean();
  // Convert to serializable object so we can pass to client component.
  const messages = [...unreadMessages, ...readMessages].map((messageDoc) => {
    const message = convertToSerializeableObject(messageDoc);
    message.sender = convertToSerializeableObject(messageDoc.sender);
    message.property = convertToSerializeableObject(messageDoc.property);
    return message;
  }) as MessageType[] | null;

  return (
    <section className='bg-blue-50'>
      <div className='container m-auto py-24 max-w-6xl'>
        <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
          <h1 className='text-3xl font-bold mb-4'>Your Messages</h1>

          <div className='space-y-4'>
            {messages?.length === 0 ? <p>You have no messages</p> : messages?.map((message) => <Message key={message._id} message={message} />)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MessagesPage;
