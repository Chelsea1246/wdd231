
/* ========================================
   AFRIWAY — MAIN JAVASCRIPT
   Author: Chelsea Afriyie Opoku
   ======================================== */

"use strict";

let allSymbols = [];
let activeSymbols = [];
let modalElement = null;

/* ========================================
   INITIALIZE THE WEBSITE
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
    initializeScrollEffects();
    initializeFloatingSymbols();
    loadSymbols();
});

/* ========================================
   SCROLL EFFECTS
   ======================================== */

function initializeScrollEffects() {
    const sections = document.querySelectorAll(".story-section");

    if (!sections.length) {
        return;
    }

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
        return;
    }

    let ticking = false;

    function updateSections() {
        const windowHeight = window.innerHeight;

        sections.forEach((section) => {
            const rectangle = section.getBoundingClientRect();
            const distanceFromCenter =
                windowHeight / 2 -
                (rectangle.top + rectangle.height / 2);

            const progress = Math.max(
                -1,
                Math.min(1, distanceFromCenter / windowHeight)
            );

            const image = section.querySelector(".story-image img");
            const text = section.querySelector(".story-text");

            if (image) {
                const scale = 1.04 + Math.abs(progress) * 0.04;
                const movement = progress * 15;

                image.style.transform =
                    `scale(${scale}) translateY(${movement}px)`;
            }

            if (text) {
                text.style.transform =
                    `translateY(${progress * -10}px)`;
            }
        });

        ticking = false;
    }

    window.addEventListener(
        "scroll",
        () => {
            if (!ticking) {
                window.requestAnimationFrame(updateSections);
                ticking = true;
            }
        },
        { passive: true }
    );

    updateSections();
}

/* ========================================
   FLOATING AFRICAN-INSPIRED SYMBOLS
   ======================================== */

function initializeFloatingSymbols() {
    const symbols = document.querySelectorAll(
        ".floating-symbols .symbol"
    );

    if (!symbols.length) {
        return;
    }

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
        return;
    }

    let ticking = false;

    function updateSymbols() {
        const scrollPosition = window.scrollY;

        symbols.forEach((symbol, index) => {
            const speed = 0.015 + (index % 5) * 0.008;
            const movement = scrollPosition * speed;

            symbol.style.transform = `translateY(${movement}px)`;
        });

        ticking = false;
    }

    window.addEventListener(
        "scroll",
        () => {
            if (!ticking) {
                window.requestAnimationFrame(updateSymbols);
                ticking = true;
            }
        },
        { passive: true }
    );
}

/* ========================================
   LOAD THE AFRICAN HERITAGE DATA
   ======================================== */

async function loadSymbols() {
    const library = document.querySelector("#symbol-library");

    if (!library) {
        return;
    }

    library.setAttribute("aria-busy", "true");

    try {
        const response = await fetch("data/symbols.json");

        if (!response.ok) {
            throw new Error(
                `Unable to load symbols: HTTP ${response.status}`
            );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error(
                "The symbols data must be an array."
            );
        }

        allSymbols = data
            .filter((symbol) => symbol && symbol.country)
            .sort((a, b) =>
                a.country.localeCompare(b.country)
            );

        activeSymbols = [...allSymbols];

        displaySymbols(activeSymbols);
        initializeHeritageFilters();
        updateCountryCount(activeSymbols.length);

    } catch (error) {
        console.error(
            "AfriWay heritage library error:",
            error
        );

        library.innerHTML = `
            <div class="error-message" role="alert">
                <h3>Our heritage library could not load.</h3>
                <p>
                    Please check your connection and try again.
                    If you are opening this page directly from your
                    computer, run it through a local development server.
                </p>
                <button
                    class="button"
                    id="retry-symbols"
                    type="button"
                >
                    Try again
                </button>
            </div>
        `;

        const retryButton = document.querySelector("#retry-symbols");

        if (retryButton) {
            retryButton.addEventListener("click", loadSymbols);
        }

    } finally {
        library.setAttribute("aria-busy", "false");
    }
}

/* ========================================
   UPDATE THE COUNTRY COUNT
   ======================================== */

function updateCountryCount(count) {
    const countElement = document.querySelector("#symbol-count");
    const statusElement = document.querySelector("#discovery-status");

    const message = `${count} ${
        count === 1 ? "country" : "countries"
    } in the collection`;

    if (countElement) {
        countElement.textContent = message;
    }

    if (statusElement) {
        statusElement.textContent = message;
    }
}

/* ========================================
   DISPLAY COUNTRY CARDS
   ======================================== */

