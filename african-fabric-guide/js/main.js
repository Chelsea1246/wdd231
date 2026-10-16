<<<<<<< HEAD

// Mobile navigation menu
const menuToggle = document.querySelector("#menu-toggle");
const primaryNavigation = document.querySelector("#primary-navigation");

if (menuToggle && primaryNavigation) {
    menuToggle.addEventListener("click", () => {
        const isExpanded =
            menuToggle.getAttribute("aria-expanded") === "true";

        menuToggle.setAttribute("aria-expanded", String(!isExpanded));

        menuToggle.setAttribute(
            "aria-label",
            isExpanded ? "Open navigation menu" : "Close navigation menu"
        );

        primaryNavigation.classList.toggle("open");
    });
}

// Automatically display the current year
const currentYear = document.querySelector("#current-year");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}
=======

// Mobile navigation menu
const menuToggle = document.querySelector("#menu-toggle");
const primaryNavigation = document.querySelector("#primary-navigation");

if (menuToggle && primaryNavigation) {
    menuToggle.addEventListener("click", () => {
        const isExpanded =
            menuToggle.getAttribute("aria-expanded") === "true";

        menuToggle.setAttribute("aria-expanded", String(!isExpanded));

        menuToggle.setAttribute(
            "aria-label",
            isExpanded ? "Open navigation menu" : "Close navigation menu"
        );

        primaryNavigation.classList.toggle("open");
    });
}

// Automatically display the current year
const currentYear = document.querySelector("#current-year");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}
>>>>>>> 5bc01bd47c96e634361bc049a6f00632839908db
