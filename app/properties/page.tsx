import PropertySearchForm from '@/components/PropertySearchForm';
import Properties from '@/components/Properties';
import connectDB from '@/config/database';
import PropertyModel from '@/models/Property';
import type { Property } from '@/utils/database.types';

interface PropertiesPageProps {
  searchParams?: {
    page?: string;
    pageSize?: string;
  };
}

const PropertiesPage: React.FC<PropertiesPageProps> = async ({ searchParams: { page = '1', pageSize = '6' } = {} }) => {
  await connectDB();
  const skip = (Number(page) - 1) * Number(pageSize);
  const total = await PropertyModel.countDocuments({});
  const properties = (await PropertyModel.find({}).skip(skip).limit(Number(pageSize))) as Property[] | null;

  return (
    <>
      <section className='bg-blue-700 py-4'>
        <div className='max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8'>
          <PropertySearchForm />
        </div>
      </section>
      <Properties properties={properties} total={total} page={Number(page)} pageSize={Number(pageSize)} />
    </>
  );
};

export default PropertiesPage;
