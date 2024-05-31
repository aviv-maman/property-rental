import Link from 'next/link';
import PropertyHeaderImage from '@/components/PropertyHeaderImage';
import { FaArrowLeft } from 'react-icons/fa';
import type { Property } from '@/utils/database.types';
import PropertyDetails from '@/components/PropertyDetails';
import PropertyImages from '@/components/PropertyImages';
import BookmarkButton from '@/components/BookmarkButton';
import ShareButtons from '@/components/ShareButtons';
import PropertyContactForm from '@/components/PropertyContactForm';
import connectDB from '@/config/database';
import PropertyModel from '@/models/Property';
import { convertToSerializeableObject } from '@/utils/convertToObject';

interface PropertyPageProps {
  params: { id?: string };
}

const PropertyPage: React.FC<PropertyPageProps> = async ({ params }) => {
  const PUBLIC_DOMAIN = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
  await connectDB();
  const propertyDoc = (await PropertyModel.findById(params.id).lean()) as any;
  const property = convertToSerializeableObject(propertyDoc) as Property;

  if (!property) {
    return <h1 className='text-center text-2xl font-bold mt-10'>Property Not Found</h1>;
  }

  return (
    <>
      <PropertyHeaderImage image={property.images[0]} />
      <section>
        <div className='container m-auto py-6 px-6'>
          <Link href='/properties' className='text-blue-500 hover:text-blue-600 flex items-center'>
            <FaArrowLeft className='mr-2' /> Back to Properties
          </Link>
        </div>
      </section>

      <section className='bg-blue-50'>
        <div className='container m-auto py-10 px-6'>
          <div className='grid grid-cols-1 md:grid-cols-70/30 w-full gap-6'>
            <PropertyDetails property={property} />
            <aside className='space-y-4'>
              <BookmarkButton property={property} />
              <ShareButtons property={property} PUBLIC_DOMAIN={PUBLIC_DOMAIN} />
              <PropertyContactForm property={property} />
            </aside>
          </div>
        </div>
      </section>
      <PropertyImages images={property.images} />
    </>
  );
};

export default PropertyPage;
