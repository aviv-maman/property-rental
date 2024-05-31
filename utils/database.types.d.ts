export type Property = {
  _id: string;
  owner: string;
  name: string;
  type: string;
  description: string;
  location: {
    street: string;
    city: string;
    state: string;
    zipcode: string;
  };
  beds: beds;
  baths: beds;
  square_feet: beds;
  amenities: string[];
  rates: {
    nightly?: string;
    weekly?: string;
    monthly?: string;
  };
  seller_info: {
    name: string;
    email: string;
    phone: string;
  };
  images: string[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MessageType = {
  _id: string;
  sender: User;
  recipient: User;
  property: Property;
  name: string;
  email: string;
  phone: string;
  body: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
};

type User = {
  _id: string;
  email: string;
  username: string;
  image: string;
  bookmarks: Property[];
  createdAt: string;
  updatedAt: string;
};
