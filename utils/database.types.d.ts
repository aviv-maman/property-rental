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
