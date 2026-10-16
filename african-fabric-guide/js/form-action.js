<<<<<<< HEAD

const responseHeading = document.querySelector("#response-heading");
const responseMessage = document.querySelector("#response-message");
const submissionDetails = document.querySelector("#submission-details");

// Read the submitted form values from the URL
const submittedData = new URLSearchParams(window.location.search);

const name = submittedData.get("name")?.trim() || "";
const email = submittedData.get("email")?.trim() || "";
const topic = submittedData.get("topic")?.trim() || "";
const message = submittedData.get("message")?.trim() || "";

// Check whether the form contains submitted information
if (name && email && topic && message) {
    responseHeading.textContent = "Thank You, " + name + "!";
    responseMessage.textContent =
        "Your form was submitted. Here are the details you entered.";

    const details = [
        ["Full Name", name],
        ["Email Address", email],
        ["Message Topic", topic],
        ["Your Message", message]
    ];

    details.forEach(([label, value]) => {
        const term = document.createElement("dt");
        const description = document.createElement("dd");

        term.textContent = label;
        description.textContent = value;

        submissionDetails.append(term, description);
    });
} else {
    responseHeading.textContent = "No Submission Found";
    responseMessage.textContent =
        "Please complete the contact form before viewing submission details.";

    const contactLink = document.createElement("a");
    contactLink.href = "contact.html";
    contactLink.textContent = "Open the Contact Form";
    submissionDetails.appendChild(contactLink);
}
=======

const responseHeading = document.querySelector("#response-heading");
const responseMessage = document.querySelector("#response-message");
const submissionDetails = document.querySelector("#submission-details");

// Read the submitted form values from the URL
const submittedData = new URLSearchParams(window.location.search);

const name = submittedData.get("name")?.trim() || "";
const email = submittedData.get("email")?.trim() || "";
const topic = submittedData.get("topic")?.trim() || "";
const message = submittedData.get("message")?.trim() || "";

// Check whether the form contains submitted information
if (name && email && topic && message) {
    responseHeading.textContent = "Thank You, " + name + "!";
    responseMessage.textContent =
        "Your form was submitted. Here are the details you entered.";

    const details = [
        ["Full Name", name],
        ["Email Address", email],
        ["Message Topic", topic],
        ["Your Message", message]
    ];

    details.forEach(([label, value]) => {
        const term = document.createElement("dt");
        const description = document.createElement("dd");

        term.textContent = label;
        description.textContent = value;

        submissionDetails.append(term, description);
    });
} else {
    responseHeading.textContent = "No Submission Found";
    responseMessage.textContent =
        "Please complete the contact form before viewing submission details.";

    const contactLink = document.createElement("a");
    contactLink.href = "contact.html";
    contactLink.textContent = "Open the Contact Form";
    submissionDetails.appendChild(contactLink);
}
>>>>>>> 5bc01bd47c96e634361bc049a6f00632839908db
