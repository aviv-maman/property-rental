import FeaturedProperties from '@/components/FeaturedProperties';
import Hero from '@/components/Hero';
import HomeProperties from '@/components/HomeProperties';
import InfoBoxes from '@/components/InfoBoxes';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <InfoBoxes />
      <FeaturedProperties />
      <HomeProperties />
    </>
  );
};

export default HomePage;
