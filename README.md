# Next.js TikTok Auth Template (Auth.js v5 & Prisma)

This is a proof-of-concept (PoC) project demonstrating how to integrate TikTok OAuth 2.0 authentication into a Next.js application using NextAuth.js v5 (Auth.js) and Prisma ORM with a PostgreSQL database.

[![Next.js](https://img.shields.io/badge/Next.js-15.x-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-v5-blue?style=for-the-badge&logo=nextauth.js)](https://next-auth.js.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-darkblue?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

## Features

- **TikTok OAuth 2.0 Integration:** Securely log in users via their TikTok accounts.
- **NextAuth.js v5 (Auth.js):** Leverages the latest version of Auth.js for robust authentication.
- **Prisma ORM:** Manages database interactions with a PostgreSQL backend. Includes schema for users, accounts, and sessions.
- **Next.js 15 App Router:** Built using the modern Next.js App Router.
- **Tailwind CSS:** For styling the user interface.
- **TypeScript:** For type safety and improved developer experience.
- **Server Actions:** Used for handling sign-in and sign-out operations.
- **Custom JWT & Session Callbacks:** Demonstrates how to include TikTok-specific user data (like `open_id`, `display_name`, `avatar_url`) in the JWT and session.

## Prerequisites

- Node.js or bun
- npm, yarn, pnpm, or bun
- A PostgreSQL database instance
- A TikTok Developer Account and a registered application to get Client ID and Client Secret.

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/szcharlesji/tiktok-oauth-nextjs-template.git
    cd tiktok-oauth-nextjs-template
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root of the project and add the following variables.
    Replace the placeholder values with your actual credentials.

    ```env
    # Database
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

    # NextAuth.js
    AUTH_SECRET="YOUR_STRONG_AUTH_SECRET_HERE" # Generate one: openssl rand -base64 32
    AUTH_URL="http://localhost:3000" # Or your deployment URL

    # TikTok OAuth Provider
    AUTH_TIKTOK_ID="YOUR_TIKTOK_CLIENT_ID"
    AUTH_TIKTOK_SECRET="YOUR_TIKTOK_CLIENT_SECRET"
    ```

    - **`AUTH_URL`**: Important for OAuth redirects. Set to `http://localhost:3000` for local development.
    - **`AUTH_SECRET`**: A random string used to hash tokens, sign cookies, and generate cryptographic keys.

4.  **Set up TikTok Developer App:**

    - Go to the [TikTok Developer Portal](https://developers.tiktok.com/).
    - Create a new application.
    - Configure your app and obtain the `Client ID` and `Client Secret`.
    - Ensure your **Redirect URI** in the TikTok app settings is set correctly. For local development, this will typically be `http://localhost:3000/api/auth/callback/tiktok`. For production, it will be `YOUR_DEPLOYMENT_URL/api/auth/callback/tiktok`.

5.  **Set up Prisma and Database:**

    - Ensure your `DATABASE_URL` in `.env` is correctly pointing to your PostgreSQL database.
    - Generate Prisma Client:
      ```bash
      bunx prisma generate
      ```
    - Apply database migrations:
      ```bash
      bunx prisma migrate dev --name init
      ```
      This will create the necessary tables (`User`, `Account`, `Session`, `VerificationToken`) in your database based on `prisma/schema.prisma`.

6.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure Highlights

- `app/api/auth/[...nextauth]/route.ts`: NextAuth.js dynamic route handler.
- `auth.ts`: Core NextAuth.js configuration, including providers and callbacks.
- `lib/prisma.ts`: Prisma client instance.
- `prisma/schema.prisma`: Prisma schema defining database models.
- `app/page.tsx`: The main page demonstrating login/logout functionality and displaying user info.
- `app/layout.tsx`: Root layout, includes `NextAuthProvider` for session management.
- `app/context/NextAuthProvider.tsx`: Client component wrapper for `SessionProvider`.
- `next-auth.d.ts`: TypeScript declarations for extending NextAuth.js session and JWT types with custom TikTok data.
- `.env`: For environment variables (ignored by Git).
- `package.json`: Project dependencies and scripts.

## How TikTok Data is Handled

- **`auth.ts` Callbacks:**
  - The `jwt` callback is used to enrich the JWT with `accessToken`, `refreshToken`, `accessTokenExpires`, user `id`, and custom `tiktokUser` data (like `open_id`, `display_name`, `avatar_url`) obtained from the TikTok profile during login.
  - The `session` callback is used to pass data from the JWT (including the custom `tiktokUser` object and `accessToken`) to the client-side session object.
- **`next-auth.d.ts`:**
  - This file extends the default `Session` and `JWT` interfaces from `next-auth` and `next-auth/jwt` to include the custom fields (e.g., `session.user.tiktok`, `token.tiktokUser`). This provides type safety when accessing this data in your application.
- **`app/page.tsx`:**
  - The homepage uses the `auth()` server-side utility to get the session.
  - It then displays the TikTok display name (`session.user.tiktok?.display_name`) and avatar (`session.user.tiktok?.avatar_url`) if available.
