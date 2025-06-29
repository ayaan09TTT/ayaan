# Project Summary
Trade-Forge is a React-based web application designed as a trading platform that facilitates user authentication, trade room creation, wallet management, and real-time updates through Socket.IO. The platform aims to enhance trading experiences by providing a user-friendly interface and a robust backend for managing trades and transactions. Recent updates have improved the development server configuration, allowing for external access and better connectivity.

# Project Module Description
- **User Authentication**: Handles user login and registration processes.
- **Trade Rooms**: Allows users to create and join trade rooms for collaborative trading.
- **Wallet Management**: Provides functionalities for deposits and withdrawals.
- **Transaction History**: Displays users' past transactions for better tracking.
- **Real-time Updates**: Utilizes Socket.IO for live updates within the application.

# Directory Tree
```
trade-forge/
├── README.md                  # Project overview and setup instructions
├── eslint.config.js           # ESLint configuration file
├── index.html                 # Main HTML file for the application
├── package.json               # Project dependencies and scripts
├── postcss.config.js          # PostCSS configuration file
├── public/data/example.json    # Sample data for testing
├── src/
│   ├── App.jsx                # Main application component
│   ├── components/            # Contains reusable components
│   │   ├── layout/
│   │   │   ├── Footer.jsx     # Footer component
│   │   │   ├── Header.jsx     # Header component
│   │   │   └── Sidebar.jsx    # Sidebar component
│   │   └── wallet/
│   │       └── TransactionHistory.jsx # Transaction history component
│   ├── contexts/              # Context providers for state management
│   │   ├── AuthContext.jsx    # Authentication context
│   │   └── SocketContext.jsx   # Socket connection context
│   ├── index.css              # Global styles
│   ├── main.jsx               # Entry point of the application
│   └── pages/                 # Contains page components
│       ├── AuthPages/
│       │   ├── LoginPage.jsx  # Login page
│       │   └── RegisterPage.jsx # Registration page
│       ├── Dashboard/
│       │   └── DashboardPage.jsx # Dashboard page
│       ├── HomePage.jsx       # Home page
│       └── TradeRooms/
│           ├── CreateTradeRoomPage.jsx # Page to create trade rooms
│           ├── TradeRoomDetailPage.jsx # Detailed view of trade rooms
│           └── TradeRoomsListPage.jsx  # List of trade rooms
│       └── Wallet/
│           ├── DepositPage.jsx # Deposit page
│           ├── WalletPage.jsx  # Wallet overview page
│           └── WithdrawPage.jsx # Withdraw page
│   ├── services/              # API services for data fetching
│   │   ├── api.js             # General API functions
│   │   ├── authService.js     # Authentication-related API calls
│   │   ├── chatService.js     # Chat-related API functions
│   │   ├── tradeRoomService.js # Trade room-related API functions
│   │   ├── transactionService.js # Transaction-related API calls
│   │   ├── userService.js     # User-related API functions
│   │   └── walletService.js    # Wallet-related API functions
│   └── utils/                 # Utility functions and components
│       ├── PrivateRoute.jsx   # Route protection component
│       └── RazorpayScript.js   # Integration script for Razorpay
├── tailwind.config.js         # Tailwind CSS configuration
└── vite.config.js             # Vite configuration for the project
uploads/
├── code.ipynb                 # Jupyter notebook for analysis
├── extracted.zip              # Extracted files from uploads
└── uploads (2).zip           # Additional uploaded files
```

# File Description Inventory
- **README.md**: Contains setup instructions and project details.
- **package.json**: Lists dependencies and scripts for the project.
- **src/**: Main source directory containing components, pages, services, and utilities for the application.

# Technology Stack
- **Frontend**: React, Vite, Tailwind CSS
- **State Management**: Context API
- **Real-time Communication**: Socket.IO
- **API Communication**: Axios or Fetch API

# Usage
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Run linting checks:
   ```bash
   pnpm run lint
   ```
3. Start the development server with external access:
   ```bash
   pnpm run dev -- --host 0.0.0.0
   ```
