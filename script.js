let transactions = [];

// Event listener for form submission
document.getElementById('transactionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    addTransaction();
});

// Function to add a transaction
function addTransaction() {
    const amountStr = document.getElementById('amount').value; // Get the input as a string
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const type = document.querySelector('input[name="type"]:checked').value;

    // Validate amount to ensure it's a positive number (allowing decimals)
    const amount = parseFloat(amountStr); // Convert the string to a float
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount greater than 0.');
        return;
    }

    // Create a transaction object
    const transaction = {
        description,
        amount: type === 'income' ? amount : -amount,
        category,
        type,
    };

    transactions.push(transaction); // Add transaction to the array
    updateLocalStorage(); // Save to local storage
    updateUI(); // Update the UI
    clearForm(); // Clear form fields
}

// Function to update the UI based on the filter type
function updateUI(filterType = 'all') {
    const transactionTable = document.getElementById('transactionHistory').getElementsByTagName('tbody')[0];
    transactionTable.innerHTML = ''; // Clear table

    let filteredTransactions = transactions;

    // Filter transactions based on type
    if (filterType === 'income') {
        filteredTransactions = transactions.filter(t => t.type === 'income');
    } else if (filterType === 'expense') {
        filteredTransactions = transactions.filter(t => t.type === 'expense');
    }

    // Populate the transaction table
    filteredTransactions.forEach((transaction, index) => {
        const row = transactionTable.insertRow();
        row.insertCell(0).innerText = transaction.description;
        row.insertCell(1).innerText = transaction.amount.toFixed(2); // Display amount with 2 decimal places
        row.insertCell(2).innerText = transaction.category;
        row.insertCell(3).innerText = transaction.type === 'income' ? 'Income' : 'Expense';
        row.insertCell(4).innerHTML = `<button onclick="deleteTransaction(${index})">Delete</button>`;
    });

    updateBalance(); // Update balance display
}

// Function to filter transactions
function filterTransactions(type) {
    updateUI(type);
}

// Function to update the balance display
function updateBalance() {
    const balanceElement = document.getElementById('balance');
    const total = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

    // Display the balance with appropriate class for styling
    balanceElement.innerText = `Balance: $${total.toFixed(2)}`;
    balanceElement.className = total < 0 ? 'negative' : 'positive';
}

// Function to delete a specific transaction
function deleteTransaction(index) {
    transactions.splice(index, 1); // Remove the transaction
    updateLocalStorage(); // Save updated transactions to local storage
    updateUI(); // Update the UI
}

// Function to delete all transactions
function deleteAllTransactions() {
    if (confirm('Are you sure you want to delete all transactions? This action cannot be undone.')) {
        transactions = []; // Clear the transactions array
        updateLocalStorage(); // Save changes to local storage
        updateUI(); // Update the UI
    }
}

// Function to clear the input form
function clearForm() {
    document.getElementById('description').value = '';
    document.getElementById('amount').value = ''; // Clear amount field
    document.getElementById('category').value = 'Food'; // Reset category to default
    document.querySelector('input[name="type"][value="income"]').checked = true; // Reset type to income
}

// Function to update local storage with current transactions
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions)); // Store transactions as a JSON string
}

// Function to load transactions from local storage
function loadFromLocalStorage() {
    const storedTransactions = localStorage.getItem('transactions'); // Get stored transactions
    if (storedTransactions) {
        transactions = JSON.parse(storedTransactions); // Parse JSON string back to array
    }
    updateUI(); // Update the UI with loaded transactions
}

// Load transactions when the window is loaded
window.onload = function() {
    loadFromLocalStorage();
};
