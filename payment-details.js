// Show loading animation
function showLoading() {
    document.querySelector('.loading-overlay').style.display = 'flex';
}

// Hide loading animation
function hideLoading() {
    document.querySelector('.loading-overlay').style.display = 'none';
}

// Fetch payment details from NowPayments API
async function fetchPaymentDetails() {
    const paymentInfoContainer = document.getElementById('payment-info');
    const qrCodeContainer = document.getElementById('qr-code');
    const email = sessionStorage.getItem('buyerEmail'); // Retrieve the stored email

    if (!email) {
        paymentInfoContainer.innerHTML = '<p>Error: Email not found. Please go back and try again.</p>';
        return;
    }

    showLoading();

    try {
        const response = await fetch('https://api.nowpayments.io/v1/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': '60M0R60-4MF4W6B-MHY4YJT-VK9EV3V', // Replace with your actual API key
            },
            body: JSON.stringify({
                price_amount: 100.0,
                price_currency: 'USD',
                pay_currency: 'usdttrc20',
                payout_address: '47CFSGdyZ2GJZvTKaUSqLsDrW9rV2yJqs4ZQd6cVp9UkaxmofzDnpvM8NniApZY6af2k443Dib8ZjMUvS3QAzcA1V7sdvDe',
                payout_currency: 'xmr',
                order_id: `auth-key-${Date.now()}`,
                order_description: 'Purchase Authentication Key',
            }),
        });

        const data = await response.json();

        if (response.ok && data) {
            const { pay_address, pay_amount, pay_currency } = data;

            // Display payment details
            paymentInfoContainer.innerHTML = `
                <p><strong>Payment Address:</strong> ${pay_address}</p>
                <p><strong>Amount:</strong> ${pay_amount} </p>
                <p><strong>Network: </strong>USDT TRC20</p>
                <p>Please complete the payment using the QR code below</p>
                <p>Stay on screen till payment is complete</p>
            `;

            // Generate QR code using the QRServer API
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                pay_address
            )}`;
            qrCodeContainer.innerHTML = `<img src="${qrCodeUrl}" alt="QR Code"> <p>Stay on screen till payment is complete</p>`;
        } else {
            paymentInfoContainer.innerHTML = '<p>Failed to generate payment details. Please try again later.</p>';
        }
    } catch (error) {
        console.error('Error fetching payment details:', error);
        paymentInfoContainer.innerHTML = '<p>An error occurred while fetching payment details. Please try again later.</p>';
    } finally {
        hideLoading();
    }
}

// Go back to the previous page
function goBack() {
    window.history.back();
}

// Call fetchPaymentDetails on page load
window.onload = fetchPaymentDetails;
