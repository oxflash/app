// Show loading animation (only when triggered)
function showLoading() {
    document.querySelector('.loading-overlay').style.display = 'flex';
}

// Hide loading animation (initially hidden)
function hideLoading() {
    document.querySelector('.loading-overlay').style.display = 'none';
}

// Authentication Logic for index.html
document.getElementById("authForm")?.addEventListener("submit", function(event) {
    event.preventDefault();
    showLoading();  // Show loading while processing

    const enteredKey = document.getElementById('auth-key').value.trim();  // Trim whitespace
    const hashedEnteredKey = CryptoJS.MD5(enteredKey).toString();  // Hash the entered key

    const hashedKey = 'b0a9e43e1efcf426f7bd1246d2df3413';  // Hashed version of "password"

    if (hashedEnteredKey === hashedKey) {
        window.location.href = "main.html";  // Redirect to the main page on success
    } else {
        document.getElementById('auth-error').innerText = "Invalid authentication key.";
        hideLoading();  // Hide loading if authentication fails
        setTimeout(() => {
            document.getElementById('auth-error').innerText = " ";
        }, 5000);  // 5000 milliseconds = 5 seconds
    }
});

// Function to generate an invoice for purchase page
async function generateInvoice() {
    document.getElementsByClassName('purchase-page');
    const erroh = document.getElementById('err')
    showLoading();  // Show loading animation

    try {
        const response = await fetch('https://api.nowpayments.io/v1/invoice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'SYZVG7V-WKXM69C-NZH8H2Q-6SBVA5H',  // Replace with your NOWPayments API Key
            },
            body: JSON.stringify({
                price_amount: 100.00,  // Amount in USD
                price_currency: 'USD',  // Currency to charge
                pay_currency: 'btc',  // Payment currency (e.g., BTC)
                order_id: 'auth-key-123',  // Unique order ID, can be customized
                order_description: 'Purchase Authentication Key',
                ipn_callback_url: 'https://yourwebsite.com/ipn',  // Optional: IPN callback URL for payment updates
                success_url: 'https://yourwebsite.com/success',  // Redirect after successful payment
                cancel_url: 'https://yourwebsite.com/cancel',  // Redirect if payment is canceled
                is_fee_paid_by_user:'true',
            })
        });

        const data = await response.json();

        if (response.ok && data.invoice_url) {
            hideLoading();  // Hide loading spinner
            window.location.href = data.invoice_url;  // Redirect user to NOWPayments invoice page
        } else {
            hideLoading();  // Stop loading spinner
            erroh.innerText = 'Unable to access payment page, Try Again'
            setTimeout(() => {
                erroh.innerText = " ";
            }, 5000);  // 5000 milliseconds = 5 seconds
            //alert('Failed to generate invoice. Please try again.');
        }
    } catch (error) {
        hideLoading();  // Ensure loading stops in case of error
        console.error('Error generating invoice:', error);
        erroh.innerText = 'Unable to access payment page, Try Again'
        setTimeout(() => {
            erroh.innerText = " ";
        }, 5000);  // 5000 milliseconds = 5 seconds
        //alert('Error generating invoice. Please try again.');
    }
}

// Ensure loading is hidden on page load
window.onload = function() {
    hideLoading();  // Hide loading when the page is ready
};

// Event listener for purchase button on purchase page
document.getElementById("purchase-btn")?.addEventListener("click", generateInvoice);
