document.addEventListener("DOMContentLoaded", function() {
    const logoutForm = document.getElementById("logout-form");

    logoutForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        try {
            const response = await fetch("/logout", {
                method: "POST"
            });

            if (!response.ok) {
                throw new Error("Logout failed");
            }

            // Redirect to login page after successful logout
            window.location.href = "/";
        } catch (error) {
            console.error("Error during logout:", error.message);
            // Handle logout failure if needed
        }
    });
});
