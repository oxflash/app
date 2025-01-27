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
    showLoading(); // Show loading while processing

    const enteredKey = document.getElementById('auth-key').value.trim(); // Trim whitespace
    const hashedEnteredKey = CryptoJS.MD5(enteredKey).toString(); // Hash the entered key

    const userHashedKey = '38bd0064664e78ad08eef1cb48e65db9'; // Hashed version of user key
    const adminHashedKey = 'ec28e2ed89712b58755c78c711677e2f'; // Hashed version of admin key

    if (hashedEnteredKey === userHashedKey) {
        window.location.href = "key.html"; // Redirect to user page
    } else if (hashedEnteredKey === adminHashedKey) {
        window.location.href = "main.html"; // Redirect to admin page
    } else {
        document.getElementById('auth-error').innerText = "Invalid authentication key.";
        hideLoading(); // Hide loading if authentication fails
        setTimeout(() => {
            document.getElementById('auth-error').innerText = " ";
        }, 5000); // 5 seconds
    }
});

function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// Redirect to payment details page and store email in session storage
document.getElementById("purchase-btn")?.addEventListener("click", function () {
    const email = document.getElementById('email')?.value.trim(); // Get user email
    const erroh = document.getElementById('err');

    if (!email) {
        erroh.textContent = "Please enter your email.";
        return;
    }

    // Store the email in session storage and redirect to the payment details page
    sessionStorage.setItem('buyerEmail', email);
    window.location.href = 'payment-details.html';
});

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
    hideLoading(); // Hide loading when the page is ready
};

// Go back to the previous page
function goBack() {
    window.history.back();
}

// Copy email to clipboard
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
