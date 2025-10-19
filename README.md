# CommuteX - Smart Commuting Platform for UAE 
## Innovation Hackathon - Zaid University [TeamId: IH25077]
### Developed by Manar Omar, Salma Rushdi, and Rana Alsttari (Ajman University)

A modern, full-stack ride-sharing and carpooling application designed to revolutionize transportation in the UAE. CommuteX connects drivers and passengers with intelligent trip matching, real-time tracking, and integrated loyalty rewards.

[Demo](https://0829933b63fb44dab998ca86c4517c69-main.projects.builder.my/)

![CommuteX Architecture](https://github.com/manaromar04/CommuteX/blob/main/commuteX-arch.jpg?raw=true)


##  Features

### For Drivers

- **Trip Management**: Create, manage, and complete trips with real-time availability
- **Smart Earnings**: Earn 65% commission per trip (RTA takes 35%)
- **Booking Requests**: Accept/reject passenger requests with detailed information
- **Trip History**: View completed trips with earnings breakdown
- **Reward Points**: Earn bonus points for carpool trips (3+ passengers = 80 points)
- **Wallet System**: Track earnings and manage payments
- **Voucher Redemption**: Redeem points for Salik and RTA discounts

### For Passengers

- **Trip Search**: Find available rides by origin and destination
- **Smart Booking**: Book seats with instant confirmation
- **Wallet Integration**: Pay with wallet balance or add funds
- **Reward System**: Earn points on every trip
  - Carpool trips (3+ passengers): 80 points
  - Park & Ride bookings: 40 points
- **Smart Hubs**: Book parking at premium facilities
- **Voucher Redemption**: Redeem rewards for fuel and parking discounts


##  Tech Stack

### Frontend

- **React 18** - UI library
- **React Router 6** - Client-side routing
- **TypeScript** - Type safety
- **TailwindCSS 3** - Styling
- **Vite** - Build tool
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Recharts** - Data visualization

### Backend

- **Express.js** - Web server
- **Node.js** - Runtime
- **TypeScript** - Type safety
- **Zod** - API validation

### Testing & Quality

- **Vitest** - Unit testing
- **TypeScript** - Type checking
- **Prettier** - Code formatting

### Deployment

- **Netlify** - Hosting & CI/CD
- **Vite** - Production builds

##  Project Structure

```
├── client/                          # React SPA Frontend
│   ├── pages/                       # Route pages
│   │   ├── Dashboard.tsx           # Main driver/passenger dashboard
│   │   ├── DriverHome.tsx          # Driver home
│   │   ├── Login.tsx               # Authentication
│   │   └── ...
│   ├── components/                 # React components
│   │   ├── DriverModals/           # Driver-specific modals
│   │   │   ├── TripCompletionModal.tsx
│   │   │   ├── BookingRequestsModal.tsx
│   │   │   ├── MyTripsModal.tsx
│   │   │   └── EarningsModal.tsx
│   │   ├── PassengerBooking/       # Passenger features
│   │   │   ├── AvailableTrips.tsx
│   │   │   └── TripSearch.tsx
│   │   ├── ui/                     # UI component library
│   │   ├── RedeemVouchersModal.tsx # Voucher system
│   │   ├── SalmaCopilot.tsx        # AI assistant
│   │   └── ...
│   ├── context/                    # React Context
│   │   └── AuthContext.tsx         # Auth state
│   ├── hooks/                      # Custom hooks
│   ├── lib/                        # Utility functions
│   │   ├── tripCompletion.ts       # Trip settlement logic
│   │   ├── rewards.ts              # Reward calculations
│   │   ├── pricing.ts              # Fare calculations
│   │   └── ...
│   ├── App.tsx                     # Main app component
│   └── global.css                  # Global styles
│
├── server/                          # Express Backend
│   ├── index.ts                    # Server setup
│   └── routes/                     # API endpoints
│
├── shared/                          # Shared Types & Utils
│   ├── types.ts                    # TypeScript interfaces
│   ├── seeds.ts                    # Sample data
│   └── api.ts                      # API contracts
│
└── netlify/                         # Netlify functions
    └── functions/                  # Serverless functions
```


##  Key Workflows

### Driver Trip Completion Flow

1. Driver has accepted bookings from multiple passengers
2. Driver clicks "Complete Trip" in My Trips modal
3. System calculates:
   - Total fare from all passengers
   - Driver earnings (65% of total)
   - RTA commission (35% of total)
4. Driver wallet is credited with 65%
5. Success notification shows exact earnings breakdown

### Passenger Booking Flow

1. Passenger searches for available trips
2. Selects a trip and chooses number of seats
3. System checks wallet balance
4. Passenger confirms booking
5. Wallet is debited with trip fare
6. Reward points awarded based on trip type

### Voucher Redemption

1. Passenger/Driver redeems reward points
2. Receives discount vouchers for:
   - **Salik** (toll tags) - Varying discounts
   - **RTA** (registration & licensing)
   - **ADNOC** (fuel)
3. Points deducted from reward balance
4. Voucher code generated with expiration date

##  Commission & Pricing Model

### Trip Commission Split (65/35)

When a passenger books a trip:

- **Driver receives**: 65% of fare amount
- **RTA receives**: 35% of fare amount (platform commission)

### Example

- Passenger pays: 100 AED
- Driver gets: 65 AED (credited to wallet)
- RTA gets: 35 AED
- Driver wallet updates immediately after trip completion

### Reward Points System

- **Carpool Trip (3+ passengers)**: 80 points per trip
- **Park & Ride Booking**: 40 points per booking
- **Bonus Multipliers**: Based on tier level (Bronze → Platinum)

##  Authentication & Authorization

The app uses role-based access control:

### Roles

- **PASSENGER**: Can book trips, redeem vouchers, earn points
- **DRIVER**: Can create trips, accept bookings, earn commission

### Demo Credentials

**Driver Account**

- Email: `manar@email.com`
- Role: Driver with active trips

**Passenger Account**

- Email: `huda@email.com`
- Role: Passenger with bookings

##  Data Models

### User

```typescript
interface User {
  id: string;
  name: string;
  role: "PASSENGER" | "DRIVER" | "ADMIN";
  email: string;
  phone: string;
  wallet_balance_aed: number;
  reward_points: number;
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
  created_at: Date;
}
```

### Trip

```typescript
interface Trip {
  id: string;
  driver_id: string;
  origin: string;
  destination: string;
  departure_time: Date;
  fare_aed: number;
  car_type: "SEDAN" | "SUV" | "MINIVAN";
  available_seats: number;
  current_passengers: number;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  created_at: Date;
}
```

### Booking

```typescript
interface Booking {
  id: string;
  trip_id: string;
  passenger_id: string;
  seats_booked: number;
  total_fare_aed: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  reward_points_earned: number;
  created_at: Date;
}
```

##  API Endpoints

The backend provides RESTful API endpoints (built with Express):

```
GET    /api/ping                    # Health check
GET    /api/demo                    # Demo endpoint
POST   /api/trips                   # Create new trip
GET    /api/trips/:id               # Get trip details
POST   /api/bookings                # Book a trip
POST   /api/trips/complete/:id      # Complete trip & settle
GET    /api/earnings/:driverId      # Get driver earnings
```

##  UI Components

The app includes a comprehensive Radix UI component library:

- Buttons, Cards, Badges
- Dialogs, Modals, Sheets
- Tabs, Accordions, Dropdowns
- Forms, Inputs, Selects
- Progress bars, Spinners
- And 40+ more pre-built components

All components are styled with TailwindCSS and support dark mode.

##  Testing

Run tests with:

```bash
pnpm test
```

##  Performance Features

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Lazy loading for images
- **State Management**: React Context for efficient updates
- **Real-time Updates**: Instant UI updates on wallet/rewards
- **Hot Reload**: Rapid development with full HMR

##  Deployment

### Deploy to Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `pnpm build`
3. Set publish directory: `dist/spa`
4. Environment variables will be auto-configured
5. Deploy!

### Deploy to Vercel

1. Import project from GitHub
2. Vercel auto-detects the configuration
3. Deploy on every push to main

##  Environment Variables

Create a `.env` file for local development:

```env
# Add any API keys or configuration here
# Example:
# VITE_API_BASE_URL=http://localhost:8080
```

##  Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow the existing component patterns
- Use Prettier for formatting
- Add tests for new features


##  Support

For issues and questions:

- Open an issue on GitHub
- Check existing documentation
- Review the AGENTS.md for development guidelines

##  Roadmap

- [ ] Real-time GPS tracking
- [ ] Payment gateway integration (credit/debit cards)
- [ ] Push notifications
- [ ] Driver rating system
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app (React Native)



---

**Made with ❤️ for smarter commuting in the UAE**
