
const contactForm = document.querySelector("#contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        if (!contactForm.checkValidity()) {
            event.preventDefault();
            contactForm.reportValidity();
        }
    });
}
