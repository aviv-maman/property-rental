import type { Property } from './database.types';

const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

type FetchPropertiesOptions = { showFeatured?: boolean };
// Fetch all properties
const fetchProperties = async ({ showFeatured = false }: FetchPropertiesOptions = {}) => {
  try {
    // Handle the case where the domain is not available yet
    if (!apiDomain) {
      return { total: null, properties: null };
    }

    const res = await fetch(`${apiDomain}/properties${showFeatured ? '/featured' : ''}`, { cache: 'no-store' });

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    return res.json() as Promise<{ total: number; properties: Property[] }>;
  } catch (error) {
    console.log(error);
    return { total: null, properties: null };
  }
};

// Fetch single property
const fetchProperty = async (id: string) => {
  try {
    // Handle the case where the domain is not available yet
    if (!apiDomain) {
      return null;
    }

    const res = await fetch(`${apiDomain}/properties/${id}`);

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    return res.json() as Promise<Property>;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { fetchProperties, fetchProperty };
