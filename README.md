# PropFi - Fractional Property Investment Platform

PropFi is a digital marketplace platform revolutionizing property ownership by enabling fractional property investments through blockchain-powered tokenization. It allows homeowners to obtain loans against their properties while enabling global investors to invest in these properties through fractional ownership.

![PropFi Platform](./static/logo.png)

## 🏠 Overview

PropFi is a bank-owned property marketplace that enables homeowners to obtain loans against their properties while allowing global investors to invest in real estate with minimal capital. The platform uses property tokenization to facilitate fractional ownership, creating a modern, accessible real estate investment ecosystem.

## ✨ Key Features

- **Fractional Property Ownership** - Invest in real estate with as little as $500
- **Property Tokenization** - Properties are divided into tokens, each representing a percentage of ownership
- **User Dashboard** - Manage properties, investments, and track portfolio performance
- **Property Marketplace** - Browse and purchase available property tokens
- **Secondary Token Market** - Buy and sell property tokens from other investors
- **Token Management** - View your tokens, voting rights, and sell options
- **Role-Based Access** - Different interfaces for investors, homebuyers, and property developers

## 🛠️ Technical Stack

- **Frontend**: React.js with TypeScript and Shadcn UI components
- **Backend**: Express.js with Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Secure session-based authentication
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS
- **Routing**: Wouter for lightweight client-side routing

## 📋 User Roles and Features

### Investors
- Browse available properties for investment
- Purchase fractional ownership in properties
- Track investment performance
- Sell tokens on the secondary market
- Vote on property maintenance and improvement decisions

### Homebuyers
- Browse properties for purchase with fractional ownership
- Manage owned properties
- View ownership percentages and details
- Make mortgage payments
- Request property maintenance

### Property Developers
- List properties on the platform
- Track property investments
- Manage property details and documentation
- View property performance metrics

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/propfi.git
cd propfi
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
SESSION_SECRET=your_session_secret
DATABASE_URL=your_database_connection_string
```

4. Start the development server
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5000`

## 📱 Application Walkthrough

### Authentication
- Register a new account or log in with an existing account
- User roles include investor, homebuyer, and property developer

### Dashboard
- View property portfolio and investment statistics
- Manage properties and investments
- Track transaction history
- Update account settings

### Property Marketplace
- Browse available properties
- Filter properties by location, price, and property type
- View detailed property information
- Calculate potential investment returns

### Investment Process
- Select a property to invest in
- Choose the percentage of ownership to purchase
- Complete the transaction
- Receive property tokens

### Token Management
- View owned tokens
- Sell tokens on the marketplace
- Vote on property decisions
- View token performance

## 📊 Investment Calculations

PropFi provides tools to help users understand the potential returns on their investments:

- **Mortgage Calculator** - Calculate monthly payments when buying a property
- **Investment Calculator** - Project potential returns over time
- **Comparison Tools** - Compare traditional homeownership with PropFi's fractional model

## 🔐 Security

- Secure session-based authentication
- Password hashing with salts
- Role-based access control
- Input validation and sanitization

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For questions or support, please contact us at support@propfi.com or visit our website [www.propfi.com](https://www.propfi.com).

---

*PropFi - Democratizing Real Estate Investment for Everyone*