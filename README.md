# ATM Banking System

A responsive, interactive web-based ATM simulation that allows users to perform basic banking operations through a modern interface.

## Features

### Core Functionality
- **Account Login**: PIN-based authentication (Default PIN: 1234)
- **Balance Enquiry**: View current account balance with real-time updates
- **Deposit Money**: Add funds to account with input validation
- **Withdraw Money**: Remove funds with balance verification
- **Transaction History**: Track all deposits and withdrawals
- **Receipt Download**: Generate and download transaction receipts

### Additional Features
- **Local Storage**: Persist data across browser sessions
- **Loading Animations**: Visual feedback during operations
- **Responsive Design**: Optimized for mobile and desktop
- **Input Validation**: Prevent invalid transactions
- **Currency Formatting**: Indian Rupee (₹) formatting
- **Auto-Login**: Remember user session

## Technologies Used

- **HTML5**: Structure and semantic markup
- **CSS3**: Styling, animations, and responsive design
- **JavaScript (ES6)**: Logic, DOM manipulation, and event handling

## File Structure

```
ATM-Menu-Program/
├── index.html      # Main HTML structure
├── styles.css      # CSS styling and animations
├── script.js       # JavaScript logic and functions
└── README.md       # Documentation
```

## How to Use

1. **Open the Application**
   - Open `index.html` in a web browser

2. **Login**
   - Enter your name (optional but recommended)
   - Enter the default PIN: `1234`
   - Click "Login" button

3. **Navigate Features**
   - Use tabs to switch between Deposit, Withdraw, Balance, and History

4. **Deposit Money**
   - Go to Deposit tab
   - Enter amount (positive whole number)
   - Click "Deposit" button
   - Balance updates automatically

5. **Withdraw Money**
   - Go to Withdraw tab
   - Enter amount (positive whole number)
   - Click "Withdraw" button
   - Balance updates if sufficient funds

6. **Check Balance**
   - Go to Balance tab
   - View current balance and last update time
   - Click "Refresh Balance" for latest status

7. **View History**
   - Go to History tab
   - See all transactions with timestamps
   - Download receipt or clear history

8. **Logout**
   - Click "Logout" button to return to login screen

9. **Reset Account**
   - Click "Reset Account" at the bottom
   - Resets balance to ₹10,000 and clears history

## JavaScript Functions

### Core Functions
- `showBalance()`: Display current balance
- `depositMoney()`: Process deposit transactions
- `withdrawMoney()`: Process withdrawal transactions
- `updateBalance()`: Update balance display across UI
- `validateAmount(amount)`: Validate input amounts

### Authentication Functions
- `handleLogin()`: Process user login
- `handleLogout()`: Process user logout
- `checkAutoLogin()`: Restore user session

### UI Functions
- `switchTab(tabName)`: Navigate between sections
- `showTransactionStatus(message, type)`: Display status messages
- `showLoading()` / `hideLoading()`: Toggle loading overlay

### Transaction Functions
- `addTransaction(type, amount)`: Record transaction
- `renderTransactionHistory()`: Display transaction list
- `downloadReceipt()`: Generate receipt file
- `clearTransactionHistory()`: Remove all transactions

### Utility Functions
- `formatCurrency(amount)`: Format as Indian Rupee
- `formatDate(dateString)`: Format date/time
- `getCurrentTime()`: Get current timestamp
- `saveToLocalStorage()`: Persist data
- `loadFromLocalStorage()`: Restore data

## Default Settings

- **Initial Balance**: ₹10,000
- **Default PIN**: 1234
- **Currency**: Indian Rupee (₹)
- **Theme**: Light mode (default)
