import connectDB from '@/config/database';
import FeaturedPropertyCard from './FeaturedPropertyCard';
import PropertyModel from '@/models/Property';
import type { Property } from '@/utils/database.types';

const FeaturedProperties: React.FC = async () => {
  await connectDB();
  const properties = (await PropertyModel.find({ is_featured: true }).lean()) as Property[];

  return (
    properties?.length &&
    properties.length > 0 && (
      <section className='bg-blue-50 px-4 pt-6 pb-10'>
        <div className='container-xl lg:container m-auto'>
          <h2 className='text-3xl font-bold text-blue-500 mb-6 text-center'>Featured Properties</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {properties?.map((property) => (
              <FeaturedPropertyCard key={property._id} property={property} />
            ))}
          </div>
        </div>
      </section>
    )
  );
};

export default FeaturedProperties;
