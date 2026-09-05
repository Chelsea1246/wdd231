const currentYear = new Date().getFullYear();

document.querySelector("#current-year").textContent = currentYear;

document.querySelector("#lastModified").textContent =
    `Last Modification: ${document.lastModified}`;