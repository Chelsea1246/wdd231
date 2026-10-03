import places from "../data/discover.mjs";

const discoverGrid = document.querySelector("#discover-grid");
const visitMessage = document.querySelector("#visit-message");

function displayPlaces() {
    places.forEach((place, index) => {
        const card = document.createElement("article");

        card.classList.add("discover-card");
        card.classList.add(`card-${index + 1}`);

        card.innerHTML = `
            <h2>${place.name}</h2>

            <figure>
                <img
                    src="${place.image}"
                    alt="${place.name}"
                    loading="lazy"
                    width="300"
                    height="200"
                >
            </figure>

            <address>${place.address}</address>

            <p>${place.description}</p>

            <button type="button">Learn More</button>
        `;

        discoverGrid.appendChild(card);
    });
}

function displayVisitMessage() {
    const currentVisit = Date.now();
    const lastVisit = localStorage.getItem("lastVisit");

    if (!lastVisit) {
        visitMessage.textContent =
            "Welcome! Let us know if you have any questions.";
    } else {
        const timeDifference = currentVisit - Number(lastVisit);

        const millisecondsPerDay = 1000 * 60 * 60 * 24;

        const daysBetween = Math.floor(
            timeDifference / millisecondsPerDay
        );

        if (daysBetween < 1) {
            visitMessage.textContent =
                "Back so soon! Awesome!";
        } else {
            const dayWord = daysBetween === 1 ? "day" : "days";

            visitMessage.textContent =
                `You last visited ${daysBetween} ${dayWord} ago.`;
        }
    }

    localStorage.setItem("lastVisit", currentVisit);
}

displayPlaces();
displayVisitMessage();