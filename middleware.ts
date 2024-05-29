import { withAuth } from 'next-auth/middleware';

export default withAuth({
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    authorized: ({ token }) => !!token,
  },
  pages: { signIn: '/' },
});

// export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/properties/add', '/profile', '/properties/saved', '/messages'],
};
