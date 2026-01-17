# Health Monitor Frontend

A real-time health monitoring dashboard built with Next.js, displaying patient vitals, anomaly detection, and alerts with WebSocket integration.

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or 20.x
- npm 9.x or later

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
health-monitor-frontend/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Dashboard page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── patients/          # Patient detail pages
├── components/            # React components
│   └── dashboard/         # Dashboard-specific components
├── hooks/                 # Custom React hooks
│   └── useDashboard.ts   # Dashboard state management
├── lib/                   # Core libraries
│   ├── api.ts            # API client
│   ├── socket.ts         # WebSocket client
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utility functions
├── __tests__/            # Test suites
├── __mocks__/            # Jest mocks
├── docs/                 # Documentation
├── .github/              # GitHub Actions workflows
└── public/               # Static assets
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

**Current Coverage: 88.11%**

- API Client (`lib/api.ts`): 90.9% statements
- Dashboard Hook (`hooks/useDashboard.ts`): 85.96% statements

### Test Suite

- **17 tests** (all passing ✅)
  - 10 API client unit tests
  - 7 dashboard hook integration tests

For detailed testing documentation, see [docs/TESTING.md](docs/TESTING.md).

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |
| `npm test` | Run test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Real-time**: Socket.IO Client
- **HTTP Client**: Axios
- **Testing**: Jest + React Testing Library
- **CI/CD**: GitHub Actions

## 🌐 Features

- **Real-time Dashboard**: Live patient vitals and anomaly alerts
- **WebSocket Integration**: Real-time updates via Socket.IO
- **Patient Management**: View individual patient details and history
- **Anomaly Detection**: Critical, warning, and normal severity levels
- **Vital Charts**: Interactive charts for heart rate, blood pressure, SpO2, and temperature
- **Alert System**: Browser notifications for critical anomalies
- **Responsive Design**: Mobile-friendly interface

## 📊 API Endpoints

The frontend connects to the backend API at `NEXT_PUBLIC_API_URL`:

- `GET /api/patients` - List all patients
- `GET /api/patients/:id` - Get patient details
- `GET /api/vitals/:id/latest` - Get latest vitals
- `GET /api/vitals/:id/history` - Get vitals history
- `GET /api/anomalies/active` - Get active anomalies
- `GET /api/anomalies/patient/:id` - Get patient anomalies
- `POST /api/anomalies/:id/acknowledge` - Acknowledge anomaly
- `GET /api/dashboard/summary` - Get dashboard summary

## 🔄 CI/CD Pipeline

Automated testing and deployment via GitHub Actions:

- ✅ Linting (ESLint)
- ✅ Type checking (TypeScript)
- ✅ Test suite execution
- ✅ Code coverage reporting
- ✅ Production build validation
- ✅ Security audit

## 📚 Documentation

- [Testing Guide](docs/TESTING.md) - Comprehensive testing documentation
- [Testing Summary](docs/TESTING_SUMMARY.md) - Test coverage and results
- [Completion Report](docs/TESTING_COMPLETION_REPORT.md) - Implementation details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`npm test`)
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Workflow

1. Ensure all tests pass: `npm test`
2. Run linting: `npm run lint`
3. Check types: `npm run type-check`
4. Build locally: `npm run build`

## 📝 License

This project is part of the BizScout Health Monitor system.

## 🔗 Related Projects

- [Health Monitor Backend](../health-monitor-backend) - Node.js/Express API server

---

**Built with ❤️ using Next.js and TypeScript**
