document.addEventListener("DOMContentLoaded", () => {
    initDisclaimerModal();
    initDynamicStats();
});

/* ==========================================================================
   1. Flight Sim Disclaimer Modal
   ========================================================================== */
function initDisclaimerModal() {
    const banner = document.getElementById("sim-disclaimer-modal");
    const acceptBtn = document.getElementById("accept-disclaimer-btn");

    if (!banner || !acceptBtn) return;

    const hasAcknowledged = localStorage.getItem("aloha_disclaimer_accepted");

    if (!hasAcknowledged) {
        setTimeout(() => {
            banner.classList.add("show");
        }, 500);
    }

    acceptBtn.addEventListener("click", () => {
        banner.classList.remove("show");
        localStorage.setItem("aloha_disclaimer_accepted", "true");
    });
}

/* ==========================================================================
   2. Randomized & Continuously Increasing Live Metrics
   ========================================================================== */
function initDynamicStats() {
    const flightCounter = document.getElementById("active-flights");
    const pilotCounter = document.getElementById("total-pilots");
    const hoursCounter = document.getElementById("hours-flown");

    // Random Initial Base Values
    // 1. Flights: 1 to 20
    let currentFlights = Math.floor(Math.random() * 20) + 1;

    // 2. Registered Pilots: Starts random between 85 and 130
    let currentPilots = Math.floor(Math.random() * 46) + 85;

    // 3. Hours Logged: Starts random between 4,100 and 5,400
    let currentHours = Math.floor(Math.random() * 1301) + 4100;

    // Initial smooth rollout animation on page entry
    if (flightCounter) animateValue(flightCounter, 0, currentFlights, 1000);
    if (pilotCounter)  animateValue(pilotCounter, currentPilots - 30, currentPilots, 1400);
    if (hoursCounter)  animateValue(hoursCounter, currentHours - 200, currentHours, 1800);

    // --- Live Network Updates ---

    // A. Active Flights: Keep fluctuating strictly between 1 and 20
    if (flightCounter) {
        setInterval(() => {
            // Shift by -2, -1, +1, or +2
            const change = (Math.floor(Math.random() * 3) + 1) * (Math.random() > 0.48 ? 1 : -1);
            currentFlights = Math.min(20, Math.max(1, currentFlights + change));

            flightCounter.style.opacity = "0.3";
            setTimeout(() => {
                flightCounter.textContent = currentFlights;
                flightCounter.style.opacity = "1";
            }, 300);
        }, 7000);
    }

    // B. Registered Pilots: Only increases over time
    if (pilotCounter) {
        setInterval(() => {
            // Occasional new pilot joins (50% chance every 15s)
            if (Math.random() > 0.5) {
                currentPilots += 1;
                pilotCounter.style.opacity = "0.4";
                setTimeout(() => {
                    pilotCounter.textContent = currentPilots.toLocaleString();
                    pilotCounter.style.opacity = "1";
                }, 300);
            }
        }, 15000);
    }

    // C. Hours Flown: Constantly increases above the initial number
    if (hoursCounter) {
        setInterval(() => {
            // Add 1 to 4 hours logged across the virtual fleet
            const addedHours = Math.floor(Math.random() * 4) + 1;
            const previousHours = currentHours;
            currentHours += addedHours;
            
            animateValue(hoursCounter, previousHours, currentHours, 600);
        }, 9000);
    }
}

/* ==========================================================================
   3. Number Counting Animation Helper
   ========================================================================== */
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const easeOutQuad = (t) => t * (2 - t);

    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const rawProgress = Math.min((timestamp - startTimestamp) / duration, 1);
        const progress = easeOutQuad(rawProgress);

        const currentVal = Math.floor(progress * (end - start) + start);
        element.textContent = currentVal.toLocaleString();

        if (rawProgress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.textContent = end.toLocaleString();
        }
    };

    window.requestAnimationFrame(step);
}