document.addEventListener("DOMContentLoaded", function() {
    // Event listener for the Send BTC button
    document.getElementById("send-btn").addEventListener("click", function() {
        const address = document.getElementById('btc-address').value;
        const amount = document.getElementById('btc-amount').value;

        if (!address || !amount) {
            alert('Please enter both Bitcoin address and amount.');
            return;
        }

        showLoadingTransaction();

        setTimeout(() => {
            hideLoadingTransaction();
            showSuccessDialog();
        }, 10000);  // 10 seconds
    });
    document.getElementById('btc-amount').addEventListener('input', function (e) {
        const value = e.target.value;
        // Regular expression to allow only numbers and one decimal point
        const valid = /^[0-9]*\.?[0-9]*$/;
        if (!valid.test(value)) {
            e.target.value = value.slice(0, -1); // Remove the last invalid character
        }
    });
    document.getElementById('history-btn').addEventListener('click', function() {
        window.location.href = 'history.html'; // Redirect to the history page
    });
    

    // Function to show loading dialog
    function showLoadingTransaction() {
        const loadingDialog = document.querySelector('.loading-overlay');
        const loadingTextBox = document.querySelector('.loading-text-box');
        let loadingStages = ['Processing...', 'Confirming...', 'Finalizing...'];
        let stageIndex = 0;

        if (loadingTextBox) {
            loadingDialog.style.display = 'flex';  // Ensure the overlay becomes visible

            const interval = setInterval(() => {
                loadingTextBox.innerText = loadingStages[stageIndex];
                stageIndex++;
                if (stageIndex >= loadingStages.length) {
                    clearInterval(interval);
                }
            }, 3000);  // Change the text every 3 seconds
        } else {
            console.error("loadingTextBox element is missing.");
        }
    }

    // Function to hide loading dialog
    function hideLoadingTransaction() {
        document.querySelector('.loading-overlay').style.display = 'none';
    }

// Function to show success dialog with an icon
function showSuccessDialog() {
    const successBox = document.createElement('div');
    successBox.classList.add('success-box');
    const amount = document.getElementById('btc-amount').value;
    const address = document.getElementById('btc-address').value;
    successBox.innerHTML = `
        <br><img src="tick.png" alt="Success Icon" class="success-icon"></br>
        <strong>Transaction successful!</strong>
        <p>Amount: ${amount} BTC</p>
        <p>Receiver: ${address}</p>
        <p>Status: Completed</p>
    `;

    document.body.appendChild(successBox);
    successBox.style.display = 'block';

    // Event listener to hide the success box when clicking anywhere on the page
    document.addEventListener('click', function hideSuccessBox() {
        successBox.style.display = 'none';
        document.removeEventListener('click', hideSuccessBox);  // Remove the listener after it's triggered
    });
}


    document.addEventListener("DOMContentLoaded", function() {
        fetchBitcoinPriceAndUpdate();
    });
    // Function to fetch Bitcoin price and update USD equivalent dynamically
    async function fetchBitcoinPriceAndUpdate() {
        try {
            const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice/BTC.json');
            const data = await response.json();
            const btcToUsdRate = data.bpi.USD.rate_float;  // Current BTC to USD exchange rate
            
            // Update BTC balance in USD
            const btcBalance = 1;  // Your current BTC balance (from your code)
            const btcBalanceInUsd = (btcBalance * btcToUsdRate).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            document.getElementById('btc-usd').innerText = `${btcBalanceInUsd}`;  // Update the BTC balance in USD

            // Event listener for amount input to calculate USD equivalent
            document.getElementById('btc-amount').addEventListener('input', function() {
                const btcAmount = parseFloat(this.value);
                if (!isNaN(btcAmount)) {
                    const usdEquivalent = (btcAmount * btcToUsdRate).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                    document.getElementById('btc-usd-value').innerText = `USD: ${usdEquivalent}`;
                } else {
                    document.getElementById('btc-usd-value').innerText = '';  // Clear if input is invalid
                }
            });
        } catch (error) {
            console.error('Error fetching Bitcoin price:', error);
            document.getElementById('btc-usd').innerText = 'Error fetching price';
        }
    }

    // Call the function to fetch BTC price on page load
    fetchBitcoinPriceAndUpdate();
});

function openSupportEmail() {
    const email = "your-email@example.com";
    window.open(`mailto:${email}`, '_system');
}

document.getElementById("support-btn").addEventListener("click", openSupportEmail);
