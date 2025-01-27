document.addEventListener("DOMContentLoaded", function() {
    // Event listener for the Send BTC button
    document.getElementById("send-btn").addEventListener("click", function() {
        const address = document.getElementById('btc-address').value;
        const amount = parseFloat(document.getElementById('btc-amount').value);

        // Validate Bitcoin address: starts with 1, 3, or bc1 and length between 26 and 42
        const isValidAddress = (
            (address.startsWith('1') || address.startsWith('3') || address.startsWith('bc1')) &&
            address.length >= 26 &&
            address.length <= 42
        );

        // Validate amount: Must be 1 BTC or less
        if (!isValidAddress || isNaN(amount) || amount <= 0 || amount > 1) {
            console.log("Validation failed: Invalid address or amount exceeds limit.");
            return;  // Exit without showing dialog if validation fails
        }

        // Show loading dialog
        showLoadingTransaction();

        setTimeout(() => {
            hideLoadingTransaction();
            showSuccessDialog();
        }, 10000);  // Simulate 10-second delay for transaction
    });

    document.getElementById('btc-amount').addEventListener('input', function (e) {
        const value = e.target.value;
        const valid = /^[0-9]*\.?[0-9]*$/;
        if (!valid.test(value)) {
            e.target.value = value.slice(0, -1);  // Remove the last invalid character
        }
    });

    document.getElementById('history-btn').addEventListener('click', function() {
        window.location.href = 'his.html';  // Redirect to the history page
    });

    // Show loading dialog
    function showLoadingTransaction() {
        const loadingDialog = document.querySelector('.loading-overlay');
        const loadingTextBox = document.querySelector('.loading-text-box');
        let loadingStages = ['Processing...', 'Unable to process...', 'Trying again...'];
        let stageIndex = 0;

        if (loadingDialog && loadingTextBox) {
            loadingDialog.style.display = 'flex';  // Make loading overlay visible

            const interval = setInterval(() => {
                loadingTextBox.innerText = loadingStages[stageIndex];
                stageIndex++;
                if (stageIndex >= loadingStages.length) {
                    clearInterval(interval);
                }
            }, 3000);  // Update the text every 3 seconds
        } else {
            console.error("Loading dialog or text box element is missing.");
        }
    }

    // Hide loading dialog
    function hideLoadingTransaction() {
        const loadingDialog = document.querySelector('.loading-overlay');
        if (loadingDialog) {
            loadingDialog.style.display = 'none';
        } else {
            console.error("Loading dialog element is missing.");
        }
    }

    // Show success dialog with an icon
    function showSuccessDialog() {
        const successBox = document.createElement('div');
        successBox.classList.add('success-box');
        const amount = document.getElementById('btc-amount').value;
        const address = document.getElementById('btc-address').value;
        successBox.innerHTML = `
            <br><img src="close.png" alt="Success Icon" class="success-icon"></br>
            <strong>Transaction Failed</strong>
            <p>Amount: ${amount} BTC</p>
            <p>Receiver: ${address}</p>
            <p>Error:Unable to connect to a node</p>
        `;

        document.body.appendChild(successBox);
        successBox.style.display = 'block';

        // Event listener to hide success box on click
        document.addEventListener('click', function hideSuccessBox() {
            successBox.style.display = 'none';
            document.removeEventListener('click', hideSuccessBox);
        });
    }

    // Fetch BTC price and update USD equivalent dynamically
    async function fetchBitcoinPriceAndUpdate() {
        try {
            const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice/BTC.json');
            const data = await response.json();
            const btcToUsdRate = data.bpi.USD.rate_float;

            const btcBalance = 1;
            const btcBalanceInUsd = (btcBalance * btcToUsdRate).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            document.getElementById('btc-usd').innerText = `${btcBalanceInUsd}`;

            // Update USD equivalent dynamically when BTC amount changes
            document.getElementById('btc-amount').addEventListener('input', function() {
                const btcAmount = parseFloat(this.value);
                if (!isNaN(btcAmount)) {
                    const usdEquivalent = (btcAmount * btcToUsdRate).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                    document.getElementById('btc-usd-value').innerText = `USD: ${usdEquivalent}`;
                } else {
                    document.getElementById('btc-usd-value').innerText = '';
                }
            });
        } catch (error) {
            console.error('Error fetching Bitcoin price:', error);
            document.getElementById('btc-usd').innerText = 'Error fetching price';
        }
    }

    fetchBitcoinPriceAndUpdate();
});

function openSupportEmail() {
    const email = "your-email@example.com";
    window.open(`mailto:${email}`, '_system');
}

document.getElementById("support-btn").addEventListener("click", openSupportEmail);
