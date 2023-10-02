
function showSuccessToast(message) {
    Toastify({
        text: message,
        duration: 3000, // Display for 3 seconds
        gravity: "top", // Top or bottom
        position: "left", // Left, center, or right
        stopOnFocus: true, // Prevent dismissing on hover
        onClick: function() {} // Callback after click
    }).showToast();
}

function showErrorToast(message) {
    Toastify({
        text: message,
        duration: 3000, // Display for 3 seconds
        gravity: "top", // Top or bottom
        position: "left", // Left, center, or right
        stopOnFocus: true, // Prevent dismissing on hover
        onClick: function() {} // Callback after click
    }).showToast();
}
