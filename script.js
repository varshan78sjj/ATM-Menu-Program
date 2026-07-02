// ATM Banking System JavaScript

// Global Variables
let balance = 10000;
let transactions = [];
let currentUser = '';
const DEFAULT_PIN = '1234';

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const mainScreen = document.getElementById('mainScreen');
const accountNameInput = document.getElementById('accountName');
const pinInput = document.getElementById('pin');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');
const userNameDisplay = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');
const balanceDisplay = document.getElementById('balanceDisplay');
const checkBalanceDisplay = document.getElementById('checkBalanceDisplay');
const lastUpdatedDisplay = document.getElementById('lastUpdated');
const depositAmountInput = document.getElementById('depositAmount');
const depositBtn = document.getElementById('depositBtn');
const withdrawAmountInput = document.getElementById('withdrawAmount');
const withdrawBtn = document.getElementById('withdrawBtn');
const refreshBalanceBtn = document.getElementById('refreshBalanceBtn');
const transactionHistory = document.getElementById('transactionHistory');
const downloadReceiptBtn = document.getElementById('downloadReceiptBtn');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const resetBtn = document.getElementById('resetBtn');
const transactionStatus = document.getElementById('transactionStatus');
const statusMessage = document.getElementById('statusMessage');
const loadingOverlay = document.getElementById('loadingOverlay');

// Tab Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    setupEventListeners();
    checkAutoLogin();
});

// Setup Event Listeners
function setupEventListeners() {
    // Login
    loginBtn.addEventListener('click', handleLogin);
    pinInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });

    // Logout
    logoutBtn.addEventListener('click', handleLogout);

    // Tab Navigation
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Deposit
    depositBtn.addEventListener('click', depositMoney);
    depositAmountInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') depositMoney();
    });

    // Withdraw
    withdrawBtn.addEventListener('click', withdrawMoney);
    withdrawAmountInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') withdrawMoney();
    });

    // Balance Refresh
    refreshBalanceBtn.addEventListener('click', refreshBalance);

    // Transaction History
    downloadReceiptBtn.addEventListener('click', downloadReceipt);
    clearHistoryBtn.addEventListener('click', clearTransactionHistory);

    // Reset Account
    resetBtn.addEventListener('click', resetAccount);
}

// Check Auto Login
function checkAutoLogin() {
    const savedUser = localStorage.getItem('atm_user');
    if (savedUser) {
        currentUser = savedUser;
        userNameDisplay.textContent = `Welcome, ${currentUser}`;
        showScreen(mainScreen);
        updateBalance();
        renderTransactionHistory();
    }
}

// Handle Login
function handleLogin() {
    const name = accountNameInput.value.trim();
    const pin = pinInput.value.trim();

    if (!name) {
        showLoginError('Please enter your name');
        return;
    }

    if (!pin || pin.length !== 4) {
        showLoginError('Please enter a valid 4-digit PIN');
        return;
    }

    if (pin !== DEFAULT_PIN) {
        showLoginError('Invalid PIN. Try again.');
        return;
    }

    // Successful Login
    currentUser = name;
    localStorage.setItem('atm_user', currentUser);
    userNameDisplay.textContent = `Welcome, ${currentUser}`;
    
    showScreen(mainScreen);
    updateBalance();
    renderTransactionHistory();
    
    // Clear inputs
    accountNameInput.value = '';
    pinInput.value = '';
    loginError.textContent = '';
}

// Show Login Error
function showLoginError(message) {
    loginError.textContent = message;
    loginError.style.animation = 'none';
    setTimeout(() => {
        loginError.style.animation = 'shake 0.5s ease-in-out';
    }, 10);
}

// Handle Logout
function handleLogout() {
    currentUser = '';
    localStorage.removeItem('atm_user');
    showScreen(loginScreen);
}

// Show Screen
function showScreen(screen) {
    loginScreen.classList.add('hidden');
    mainScreen.classList.add('hidden');
    screen.classList.remove('hidden');
}

// Switch Tab
function switchTab(tabName) {
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });

    tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `${tabName}Section`) {
            content.classList.add('active');
        }
    });
}

// Show Balance
function showBalance() {
    updateBalance();
}

// Update Balance
function updateBalance() {
    const formattedBalance = formatCurrency(balance);
    balanceDisplay.textContent = formattedBalance;
    checkBalanceDisplay.textContent = formattedBalance;
    lastUpdatedDisplay.textContent = getCurrentTime();
    saveToLocalStorage();
}

// Refresh Balance
function refreshBalance() {
    showLoading();
    setTimeout(() => {
        updateBalance();
        hideLoading();
        showTransactionStatus('Balance refreshed successfully', 'success');
    }, 500);
}

// Deposit Money
function depositMoney() {
    const amount = parseFloat(depositAmountInput.value);

    if (!validateAmount(amount)) {
        return;
    }

    showLoading();

    setTimeout(() => {
        balance += amount;
        addTransaction('deposit', amount);
        updateBalance();
        
        depositAmountInput.value = '';
        hideLoading();
        showTransactionStatus(`Successfully deposited ${formatCurrency(amount)}`, 'success');
    }, 500);
}

