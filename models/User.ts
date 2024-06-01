import mongoose from 'mongoose';

// interface User extends mongoose.Document {
//   _id: mongoose.Types.ObjectId;
//   email: string;
//   username: string;
//   image: string;
//   bookmarks: mongoose.Types.ObjectId[];
//   createdAt: NativeDate;
//   updatedAt: NativeDate;
// }

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: [true, 'Email already exists'],
      required: [true, 'Email is required'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
    },
    image: {
      type: String,
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

export default UserModel;
