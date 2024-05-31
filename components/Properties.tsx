import PropertyCard from '@/components/PropertyCard';
import Pagination from '@/components/Pagination';
import type { Property } from '@/utils/database.types';

interface PropertiesProps {
  properties?: Property[] | null;
  total?: number;
  page?: number;
  pageSize?: number;
}

const Properties: React.FC<PropertiesProps> = ({ properties, total, page, pageSize }) => {
  return (
    <section className='px-4 py-6'>
      <div className='container-xl lg:container m-auto px-4 py-6'>
        {properties?.length === 0 ? (
          <p>No properties found</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {properties?.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
        <Pagination page={page} pageSize={pageSize} totalItems={total} />
      </div>
    </section>
  );
};

export default Properties;
