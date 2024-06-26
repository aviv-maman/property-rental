import mongoose from 'mongoose';

// interface Property extends mongoose.Document {
//   _id: mongoose.Types.ObjectId;
//   owner: mongoose.Types.ObjectId;
//   name: string;
//   type: string;
//   description: string;
//   location: {
//     street: string;
//     city: string;
//     state: string;
//     zipcode: string;
//   };
//   beds: number;
//   baths: number;
//   square_feet: number;
//   amenities: string[];
//   rates: {
//     nightly: number;
//     weekly: number;
//     monthly: number;
//   };
//   seller_info: {
//     name: string;
//     email: string;
//     phone: string;
//   };
//   images: string[];
//   is_featured: boolean;
//   createdAt: NativeDate;
//   updatedAt: NativeDate;
// }

const PropertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    location: {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      zipcode: {
        type: String,
      },
    },
    beds: {
      type: Number,
      required: true,
    },
    baths: {
      type: Number,
      required: true,
    },
    square_feet: {
      type: Number,
      required: true,
    },
    amenities: [
      {
        type: String,
      },
    ],
    rates: {
      nightly: {
        type: Number,
      },
      weekly: {
        type: Number,
      },
      monthly: {
        type: Number,
      },
    },
    seller_info: {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
    images: {
      type: [String],
      validate: {
        validator: (value: string[]) => value.length <= 4,
        message: (props: { value: string[] }) => `A property must have a maximum of 4 images, but got ${props.value.length}`,
      },
    },
    is_featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const PropertyModel = mongoose.models.Property || mongoose.model('Property', PropertySchema);

export default PropertyModel;