function displaySymbols(symbols) {
    const library = document.querySelector("#symbol-library");

    if (!library) {
        return;
    }

    library.innerHTML = "";

    if (symbols.length === 0) {
        library.innerHTML = `
            <div class="no-results">
                <h3>No countries found</h3>
                <p>
                    Try another search term or choose a different category.
                </p>
            </div>
        `;

        updateCountryCount(0);
        return;
    }

    const groupedSymbols = groupSymbolsByLetter(symbols);

    Object.keys(groupedSymbols)
        .sort()
        .forEach((letter) => {
            const letterSection = document.createElement("section");
            letterSection.className = "symbol-letter";
            letterSection.setAttribute(
                "aria-label",
                `Countries beginning with ${letter}`
            );

            const heading = document.createElement("h3");
            heading.textContent = letter;

            const grid = document.createElement("div");
            grid.className = "symbol-grid";

            groupedSymbols[letter].forEach((symbol, index) => {
                const country = symbol.country || "Unknown country";
                const card = document.createElement("article");

                card.className = "symbol-card";

                const number = String(index + 1).padStart(2, "0");

                const numberElement = document.createElement("span");
                numberElement.className = "symbol-number";
                numberElement.textContent = number;
                numberElement.setAttribute("aria-hidden", "true");

                const decoration = document.createElement("div");
                decoration.className = "culture-symbol";
                decoration.setAttribute("aria-hidden", "true");
                decoration.textContent = getSymbolShape(index);

                const title = document.createElement("h4");
                title.textContent = country;

                const tradition = document.createElement("p");
                tradition.textContent =
                    symbol.tradition || "Cultural heritage";

                const exploreButton = document.createElement("button");
                exploreButton.className = "symbol-more";
                exploreButton.type = "button";
                exploreButton.textContent = "EXPLORE →";
                exploreButton.setAttribute(
                    "aria-label",
                    `Explore the cultural heritage of ${country}`
                );

                exploreButton.addEventListener("click", () => {
                    openSymbolModal(symbol);
                });

                card.append(
                    numberElement,
                    decoration,
                    title,
                    tradition,
                    exploreButton
                );

                grid.appendChild(card);
            });

            letterSection.append(heading, grid);
            library.appendChild(letterSection);
        });

    updateCountryCount(symbols.length);
}

/* ========================================
   GROUP COUNTRIES ALPHABETICALLY
   ======================================== */

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

/* ========================================
   CSS-FRIENDLY DECORATIVE SYMBOLS
   ======================================== */

function getSymbolShape(index) {
    const shapes = [
        "✦",
        "◇",
        "◆",
        "✧",
        "◈",
        "✺",
        "⬡",
        "✳",
        "❋",
        "✣"
    ];

    return shapes[index % shapes.length];
}

/* ========================================
   SEARCH AND CATEGORY FILTERS
   ======================================== */

function initializeHeritageFilters() {
    const searchInput = document.querySelector("#symbol-search");
    const categorySelect = document.querySelector("#symbol-type");

    if (!searchInput || !categorySelect) {
        console.warn(
            "AfriWay: Search controls were not found. " +
            "Check for #symbol-search and #symbol-type in index.html."
        );
        return;
    }

    function filterCountries() {
        const searchTerm = searchInput.value
            .trim()
            .toLowerCase();

        const selectedCategory = categorySelect.value
            .trim()
            .toLowerCase();

        activeSymbols = allSymbols.filter((symbol) => {
            const country = (symbol.country || "").toLowerCase();
            const tradition = (symbol.tradition || "").toLowerCase();
            const type = (symbol.type || "").toLowerCase();
            const meaning = (symbol.meaning || "").toLowerCase();

            const matchesSearch =
                country.includes(searchTerm) ||
                tradition.includes(searchTerm) ||
                type.includes(searchTerm) ||
                meaning.includes(searchTerm);

            const matchesCategory =
                selectedCategory === "" ||
                selectedCategory === "all" ||
                type === selectedCategory ||
                type.includes(selectedCategory) ||
                tradition.includes(selectedCategory);

            return matchesSearch && matchesCategory;
        });

        displaySymbols(activeSymbols);
    }

    searchInput.addEventListener("input", filterCountries);
    categorySelect.addEventListener("change", filterCountries);
}

/* ========================================
   COUNTRY EXPLORE DIALOG
   ======================================== */

function openSymbolModal(symbol) {
    if (modalElement && modalElement.isConnected) {
        modalElement.close();
        modalElement.remove();
    }

    const country = symbol.country || "African heritage";

    const modal = document.createElement("dialog");
    modal.className = "symbol-modal";
    modal.setAttribute(
        "aria-label",
        `${country} cultural heritage`
    );

    const content = document.createElement("div");
    content.className = "modal-content";

    const closeButton = document.createElement("button");
    closeButton.className = "modal-close";
    closeButton.type = "button";
    closeButton.textContent = "×";
    closeButton.setAttribute("aria-label", "Close dialog");

    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = "AFRICAN HERITAGE";

    const heading = document.createElement("h2");
    heading.textContent = country;

    const type = document.createElement("p");
    type.className = "modal-type";
    type.textContent = symbol.type || "Cultural heritage";

    const traditionHeading = document.createElement("h3");
    traditionHeading.textContent =
        symbol.tradition || "Cultural tradition";

    const meaning = document.createElement("p");
    meaning.textContent =
        symbol.meaning ||
        "More information about this tradition is coming soon.";

    content.append(
        closeButton,
        eyebrow,
        heading,
        type,
        traditionHeading,
        meaning
    );

    modal.appendChild(content);
    document.body.appendChild(modal);

    modalElement = modal;

    closeButton.addEventListener("click", () => {
        modal.close();
    });

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.close();
        }
    });

    modal.addEventListener("close", () => {
        modal.remove();

        if (modalElement === modal) {
            modalElement = null;
        }
    });

    modal.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            modal.close();
        }
    });

    modal.showModal();
    closeButton.focus();
}