// Withdraw Money
function withdrawMoney() {
    const amount = parseFloat(withdrawAmountInput.value);

    if (!validateAmount(amount)) {
        return;
    }

    if (amount > balance) {
        showTransactionStatus('Insufficient balance!', 'error');
        return;
    }

    showLoading();

    setTimeout(() => {
        balance -= amount;
        addTransaction('withdraw', amount);
        updateBalance();
        
        withdrawAmountInput.value = '';
        hideLoading();
        showTransactionStatus(`Successfully withdrew ${formatCurrency(amount)}`, 'success');
    }, 500);
}

// Validate Amount
function validateAmount(amount) {
    if (isNaN(amount) || amount <= 0) {
        showTransactionStatus('Please enter a valid positive amount', 'error');
        return false;
    }

    if (!Number.isInteger(amount)) {
        showTransactionStatus('Please enter a whole number amount', 'error');
        return false;
    }

    return true;
}

// Add Transaction
function addTransaction(type, amount) {
    const transaction = {
        id: Date.now(),
        type: type,
        amount: amount,
        date: new Date().toISOString(),
        balance: balance
    };

    transactions.unshift(transaction);
    saveToLocalStorage();
    renderTransactionHistory();
}

// Render Transaction History
function renderTransactionHistory() {
    if (transactions.length === 0) {
        transactionHistory.innerHTML = '<p class="no-transactions">No transactions yet</p>';
        return;
    }

    transactionHistory.innerHTML = transactions.map(transaction => `
        <div class="transaction-item ${transaction.type}">
            <div class="transaction-info">
                <div class="transaction-type">
                    ${transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                </div>
                <div class="transaction-date">${formatDate(transaction.date)}</div>
            </div>
            <div class="transaction-amount ${transaction.type}">
                ${transaction.type === 'deposit' ? '+' : '-'}${formatCurrency(transaction.amount)}
            </div>
        </div>
    `).join('');
}

// Clear Transaction History
function clearTransactionHistory() {
    if (confirm('Are you sure you want to clear all transaction history?')) {
        transactions = [];
        saveToLocalStorage();
        renderTransactionHistory();
        showTransactionStatus('Transaction history cleared', 'success');
    }
}

// Download Receipt
function downloadReceipt() {
    if (transactions.length === 0) {
        showTransactionStatus('No transactions to generate receipt', 'error');
        return;
    }

    const receiptContent = generateReceiptContent();
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ATM_Receipt_${currentUser}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showTransactionStatus('Receipt downloaded successfully', 'success');
}

// Generate Receipt Content
function generateReceiptContent() {
    let content = `
========================================
           ATM BANKING SYSTEM
               RECEIPT
========================================
Account Holder: ${currentUser}
Date: ${formatDate(new Date().toISOString())}
Current Balance: ${formatCurrency(balance)}
========================================
TRANSACTION HISTORY
========================================
`;

    transactions.forEach((transaction, index) => {
        content += `
${index + 1}. ${transaction.type.toUpperCase()}
   Amount: ${formatCurrency(transaction.amount)}
   Date: ${formatDate(transaction.date)}
   Balance: ${formatCurrency(transaction.balance)}
   ------------------------
`;
    });

    content += `
========================================
Total Transactions: ${transactions.length}
========================================
Thank you for using ATM Banking System!
Generated: ${getCurrentTime()}
========================================
`;

    return content;
}

// Reset Account
function resetAccount() {
    if (confirm('Are you sure you want to reset your account? This will clear your balance and transaction history.')) {
        balance = 10000;
        transactions = [];
        saveToLocalStorage();
        updateBalance();
        renderTransactionHistory();
        showTransactionStatus('Account reset successfully', 'success');
    }
}

// Show Transaction Status
function showTransactionStatus(message, type) {
    statusMessage.textContent = message;
    transactionStatus.className = `transaction-status ${type}`;
    transactionStatus.classList.remove('hidden');

    setTimeout(() => {
        transactionStatus.classList.add('hidden');
    }, 3000);
}

// Show Loading
function showLoading() {
    loadingOverlay.classList.remove('hidden');
}

// Hide Loading
function hideLoading() {
    loadingOverlay.classList.add('hidden');
}

// Format Currency
function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get Current Time
function getCurrentTime() {
    return new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Save to Local Storage
function saveToLocalStorage() {
    localStorage.setItem('atm_balance', balance.toString());
    localStorage.setItem('atm_transactions', JSON.stringify(transactions));
}

// Load from Local Storage
function loadFromLocalStorage() {
    const savedBalance = localStorage.getItem('atm_balance');
    const savedTransactions = localStorage.getItem('atm_transactions');

    if (savedBalance) {
        balance = parseFloat(savedBalance);
    }

    if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
    }
}

// Add shake animation for errors
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);
