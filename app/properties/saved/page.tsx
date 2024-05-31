import PropertyCard from '@/components/PropertyCard';
import connectDB from '@/config/database';
import UserModel from '@/models/User';
import type { User } from '@/utils/database.types';
import { getSessionUser } from '@/utils/getSessionUser';

const SavedPropertiesPage: React.FC = async () => {
  await connectDB();
  const sessionUser = await getSessionUser();
  const { userId } = sessionUser;
  const { bookmarks } = (await UserModel.findById(userId).populate('bookmarks').lean()) as User;

  return (
    <section className='px-4 py-6'>
      <div className='container-xl lg:container m-auto px-4 py-6'>
        <h1 className='text-2xl mb-4'>Saved Properties</h1>
        {bookmarks.length === 0 ? (
          <p>No saved properties</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {bookmarks.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SavedPropertiesPage;
