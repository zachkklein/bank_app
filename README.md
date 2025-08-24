# Personal Finance Banking App
  
  **A modern, secure banking platform for managing your finances with ease**
  
  ![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css)
  ![Appwrite](https://img.shields.io/badge/Appwrite-F02E65?logo=appwrite)
  ![Plaid](https://img.shields.io/badge/Plaid-000000?logo=plaid)
  ![Dwolla](https://img.shields.io/badge/Dwolla-FF6B00?logo=dwolla)

  <img width="2998" height="1464" alt="auth-image" src="https://github.com/user-attachments/assets/39957517-9b30-4389-a3c4-e3f59a4831ce" />
  <img width="2998" height="1464" alt="my_banks" src="https://github.com/user-attachments/assets/f18282f4-834f-47e6-9151-e56ed22692a0" />
  <img width="2998" height="1464" alt="transactionHistory" src="https://github.com/user-attachments/assets/f4962968-2de9-4147-af63-18904325f46a" />
  <img width="2998" height="1464" alt="payment_transfer" src="https://github.com/user-attachments/assets/ed5c96a3-25c3-4a4b-b7c8-64af0a7365c6" />
  <img width="2998" height="1464" alt="connectBank" src="https://github.com/user-attachments/assets/3bf07774-2ed8-4bc5-acd8-86d649eca10b" />
  <img width="2998" height="1464" alt="signIn" src="https://github.com/user-attachments/assets/20478da5-45a7-48b2-ae1a-4129a7e60c7d" />
  <img width="2998" height="1464" alt="signUp" src="https://github.com/user-attachments/assets/1b590141-6640-4a14-8ef2-559138b21093" />


##  Features

###  **Secure Authentication**
- Email/password authentication with Appwrite
- Secure session management with HTTP-only cookies
- Protected routes with automatic redirects

###  **Multi-Bank Integration**
- **Plaid Integration**: Connect multiple bank accounts securely
- **Real-time Balance Tracking**: View current and available balances
- **Account Management**: Support for checking, savings, and credit accounts
- **Institution Information**: Display bank logos and official names

###  **Interactive Dashboard**
- **Total Balance Overview**: Animated counter with doughnut chart visualization
- **Account Cards**: Beautiful bank cards with masked account numbers
- **Recent Transactions**: Paginated transaction history with filtering
- **Responsive Design**: Optimized for desktop and mobile devices

###  **Money Transfers**
- **Peer-to-Peer Transfers**: Send money between connected accounts
- **Dwolla Integration**: Secure ACH transfers with real-time processing
- **Transfer History**: Track all incoming and outgoing transfers

###  **Financial Analytics**
- **Visual Charts**: Interactive doughnut charts using Chart.js
- **Transaction Categorization**: Automatic categorization of expenses
- **Balance Trends**: Historical balance tracking

##  Tech Stack

### **Frontend**
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with custom styling
- **Charts**: Chart.js and React Chart.js 2
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React icons

### **Backend**
- **Database**: Appwrite (NoSQL)
- **Authentication**: Appwrite Auth
- **API**: Next.js API routes
- **Banking API**: Plaid for account connections
- **Payment Processing**: Dwolla for transfers

### **Development**
- **Language**: TypeScript
- **Linting**: ESLint
- **Package Manager**: npm/yarn/pnpm/bun
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm/bun
- Appwrite project
- Plaid developer account
- Dwolla sandbox/production account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zachkklein/bank_app
   cd bank_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Appwrite Configuration
   NEXT_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_endpoint
   NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id
   NEXT_APPWRITE_KEY=your_appwrite_secret_key
   APPWRITE_DATABASE_ID=your_database_id
   APPWRITE_USER_COLLECTION_ID=your_users_collection_id
   APPWRITE_BANK_COLLECTION_ID=your_banks_collection_id
   APPWRITE_TRANSACTION_COLLECTION_ID=your_transactions_collection_id

   # Plaid Configuration
   PLAID_CLIENT_ID=your_plaid_client_id
   PLAID_SECRET=your_plaid_secret_key
   PLAID_ENV=sandbox # or production

   # Dwolla Configuration
   DWOLLA_KEY=your_dwolla_key
   DWOLLA_SECRET=your_dwolla_secret
   DWOLLA_ENV=sandbox # or production
   ```

4. **Database Setup**
   
   Create the following collections in your Appwrite database:
   
   **Users Collection:**
   ```json
   {
     "userId": "string",
     "email": "string",
     "firstName": "string",
     "lastName": "string",
     "address1": "string",
     "city": "string",
     "state": "string",
     "postalCode": "string",
     "dateOfBirth": "string",
     "ssn": "string",
     "dwollaCustomerId": "string",
     "dwollaCustomerUrl": "string"
   }
   ```
   
   **Banks Collection:**
   ```json
   {
     "userId": "string",
     "bankId": "string",
     "accountId": "string",
     "accessToken": "string",
     "fundingSourceUrl": "string",
     "shareableId": "string"
   }
   ```
   
   **Transactions Collection:**
   ```json
   {
     "name": "string",
     "amount": "string",
     "senderId": "string",
     "senderBankId": "string",
     "receiverId": "string",
     "receiverBankId": "string",
     "email": "string",
     "channel": "string",
     "category": "string"
   }
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Application Structure

```
horizon-banking/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (root)/
│   │   ├── my-banks/
│   │   ├── payment-transfer/
│   │   └── transaction-history/
│   └── globals.css
├── components/
│   ├── ui/
│   ├── AuthForm.tsx
│   ├── BankCard.tsx
│   ├── DoughnutChart.tsx
│   ├── PaymentTransferForm.tsx
│   └── ...
├── lib/
│   ├── actions/
│   │   ├── bank.actions.ts
│   │   ├── user.actions.ts
│   │   └── dwolla.actions.ts
│   ├── appwrite.ts
│   ├── plaid.ts
│   └── utils.ts
└── types/
    └── index.d.ts
```

### **Authentication Flow**
- User registration with comprehensive KYC information
- Secure login with session management
- Automatic redirects for protected routes
- Logout functionality with session cleanup

### **Bank Account Connection**
- Plaid Link integration for secure bank connections
- Support for 10,000+ financial institutions
- Real-time account verification
- Multiple account support per user

### **Transaction Management**
- Real-time transaction synchronization
- Transaction categorization and filtering
- Pagination for large transaction histories
- Transfer creation and tracking

### **Payment Processing**
- Dwolla ACH network integration
- Secure fund transfers between accounts
- Real-time transfer status updates
- Transaction fee handling

##  Monitoring & Analytics

- **Error Tracking**: Sentry integration for error monitoring
- **Performance Monitoring**: Core Web Vitals tracking
- **User Analytics**: Optional analytics integration
- **Transaction Monitoring**: Real-time transaction tracking


##  Acknowledgments

- **JSMastery Tutorial Video** for providing in depth tutorial about how to build this application. Using this tutorial, I was able to learn the technologies thoroughly and fully understand every aspect that went into this application. This could not have been a more helpful and informative tutorial. 
- **Plaid** for providing secure banking APIs
- **Dwolla** for payment processing infrastructure
- **Appwrite** for backend-as-a-service platform
- **Vercel** for hosting and deployment
- **Next.js** team for the amazing framework

