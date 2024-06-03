An app to list and search for rental properties. Built with Next.js and MongoDB.
<img src="https://raw.githubusercontent.com/aviv-maman/property-rental/master/public/preview.jpeg" width="600">

## Features

- Responsive design
- User authentication with Google & Next Auth
- CRUD operations
- Image upload
- Mapbox maps

## Built with

- [React](https://react.dev)
- [Next.js](https://nextjs.org)
- [MongoDB](https://www.mongodb.com)
- [NextAuth.js](https://next-auth.js.org)
- [Cloudinary](https://cloudinary.com)
- [Mapbox](https://www.mapbox.com)
- [Tailwind CSS](https://tailwindcss.com)

## Usage

1. Clone the repository

```
git clone https://github.com/aviv-maman/property-rental
```

2. Rename the `.env.example` file to `.env.local` and fill in the required environment variables according to the next steps.

3. Sign Up on [MongoDB](https://www.mongodb.com) to get your MongoDB connection string from your MongoDB Atlas cluster and add it to `MONGODB_URI`.

4. Sign Up on [Google](https://console.cloud.google.com) to get your Google client ID and client secret from your Google console account and add them to `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

5. Write a secret to `NEXTAUTH_SECRET`. You can generate with the following commands:

   ```
   openssl rand -base64 32
   ```

   or

   ```ts
   $randomBytes = New-Object byte[] 32
   $randomNumberGenerator = [System.Security.Cryptography.RandomNumberGenerator]::Create()
   $randomNumberGenerator.GetBytes($randomBytes)
   $base64String = [Convert]::ToBase64String($randomBytes)
   $base64String
   ```

6. Sign Up on [Cloudinary](https://cloudinary.com) to get your Cloudinary cloud name, API key, and API secret from your Cloudinary account and add them to `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
7. Sign Up on [Mapbox](https://www.mapbox.com) to get your Mapbox token from your Mapbox account and add it to `NEXT_PUBLIC_MAPBOX_TOKEN`.
8. Sign Up on [LocationIQ](https://locationiq.com) to get your LocationIQ API key and add it to `NEXT_PUBLIC_LOCATIONIQ_API_KEY`.
9. Install dependencies

```
npm install
```

10. Run the development server

```
npm run dev
```
