// ========================================
// AFRIWAY - MAIN JAVASCRIPT
// ========================================

let allSymbols = [];

document.addEventListener("DOMContentLoaded", () => {
    initializeScrollEffects();
    initializeFloatingSymbols();
    loadSymbols();
});


// ========================================
// CINEMATIC SCROLL EFFECT
// ========================================

function initializeScrollEffects() {
    const sections = document.querySelectorAll(".story-section");

    window.addEventListener("scroll", () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            const distanceFromCenter =
                scrollPosition + windowHeight / 2 - sectionTop;

            const progress = distanceFromCenter / sectionHeight;
            const limitedProgress = Math.max(-1, Math.min(1, progress));

            const image = section.querySelector(".story-image img");
            const text = section.querySelector(".story-text");

            if (image) {
                const scale = 1.05 + Math.abs(limitedProgress) * 0.08;
                const movement = limitedProgress * 35;

                image.style.transform =
                    `scale(${scale}) translateY(${movement}px)`;
            }

            if (text) {
                const movement = limitedProgress * -20;
                text.style.transform = `translateY(${movement}px)`;
            }
        });
    });
}


// ========================================
// FLOATING SYMBOL MOVEMENT
// ========================================

function initializeFloatingSymbols() {
    const symbols = document.querySelectorAll(
        ".floating-symbols .symbol"
    );

    window.addEventListener("scroll", () => {
        const scrollPosition = window.scrollY;

        symbols.forEach((symbol, index) => {
            const speed = 0.02 + (index % 5) * 0.01;
            const movement = scrollPosition * speed;

            symbol.style.transform = `translateY(${movement}px)`;
        });
    });
}


// ========================================
// LOAD AFRICAN COUNTRIES AND SYMBOLS
// FETCH API + ASYNC/AWAIT
// ========================================


