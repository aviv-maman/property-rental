import mongoose from 'mongoose';

// interface Message extends mongoose.Document {
//   _id: mongoose.Types.ObjectId;
//   sender: mongoose.Types.ObjectId;
//   recipient: mongoose.Types.ObjectId;
//   property: mongoose.Types.ObjectId;
//   name: string;
//   email: string;
//   phone: string;
//   body: string;
//   read: boolean;
//   createdAt: NativeDate;
//   updatedAt: NativeDate;
// }

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    phone: {
      type: String,
    },
    body: {
      type: String,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.models.Message || mongoose.model('Message', MessageSchema);

export default MessageModel;
