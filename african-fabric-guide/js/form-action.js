
const params = new URLSearchParams(window.location.search);

const responseHeading = document.querySelector("#response-heading");
const responseMessage = document.querySelector("#response-message");
const submissionDetails = document.querySelector("#submission-details");

const name = params.get("name");
const email = params.get("email");
const message = params.get("message");

if (responseHeading) {
    responseHeading.textContent = "Thank You!";
}

if (responseMessage) {
    responseMessage.textContent = name
        ? `Thank you, ${name}. Your message has been received.`
        : "Your form submission details appear below.";
}

if (submissionDetails) {
    submissionDetails.replaceChildren();

    const details = [
        ["Name", name],
        ["Email", email],
        ["Message", message]
    ];

    details.forEach(([label, value]) => {
        if (value) {
            const term = document.createElement("dt");
            const description = document.createElement("dd");

            term.textContent = label;
            description.textContent = value;

            submissionDetails.append(term, description);
        }
    });

    if (!details.some(([, value]) => value)) {
        submissionDetails.textContent = "No submission details were provided.";
    }
}