async function loadSymbols() {
    const library = document.querySelector("#symbol-library");

    if (!library) {
        return;
    }

    try {
        const response = await fetch("data/symbols.json");

        if (!response.ok) {
            throw new Error(`Unable to load symbols: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("The symbols data must be an array.");
        }

        // Store all countries and sort them alphabetically.
        allSymbols = data.sort((a, b) =>
            (a.country || "").localeCompare(b.country || "")
        );

        // Display all countries.
        displaySymbols(allSymbols);

        // Activate search and category filters.
        initializeHeritageFilters();

        // Update the country count if the element exists.
        const count = document.querySelector("#symbol-count");
        if (count) {
            count.textContent = `${allSymbols.length} countries in the collection`;
        }
    } catch (error) {
        console.error("Error loading African symbols:", error);

        library.innerHTML = `
            <p class="error-message">
                We couldn't load the African heritage library.
                Please check your connection and try again.
            </p>
        `;
    }
}

// ========================================
// DISPLAY COUNTRY CARDS ALPHABETICALLY
// ========================================

function displaySymbols(symbols) {
    const library = document.querySelector("#symbol-library");

    if (!library) {
        return;
    }

    library.innerHTML = "";

    if (symbols.length === 0) {
        library.innerHTML = `
            <p class="no-results">
                No countries found. Try another search or category.
            </p>
        `;
        return;
    }

    const groupedSymbols = groupSymbolsByLetter(symbols);

    Object.keys(groupedSymbols)
        .sort()
        .forEach((letter) => {
            const letterSection = document.createElement("section");
            letterSection.classList.add("symbol-letter");

            letterSection.innerHTML = `
                <h3>${letter}</h3>
                <div class="symbol-grid"></div>
            `;

            const grid = letterSection.querySelector(".symbol-grid");

            groupedSymbols[letter].forEach((symbol, index) => {
                const card = document.createElement("article");
                card.classList.add("symbol-card");

                const number = String(index + 1).padStart(2, "0");

                card.innerHTML = `
                    <span class="symbol-number">${number}</span>

                    <div class="culture-symbol" aria-hidden="true">
                        ${getSymbolShape(index)}
                    </div>

                    <h4>${escapeHTML(symbol.country || "Unknown country")}</h4>

                    <p>${escapeHTML(symbol.tradition || "Cultural tradition")}</p>

                    <button
                        class="symbol-more"
                        type="button"
                        data-country="${escapeHTML(symbol.country || "")}"
                        aria-label="Learn more about ${escapeHTML(symbol.country || "this country")}"
                    >
                        EXPLORE →
                    </button>
                `;

                grid.appendChild(card);
            });

            library.appendChild(letterSection);
        });

    addSymbolModalEvents(symbols);
}


// ========================================
// GROUP COUNTRIES BY FIRST LETTER
// ========================================

function groupSymbolsByLetter(symbols) {
    return symbols.reduce((groups, symbol) => {
        const country = symbol.country || "";
        const letter = country.charAt(0).toUpperCase() || "#";

        if (!groups[letter]) {
            groups[letter] = [];
        }

        groups[letter].push(symbol);

        return groups;
    }, {});
}


// ========================================
// DECORATIVE SYMBOL SHAPES
// ========================================

function getSymbolShape(index) {
    const shapes = ["✦", "◇", "◆", "✧", "◈"];

    return shapes[index % shapes.length];
}


// ========================================
// COUNTRY SEARCH AND CATEGORY FILTER
// ========================================

function initializeHeritageFilters() {
    const searchInput = document.querySelector("#symbol-search");
    const categorySelect = document.querySelector("#symbol-type");

    if (!searchInput || !categorySelect) {
        console.error(
            "AfriWay: Check that #symbol-search and #symbol-type exist in index.html."
        );
        return;
    }

    function filterCountries() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const selectedCategory = categorySelect.value.trim().toLowerCase();

        const filteredSymbols = allSymbols.filter((symbol) => {
            const country = (symbol.country || "").toLowerCase();
            const tradition = (symbol.tradition || "").toLowerCase();
            const type = (symbol.type || "").toLowerCase();
            const meaning = (symbol.meaning || "").toLowerCase();

            // Search across country name and cultural information.
            const matchesSearch =
                country.includes(searchTerm) ||
                tradition.includes(searchTerm) ||
                type.includes(searchTerm) ||
                meaning.includes(searchTerm);

            // Match the selected category.
            const matchesCategory =
                selectedCategory === "" ||
                selectedCategory === "all" ||
                type === selectedCategory ||
                type.includes(selectedCategory) ||
                tradition.includes(selectedCategory);

            return matchesSearch && matchesCategory;
        });

        displaySymbols(filteredSymbols);
    }

    searchInput.addEventListener("input", filterCountries);
    categorySelect.addEventListener("change", filterCountries);
}


// ========================================
// COUNTRY EXPLORE BUTTON EVENTS
// ========================================

function addSymbolModalEvents(symbols) {
    const buttons = document.querySelectorAll(".symbol-more");

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const country = button.dataset.country;

            const selectedSymbol = symbols.find(
                (symbol) => symbol.country === country
            );

            if (selectedSymbol) {
                openSymbolModal(selectedSymbol);
            }
        });
    });
}


// ========================================
// CREATE ACCESSIBLE COUNTRY MODAL
// ========================================

function openSymbolModal(symbol) {
    const existingModal = document.querySelector(".symbol-modal");

    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement("dialog");
    modal.className = "symbol-modal";

    modal.innerHTML = `
        <div class="modal-content">
            <button
                class="modal-close"
                type="button"
                aria-label="Close ${escapeHTML(symbol.country)} information"
            >
                ×
            </button>

            <p class="eyebrow">AFRICAN HERITAGE</p>

            <h2>${escapeHTML(symbol.country || "")}</h2>

            <p class="modal-type">${escapeHTML(symbol.type || "Cultural heritage")}</p>

            <h3>${escapeHTML(symbol.tradition || "")}</h3>

            <p>${escapeHTML(symbol.meaning || "More cultural information coming soon.")}</p>
        </div>
    `;

    document.body.appendChild(modal);

    const closeButton = modal.querySelector(".modal-close");

    closeButton.addEventListener("click", () => {
        modal.close();
    });

    modal.addEventListener("click", (event) => {
        const content = modal.querySelector(".modal-content");
        const rectangle = content.getBoundingClientRect();

        const clickedInside =
            event.clientX >= rectangle.left &&
            event.clientX <= rectangle.right &&
            event.clientY >= rectangle.top &&
            event.clientY <= rectangle.bottom;

        if (!clickedInside) {
            modal.close();
        }
    });

    modal.addEventListener("close", () => {
        modal.remove();
    });

    modal.showModal();
    closeButton.focus();
}


// ========================================
// ESCAPE TEXT BEFORE ADDING IT TO HTML
// ========================================

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => {
        const characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return characters[character];
    });
}
