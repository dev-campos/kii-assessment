# KII Testnet Wrapper

A simple dApp that connects to the KiiChain testnet and interacts with the wrapped token (WKII).

## Features

-   Connect EVM wallets (e.g., MetaMask)
-   Display connected wallet address
-   Show native KII and wrapped WKII token balances
-   Wrap native KII tokens into WKII tokens
-   Unwrap WKII tokens back to native KII tokens
-   Real-time transaction status updates
-   User-friendly error handling

## Technology Stack

-   React
-   Next.js
-   TypeScript
-   Wagmi
-   Viem
-   Reown AppKit

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn

### Installation

1. Clone the repository:

    ```
    git clone https://github.com/yourusername/kii-assessment.git
    cd kii-assessment
    ```

2. Install dependencies:

    ```
    npm install
    # or
    yarn
    ```

3. Start the development server:

    ```
    npm run dev
    # or
    yarn dev
    ```

4. Open your browser and navigate to `http://localhost:3000`

## Contract Information

-   Wrapped KII (WKII) Contract: `0xd51e7187e54a4A22D790f8bbDdd9B54b891Bc920`
-   KiiChain Testnet RPC: `https://json-rpc.uno.sentry.testnet.v3.kiivalidator.com/`

## License

This project is part of a technical assessment for KII.
