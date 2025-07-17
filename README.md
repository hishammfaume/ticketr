# Ticketr 🎫

A modern ticket booking platform built with Next.js, featuring real-time queuing, secure payments, and seamless user management.

## ✨ Features

- **Event Management**: Create and manage events with image uploads
- **Smart Queuing System**: Fair ticket distribution with waiting lists
- **Secure Payments**: Stripe integration with Connect for sellers
- **Real-time Updates**: Live queue positions and ticket availability
- **QR Code Tickets**: Digital tickets with QR codes for easy scanning
- **User Authentication**: Secure login with Clerk
- **Seller Dashboard**: Analytics and event management for sellers
- **Responsive Design**: Mobile-first design with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Convex (real-time database)
- **Authentication**: Clerk
- **Payments**: Stripe & Stripe Connect
- **File Storage**: Convex File Storage
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Convex account
- A Clerk account  
- A Stripe account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ticketr
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Convex
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   CONVEX_DEPLOY_KEY=your_convex_deploy_key

   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up Convex**
   ```bash
   npx convex dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── actions/           # Server actions
│   ├── api/              # API routes
│   ├── event/            # Event pages
│   ├── seller/           # Seller dashboard
│   ├── tickets/          # Ticket management
│   └── connect/          # Stripe Connect integration
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── EventCard.tsx     # Event display component
│   ├── EventForm.tsx     # Event creation form
│   ├── PurchaseTicket.tsx # Ticket purchase component
│   └── ...
├── convex/               # Convex backend
│   ├── schema.ts         # Database schema
│   ├── events.ts         # Event queries/mutations
│   ├── tickets.ts        # Ticket management
│   ├── users.ts          # User management
│   └── waitingList.ts    # Queue management
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── public/              # Static assets
```

## 🎯 Key Features Explained

### Event Management
- Create events with details, pricing, and images
- Set capacity limits and manage availability
- Cancel events with automatic refunds

### Smart Queuing System
- Fair first-come-first-served ticket distribution
- Real-time queue position updates
- Automatic ticket release for expired offers

### Payment Processing
- Secure Stripe Checkout integration
- Stripe Connect for seller payouts
- Automatic fee handling (1% platform fee)

### Digital Tickets
- QR code generation for easy scanning
- Ticket validation system
- Non-transferable security

## 🔧 Configuration

### Convex Setup
The project uses Convex for real-time data management. Key files:
- [`convex/schema.ts`](convex/schema.ts) - Database schema
- [`convex/auth.config.ts`](convex/auth.config.ts) - Authentication configuration

### Stripe Integration
- Connect accounts for sellers
- Webhook handling for payment events
- See [`app/api/webhooks/stripe/route.ts`](app/api/webhooks/stripe/route.ts)

### Authentication
Uses Clerk for user management with automatic Convex sync via [`components/SyncUserWithConvex.tsx`](components/SyncUserWithConvex.tsx)

## 🚀 Deployment

### Deploy to Vercel

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy your Convex backend**
   ```bash
   npx convex deploy
   ```
4. **Update environment variables with production URLs**

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📝 API Reference

### Key Components

- [`EventForm`](components/EventForm.tsx) - Event creation and editing
- [`PurchaseTicket`](components/PurchaseTicket.tsx) - Ticket purchasing flow
- [`Ticket`](components/Ticket.tsx) - Digital ticket display
- [`SellerDashboard`](components/SellerDashboard.tsx) - Seller analytics

### Server Actions

- [`createStripeCheckoutSession`](app/actions/createStripeCheckoutSession.ts) - Payment processing
- [`createStripeConnectCustomer`](app/actions/createStripeConnectCustomer.ts) - Seller onboarding

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) for the amazing framework
- [Convex](https://convex.dev) for real-time backend
- [Clerk](https://clerk.com) for authentication
- [Stripe](https://stripe.com) for payment processing
- [Tailwind CSS](https://tailwindcss.com) for styling
