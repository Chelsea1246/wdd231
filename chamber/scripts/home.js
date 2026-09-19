const apiKey = "9c8d6408d42c3a218b3c00ca42a977eb";
const city = "Accra";
const country = "GH";

async function getWeather() {
    try {
        // Current weather
        const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=${apiKey}`;

        // 5-day forecast
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&units=metric&appid=${apiKey}`;

        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentUrl),
            fetch(forecastUrl)
        ]);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error("Weather data could not be retrieved.");
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        displayCurrentWeather(currentData);
        displayForecast(forecastData);

    } catch (error) {
        console.error("Weather error:", error);

        document.querySelector("#weather-description").textContent =
            "Weather information is currently unavailable.";
    }
}


function displayCurrentWeather(data) {
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;

    document.querySelector("#current-temperature").textContent =
        `${temperature}°C`;

    document.querySelector("#weather-description").textContent =
        description;
}


function displayForecast(data) {
    const forecastContainer = document.querySelector("#forecast-container");

    forecastContainer.innerHTML = "";

    // Get one forecast for each of the next 3 days
    const dailyForecasts = [];
    const dates = new Set();

    for (const forecast of data.list) {
        const date = new Date(forecast.dt * 1000);
        const dateString = date.toLocaleDateString();

        if (!dates.has(dateString)) {
            dates.add(dateString);
            dailyForecasts.push(forecast);
        }

        if (dailyForecasts.length === 3) {
            break;
        }
    }

    dailyForecasts.forEach((forecast) => {
        const date = new Date(forecast.dt * 1000);

        const dayName = date.toLocaleDateString("en-US", {
            weekday: "long"
        });

        const temperature = Math.round(forecast.main.temp);

        const description = forecast.weather[0].description;

        const forecastCard = document.createElement("div");

        forecastCard.classList.add("forecast-day");

        forecastCard.innerHTML = `
            <h4>${dayName}</h4>
            <p>${temperature}°C</p>
            <p>${description}</p>
        `;

        forecastContainer.appendChild(forecastCard);
    });
}


getWeather();

async function loadSpotlights() {
    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error("Could not load member data.");
        }

        const data = await response.json();

        // Only Gold (3) and Silver (2) members
        const qualifiedMembers = data.members.filter(
            member => member.membershipLevel === 2 ||
                      member.membershipLevel === 3
        );

        // Randomize the qualified members
        const shuffledMembers = qualifiedMembers.sort(
            () => Math.random() - 0.5
        );

        // Select 3 members
        const selectedMembers = shuffledMembers.slice(0, 3);

        displaySpotlights(selectedMembers);

    } catch (error) {
        console.error("Spotlight error:", error);

        document.querySelector("#spotlight-container").innerHTML =
            "<p>Business spotlights are currently unavailable.</p>";
    }
}


function displaySpotlights(members) {
    const container = document.querySelector("#spotlight-container");

    container.innerHTML = "";

    members.forEach(member => {
        const card = document.createElement("article");

        card.classList.add("spotlight-card");

        const membership =
            member.membershipLevel === 3 ? "Gold Member" : "Silver Member";

        card.innerHTML = `
            <img src="images/${member.image}" alt="${member.name} logo">
            <h3>${member.name}</h3>
            <p><strong>${membership}</strong></p>
            <p>${member.address}</p>
            <p>${member.phone}</p>
            <p>
                <a href="${member.website}" target="_blank">
                    Visit Website
                </a>
            </p>
        `;

        container.appendChild(card);
    });
}


loadSpotlights();