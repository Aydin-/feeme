# FeeMe - Bitcoin Transaction Fee Estimator

A web application that helps Bitcoin users estimate optimal transaction fees based on current network conditions.

## Features

- Real-time Bitcoin network fee recommendations
- Transaction size-based fee calculation
- Three fee tiers: Fast (10 min), Medium (30 min), and Slow (1+ hour)
- Modern, responsive UI with dark mode
- Real-time network status display

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd feeme
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

## Running the Application

1. Start the backend server:
```bash
# From the root directory
npm run dev
```

2. Start the frontend development server:
```bash
# From the frontend directory
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

- `GET /api/fees` - Get current network fee recommendations
- `GET /api/mempool` - Get current mempool statistics
- `POST /api/calculate-fee` - Calculate fees for a specific transaction size

## Technologies Used

- Frontend:
  - React
  - Material-UI
  - Axios

- Backend:
  - Node.js
  - Express
  - Axios

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 