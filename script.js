document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const unbanForm = document.getElementById("unbanForm");
    const progressContainer = document.getElementById("progressContainer");
    const progressBar = document.getElementById("progressBar");
    const progressMessage = document.getElementById("progressMessage");
    const percentageText = document.getElementById("percentage");
    const popupModal = document.getElementById("popupModal");
    const popupProgressBar = document.getElementById("popupProgressBar");
    const popupPercentage = document.getElementById("popupPercentage");
    const popupOverlay = document.getElementById("popupOverlay");
    const timerModal = document.getElementById("timerModal");
    const timerProgressBar = document.getElementById("timerProgressBar");
    const timerText = document.getElementById("timerText");
    const successModal = document.getElementById("successModal");
    const generateNewCodeButton = document.getElementById("unbanNewIdButton");
    const container = document.querySelector(".container");

    const copyCodeButton = document.getElementById("copyCodeButton");
    const redeemCode = document.getElementById("redeemCode");

    let isCodeGenerated = false;
    let timerInterval;

    // Form submission logic
    unbanForm.addEventListener("submit", function (e) {
        e.preventDefault();

        if (isCodeGenerated) {
            alert("You have already generated a code. Wait for the timer to reset.");
            return;
        }

        progressContainer.style.display = "block";
        let progress = 0;

        const messages = [
            "Connecting to server...",
            "Generating Redeem Code...",
            "Getting Redeem Code Now...",
            "Process completed!"
        ];

        const interval = setInterval(() => {
            progress += 1;
            progressBar.style.width = `${progress}%`;
            percentageText.textContent = `${progress}%`;

            if (progress <= 25) {
                progressMessage.textContent = messages[0];
            } else if (progress <= 50) {
                progressMessage.textContent = messages[1];
            } else if (progress <= 75) {
                progressMessage.textContent = messages[2];
            }

            if (progress === 90) {
                clearInterval(interval);

                // Show popup
                progressContainer.style.display = "none";
                popupModal.style.display = "flex";
                popupOverlay.style.display = "block";

                // Update popup progress bar
                popupProgressBar.style.width = `${progress}%`;
                popupPercentage.textContent = `${progress}%`;
            }
        }, 300);
    });

    // "Download Now" button logic
    document.getElementById("downloadButton").addEventListener("click", function () {
        popupModal.style.display = "none";
        timerModal.style.display = "flex";

        let duration = 30; // 30 seconds
        let progress = 0;

        // Reset progress bar
        timerProgressBar.style.width = "0%";

        const timerInterval = setInterval(() => {
            progress += (100 / 30); // Increment progress
            timerProgressBar.style.width = `${progress}%`;
            duration -= 1;
            timerText.textContent = `${duration} seconds remaining...`;

            if (duration <= 0) {
                clearInterval(timerInterval);

                // Show success modal
                timerModal.style.display = "none";
                successModal.style.display = "flex";
                isCodeGenerated = true;
            }
        }, 1000);
    });

    // Copy code to clipboard logic
    copyCodeButton.addEventListener("click", () => {
        const codeText = redeemCode.textContent; // Get the text of the redeem code
        navigator.clipboard.writeText(codeText) // Copy the text to the clipboard
            .then(() => {
                alert("Redeem code copied to clipboard!");
            })
            .catch(err => {
                console.error("Failed to copy text: ", err);
                alert("Failed to copy code. Please try again.");
            });
    });

    // "Unban New ID" button logic in the success modal
    generateNewCodeButton.addEventListener("click", () => {
        successModal.style.display = "none";
        isCodeGenerated = true;
        start24HourTimer();
    });

    // 24-hour timer logic
    function start24HourTimer() {
        container.innerHTML = `
            <div class="timer-message">
                <h2>You have already generated a code today!</h2>
                <p>You can generate a new code after the timer ends:</p>
                <div id="timerDisplay" style="font-size: 2em; color: red;"></div>
            </div>
        `;

        const timerDisplay = document.getElementById("timerDisplay");
        const endTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours from now

        timerInterval = setInterval(() => {
            const now = new Date().getTime();
            const timeLeft = endTime - now;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerDisplay.textContent = "You can now generate a new code!";
                isCodeGenerated = false; // Reset for a new attempt
            } else {
                const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

                timerDisplay.textContent = `${hours}h ${minutes}m ${seconds}s`;
            }
        }, 1000);
    }
});
