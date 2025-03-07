# KII Frontend Assessment

This project is a blockchain dApp that interacts with the KII testnet and the wrapped token (WKII) contract.

## Features

### Wallet Connection

-   ✅ Connect to EVM wallets (MetaMask and other supported wallets)
-   ✅ Display connected wallet address

### Token Balance Display

-   ✅ Show wrapped token (WKII) balance of the connected wallet
-   ✅ Show native token (KII) balance
-   ✅ Real-time balance updates when transactions occur

### Token Operations

-   ✅ Wrap tokens: Convert KII to WKII tokens
-   ✅ Unwrap tokens: Convert WKII back to KII tokens
-   ✅ Real-time transaction status feedback

### Error Handling

-   ✅ Comprehensive error handling for RPC errors, network issues, and transaction failures
-   ✅ User-friendly error messages

## Technologies Used

-   **Next.js** (v15.1.6): React framework for building the UI
-   **React** (v19.0.0): Frontend library
-   **TypeScript**: For type safety and better developer experience
-   **Wagmi** (v2.12.31): Library for Ethereum wallet interactions
-   **Viem** (v2.21.44): Ethereum interface library
-   **@reown/appkit** (v1.6.8): UI components and utilities
-   **Vitest**: Testing framework compatible with React 19

## Project Structure

```
src/
├── app/                # Next.js app router
├── components/         # React components
├── hooks/              # Custom React hooks
│   ├── useClientMount.ts
│   ├── useTokenBalances.ts
│   └── useWKII.ts
├── styles/             # CSS styling
├── utils/              # Utility functions
└── __tests__/          # Test files
```

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   pnpm (v8.15.9 or later)
-   MetaMask or another Ethereum wallet browser extension

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/kii-assessment.git
    cd kii-assessment
    ```

2. Install dependencies:

    ```bash
    pnpm install
    ```

3. Set up environment variables:

    For development, copy the template to `.env.development`:

    ```bash
    cp .env.development.example .env.development
    ```

    For production, create a `.env.production` file:

    ```bash
    cp .env.production.example .env.production
    ```

    Environment variables used:

    - `NEXT_PUBLIC_PROJECT_ID`: Your project ID for wallet connections
    - `NEXT_PUBLIC_WKII_ADDRESS`: Address of the WKII token contract
    - `NEXT_PUBLIC_KII_TESTNET_RPC`: RPC URL for the KII testnet

4. Start the development server:

    ```bash
    pnpm dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

Run tests with:

```bash
pnpm test
```

For more information about testing, see [TESTING.md](TESTING.md).

## Contract Information

-   **WKII Token Address**: `0xd51e7187e54a4A22D790f8bbDdd9B54b891Bc920`
-   **Network**: KII Testnet (Oro Network)

## Key Implementation Details

### Wallet Connection

-   Uses wagmi to connect to various EVM wallets
-   Provides persistent connection through browser sessions

### Transaction Handling

-   Proper feedback during transaction lifecycle
-   Optimized for better user experience with minimal waiting time
-   Handles confirmation in the user's wallet and updates UI accordingly

### Error Handling Strategy

-   Input validation before transaction submission
-   Meaningful error messages for common blockchain errors
-   Fallback mechanisms for network issues

## License

This project is created for the KII technical assessment and is not licensed for public use.
