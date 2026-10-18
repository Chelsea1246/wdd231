const fabricGrid = document.querySelector("#fabric-grid");
const fabricCount = document.querySelector("#fabric-count");
const fabricSearch = document.querySelector("#fabric-search");
const countryFilter = document.querySelector("#country-filter");
const favoritesFilter = document.querySelector("#favorites-filter");
const fabricError = document.querySelector("#fabric-error");

const fabricDialog = document.querySelector("#fabric-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogCountry = document.querySelector("#dialog-country");
const dialogType = document.querySelector("#dialog-type");
const dialogDescription = document.querySelector("#dialog-description");
const dialogClose = document.querySelector("#dialog-close");
const dialogFavorite = document.querySelector("#dialog-favorite");

// Store the fabric collection and selected fabric
let fabrics = [];
let selectedFabric = null;

// Load saved favorites from local storage
function loadFavorites() {
    try {
        const savedFavorites = JSON.parse(
            localStorage.getItem("african-fabric-favorites")
        );

        return Array.isArray(savedFavorites) ? savedFavorites : [];
    } catch (error) {
        console.error("Could not load favorites:", error);
        return [];
    }
}

let favoriteIds = loadFavorites();

// Save favorites in local storage
function saveFavorites() {
    try {
        localStorage.setItem(
            "african-fabric-favorites",
            JSON.stringify(favoriteIds)
        );
    } catch (error) {
        console.error("Could not save favorites:", error);
        alert("Your favorites could not be saved in this browser.");
    }
}

// Create the country filter options
function populateCountryFilter() {
    const countries = [...new Set(
        fabrics.map((fabric) => fabric.country)
    )].sort();

    countries.forEach((country) => {
        const option = document.createElement("option");
        option.value = country;
        option.textContent = country;
        countryFilter.appendChild(option);
    });
}

// Display fabric cards
function displayFabrics(items) {
    fabricGrid.innerHTML = "";

    fabricCount.textContent =
        `${items.length} ${items.length === 1 ? "fabric" : "fabrics"} found`;

    if (items.length === 0) {
        fabricGrid.innerHTML =
            "<p>No fabrics match your search. Try another search.</p>";
        return;
    }

    items.forEach((fabric) => {
        const isFavorite = favoriteIds.includes(fabric.id);

        const card = document.createElement("article");
        card.className = "fabric-card";

        card.innerHTML = `
            <div class="fabric-card-content">
                <p class="fabric-country">${fabric.country}</p>
                <h3>${fabric.name}</h3>
                <p><strong>Type:</strong> ${fabric.type}</p>
                <p>${fabric.description}</p>

                <div class="fabric-card-actions">
                    <button
                        class="details-button"
                        type="button"
                        data-action="details"
                        data-id="${fabric.id}">
                        View Details
                    </button>

                    <button
                        class="favorite-button"
                        type="button"
                        data-action="favorite"
                        data-id="${fabric.id}"
                        aria-pressed="${isFavorite}">
                        ${isFavorite ? "★ Saved" : "☆ Save"}
                    </button>
                </div>
            </div>
        `;

        fabricGrid.appendChild(card);
    });
}

// Search and filter the fabric collection
function filterFabrics() {
    const searchTerm = fabricSearch.value.trim().toLowerCase();
    const selectedCountry = countryFilter.value;
    const showFavorites = favoritesFilter.checked;

    const filteredFabrics = fabrics.filter((fabric) => {
        const matchesSearch = [
            fabric.name,
            fabric.country,
            fabric.type,
            fabric.description
        ].some((value) => value.toLowerCase().includes(searchTerm));

        const matchesCountry =
            selectedCountry === "all" ||
            fabric.country === selectedCountry;

        const matchesFavorites =
            !showFavorites || favoriteIds.includes(fabric.id);

        return matchesSearch && matchesCountry && matchesFavorites;
    });

    displayFabrics(filteredFabrics);
}

// Open the details dialog
function openFabricDetails(fabric) {
    selectedFabric = fabric;

    dialogTitle.textContent = fabric.name;
    dialogCountry.textContent = `Country or region: ${fabric.country}`;
    dialogType.textContent = `Fabric type: ${fabric.type}`;
    dialogDescription.textContent = fabric.description;

    updateDialogFavoriteButton();

    fabricDialog.showModal();
}

// Update the favorite button inside the dialog
function updateDialogFavoriteButton() {
    if (!selectedFabric) {
        return;
    }

    const isFavorite = favoriteIds.includes(selectedFabric.id);

    dialogFavorite.textContent = isFavorite
        ? "Remove from Favorites"
        : "Save to Favorites";
}

// Add or remove a favorite
function toggleFavorite(fabricId) {
    if (favoriteIds.includes(fabricId)) {
        favoriteIds = favoriteIds.filter((id) => id !== fabricId);
    } else {
        favoriteIds.push(fabricId);
    }

    saveFavorites();
    filterFabrics();
    updateDialogFavoriteButton();
}

// Handle clicks on fabric cards
fabricGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }

    const fabricId = Number(button.dataset.id);
    const fabric = fabrics.find((item) => item.id === fabricId);

    if (!fabric) {
        return;
    }

    if (button.dataset.action === "details") {
        openFabricDetails(fabric);
    }

    if (button.dataset.action === "favorite") {
        toggleFavorite(fabricId);
    }
});

// Handle search and filter changes
fabricSearch.addEventListener("input", filterFabrics);
countryFilter.addEventListener("change", filterFabrics);
favoritesFilter.addEventListener("change", filterFabrics);

// Close the dialog
dialogClose.addEventListener("click", () => {
    fabricDialog.close();
});

fabricDialog.addEventListener("click", (event) => {
    if (event.target === fabricDialog) {
        fabricDialog.close();
    }
});

// Handle favorites inside the dialog
dialogFavorite.addEventListener("click", () => {
    if (selectedFabric) {
        toggleFavorite(selectedFabric.id);
    }
});

// Fetch the JSON data
async function getFabrics() {
    try {
        const response = await fetch("data/fabrics.json");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        fabrics = await response.json();

        populateCountryFilter();
        displayFabrics(fabrics);
    } catch (error) {
        console.error("Error loading fabrics:", error);

        fabricCount.textContent = "Unable to load fabrics.";
        fabricError.hidden = false;
        fabricGrid.innerHTML = "";
    }
}

// Start the application
getFabrics();

