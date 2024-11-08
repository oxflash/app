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

    const hashedKey = '93083d06c2eb738735bab10351a6ba89';  // Hashed version of "password"

    if (hashedEnteredKey === hashedKey) {
        window.location.href = "key.html";  // Redirect to the main page on success
    } else {
        document.getElementById('auth-error').innerText = "Invalid authentication key.";
        hideLoading();  // Hide loading if authentication fails
        setTimeout(() => {
            document.getElementById('auth-error').innerText = " ";
        }, 5000);  // 5000 milliseconds = 5 seconds
    }
});


function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

async function generateInvoice() {
    const erroh = document.getElementById('err');
    showLoading();

    try {
        const response = await fetch('https://api.nowpayments.io/v1/invoice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'SYZVG7V-WKXM69C-NZH8H2Q-6SBVA5H',
            },
            body: JSON.stringify({
                price_amount: 55.00,
                price_currency: 'USD',
                pay_currency: 'usdttrc20',
                order_id: 'auth-key-052',
                order_description: 'Purchase Authentication Key',
                ipn_callback_url: 'https://yourwebsite.com/ipn',
                success_url: 'https://t.me/Ox_flashbot',
                cancel_url: 'https://t.me/Ox_flashbot',
            })
        });

        const data = await response.json();

        if (response.ok && data.invoice_url) {
            hideLoading();
            if (isIOS()) {
                // Try to open the URL directly
                const opened = window.open(data.invoice_url, '_blank');
                if (!opened) {
                    // Fallback: Show prompt to copy link if blocked
                    promptUserToCopyLink(data.invoice_url);
                }
            } else {
                // For other devices, open in a new tab
                window.open(data.invoice_url, '_blank');
            }
        } else {
            showError('Unable to access payment page, Try Again');
        }
    } catch (error) {
        console.error('Error generating invoice:', error);
        showError('Unable to access payment page, Try Again');
    }
}

// Fallback function to prompt the user to copy the link manually
function promptUserToCopyLink(url) {
    const erroh = document.getElementById('err');
    erroh.innerHTML = `Unable to open the payment page. Please <a href="${url}" target="_blank">click here</a> or copy this link: ${url}`;
    setTimeout(() => {
        erroh.innerText = "";
    }, 10000); // Show the link for 10 seconds
}

function showError(message) {
    const erroh = document.getElementById('err');
    hideLoading();
    erroh.innerText = message;
    setTimeout(() => {
        erroh.innerText = "";
    }, 5000);
}




// Ensure loading is hidden on page load
window.onload = function() {
    hideLoading();  // Hide loading when the page is ready
};

// Event listener for purchase button on purchase page
document.getElementById("purchase-btn")?.addEventListener("click", generateInvoice);
// Go back to the previous page
function goBack() {
    window.history.back();
}

function copyEmail() {
    const msg = document.getElementById('clipmsg');
    
    navigator.clipboard.writeText("your-email@example.com")
        .then(() => {
            msg.innerText = 'Email copied to clipboard!';
        })
        .catch(() => {
            msg.innerText = 'Unable to copy email, please try again.';
        });

    // Clear the message after 5 seconds
    setTimeout(() => {
        msg.innerText = "";
    }, 5000);
}
