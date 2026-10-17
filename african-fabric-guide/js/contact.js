const contactForm = document.querySelector("#contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        if (!contactForm.checkValidity()) {
            event.preventDefault();
            contactForm.reportValidity();
        }
    });
}
=======

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        if (!contactForm.checkValidity()) {
            event.preventDefault();
            contactForm.reportValidity();
        }
    });
}
>>>>>>> 5bc01bd47c96e634361bc049a6f00632839908db
