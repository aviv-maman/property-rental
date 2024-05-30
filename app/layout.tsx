import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/assets/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthProvider from '@/components/AuthProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PropertyRental | Find the Perfect Rental',
  description: 'Find the perfect rental property for you and your family.',
  keywords:
    'rental, property, real estate, house, apartment, condo, find rentals, find properties, find real estate, find house, find apartment, find condo, rental property, rental house, rental apartment, rental condo, real estate property, real estate house, real estate apartment, real estate condo, house rental, apartment rental, condo rental, property rental, real estate rental, rental property search, rental house search, rental apartment search, rental condo search, real estate property search, real estate house search, real estate apartment search, real estate condo search, house rental search, apartment rental search, condo rental search, property rental search, real estate rental search, rental property listings, rental house listings, rental apartment listings, rental condo listings, real estate property listings, real estate house listings, real estate apartment listings, real estate condo listings, house rental listings, apartment rental listings, condo rental listings, property rental listings, real estate rental listings',
};

interface RootLayoutProps {
  children: Readonly<React.ReactNode>;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <AuthProvider>
      <html lang='en'>
        <body className={inter.className}>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <ToastContainer />
        </body>
      </html>
    </AuthProvider>
  );
};

export default RootLayout;
