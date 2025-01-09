# Healthcare Blockchain Application

A secure and transparent healthcare records management system built on the Avalanche blockchain.

## Features

- **Secure Record Storage**: Medical records are stored on the blockchain, ensuring they cannot be tampered with
- **Privacy**: Access control through Aadhar number verification
- **Health Coins**: Earn rewards for each medical record added
- **Store**: Redeem Health Coins for discounts on medical services

## Prerequisites

- Node.js 16+ and npm
- MetaMask browser extension
- Avalanche network configured in MetaMask

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your configuration:
   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
   NEXT_PUBLIC_AVALANCHE_RPC=your_avalanche_rpc_url
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Smart Contract Deployment

1. The smart contract is located in `contracts/HealthcareSystem.sol`
2. Deploy it to the Avalanche network using your preferred method (Hardhat, Truffle, etc.)
3. Update the contract address in your `.env.local` file

## Usage

### For Hospitals
1. Connect your MetaMask wallet
2. Navigate to the Hospital Portal
3. Enter patient's Aadhar number and prescription details
4. Confirm the transaction in MetaMask

### For Patients
1. Navigate to the Patient Portal
2. Enter your Aadhar number
3. View your medical records and Health Coins balance

### Store
1. Enter your Aadhar number to check your Health Coins balance
2. Browse available discounts and services
3. Redeem your Health Coins for discounts

## Security

- All medical records are stored on the Avalanche blockchain
- Access is controlled through Aadhar number verification
- Smart contract ensures only registered hospitals can add records
- Health Coins transactions are secured by blockchain

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
