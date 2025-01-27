document.addEventListener("DOMContentLoaded", function() {
    fetchRecentTransactions();
});

// Function to fetch recent transactions from BlockCypher API and display BTC and USD values
async function fetchRecentTransactions() {
    const historyList = document.getElementById('history-list');
    try {
        // Fetch current BTC to USD conversion rate from CoinDesk API
        const priceResponse = await fetch('https://api.coindesk.com/v1/bpi/currentprice/BTC.json');
        const priceData = await priceResponse.json();
        const btcToUsdRate = priceData.bpi.USD.rate_float;  // Current BTC to USD rate

        // Fetch recent Bitcoin transactions from BlockCypher API
        const response = await fetch('https://api.blockcypher.com/v1/btc/main/txs?limit=100');
        const data = await response.json();

        // Clear any previous list
        historyList.innerHTML = '';

        let currentTime = new Date();

        // Loop through the transactions
        data.forEach(tx => {
            const transactionElement = document.createElement('div');
            transactionElement.classList.add('transaction');

            // Convert the transaction amount from satoshis to BTC
            let btcAmount = tx.total / 100000000;

            // Ensure the BTC amount doesn't exceed 10
            if (btcAmount > 0.9) {
                btcAmount = 0.9; // Cap the amount to 10 BTC
            }

            // Calculate the equivalent USD value
            const usdEquivalent = (btcAmount * btcToUsdRate).toLocaleString('en-US', { style: 'currency', currency: 'USD' }); // Format to 2 decimal places

            // Generate a random interval between 10 and 30 minutes for display purposes
            const intervalMinutes = Math.floor(Math.random() * (30 - 10 + 1)) + 10;
            const transactionTime = new Date(currentTime.getTime() - (intervalMinutes * 60 * 1000));
            currentTime = transactionTime;

            // Display the transaction details
            transactionElement.innerHTML = `
                <p class="transaction-id">Transaction ID: <br>${tx.hash}</p>
                <p class="transaction-amount">Amount: ${btcAmount.toFixed(8)} BTC</p>
                <p class="transaction-usd">${usdEquivalent} USD</p>
                <p class="transaction-date">Date: ${transactionTime.toLocaleString()}</p>
            `;

            // Append the transaction to the history list
            historyList.appendChild(transactionElement);
        });
    } catch (error) {
        console.error('Error fetching transactions or BTC price:', error);
        historyList.innerHTML = '<p>Error loading transaction history. Please try again later.</p>';
    }
}
// Go back to the previous page
function goBack() {
    window.history.back();
}

