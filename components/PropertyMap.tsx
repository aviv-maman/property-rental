'use client';
import { useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { Marker } from 'react-map-gl';
import Spinner from './Spinner';
import Image from 'next/image';
import pin from '@/assets/images/pin.svg';
import type { Property } from '@/utils/database.types';

interface PropertyMapProps {
  property: Property | null;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ property }) => {
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [loading, setLoading] = useState(true);
  const [geocodeError, setGeocodeError] = useState(false);

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        if (!property) return;
        const res = await fetch(
          `https://us1.locationiq.com/v1/search?key=${process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY}&q=${property.location.street}%20${property.location.city}%20${property.location.state}%20${property.location.zipcode}&format=json&`,
          { cache: 'force-cache' }
        );
        const data = await res.json();
        //  Check for results
        if (data.length === 0) {
          // No results found
          setGeocodeError(true);
          setLoading(false);
          return;
        }
        const { lat, lon } = data[0];
        setLat(lat);
        setLng(lon);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setGeocodeError(true);
        setLoading(false);
      }
    };
    fetchCoords();
  }, []);

  if (loading) return <Spinner loading={loading} />;

  // Handle case where geocoding failed
  if (geocodeError) {
    return <div className='text-xl'>No location data found</div>;
  }

  return (
    !loading && (
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapLib={import('mapbox-gl')}
        initialViewState={{
          longitude: lng,
          latitude: lat,
          zoom: 15,
        }}
        style={{ width: '100%', height: 500 }}
        mapStyle='mapbox://styles/mapbox/streets-v9'>
        <Marker longitude={lng} latitude={lat} anchor='bottom'>
          <Image src={pin} alt='location' width={40} height={40} />
        </Marker>
      </Map>
    )
  );
};

export default PropertyMap;
