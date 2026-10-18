
const confirmationMessage = document.querySelector("#confirmation-message");

if (confirmationMessage) {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");

    if (name) {
        confirmationMessage.textContent =
            `Thank you, ${name}! Your form has been submitted successfully.`;
    }
}
