import PropertyEditForm from '@/components/PropertyEditForm';
import connectDB from '@/config/database';
import PropertyModel from '@/models/Property';
import { convertToSerializeableObject } from '@/utils/convertToObject';
import type { Property } from '@/utils/database.types';

interface PropertyEditPageProps {
  params: { id?: string };
}

const PropertyEditPage: React.FC<PropertyEditPageProps> = async ({ params }) => {
  await connectDB();
  // query the property in the DB
  const propertyDoc = (await PropertyModel.findById(params.id).lean()) as Property;
  // convert the document to a plain js object so we can pass to client
  // components
  const property = convertToSerializeableObject(propertyDoc) as Property | null;
  if (!property) {
    return <h1 className='text-center text-2xl font-bold mt-10'>Property Not Found</h1>;
  }

  return (
    <section className='bg-blue-50'>
      <div className='container m-auto max-w-2xl py-24'>
        <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
          <PropertyEditForm property={property} />
        </div>
      </div>
    </section>
  );
};

export default PropertyEditPage;
