/* =========================================
GET FORM INFORMATION
========================================= */

const params = new URLSearchParams(window.location.search);

const firstName = params.get("firstName") || "";
const lastName = params.get("lastName") || "";
const email = params.get("email") || "";
const phone = params.get("phone") || "";
const organization = params.get("organization") || "";
const timestamp = params.get("timestamp") || "";

/* =========================================
DISPLAY FORM INFORMATION
========================================= */

const results = document.querySelector("#form-results");

if (results) {


let formattedDate = timestamp;

if (timestamp) {

    const date = new Date(timestamp);

    if (!Number.isNaN(date.getTime())) {

        formattedDate = date.toLocaleString();

    }

}
}


results.innerHTML = 

    <div class="application-summary">

        <p>
            <strong>First Name:</strong>
            ${firstName}
        </p>

        <p>
            <strong>Last Name:</strong>
            ${lastName}
        </p>

        <p>
            <strong>Email:</strong>
            ${email}
        </p>

        <p>
            <strong>Mobile Number:</strong>
            ${phone}
        </p>

        <p>
            <strong>Business / Organization:</strong>
            ${organization}
        </p>

        <p>
            <strong>Application Date:</strong>
            ${formattedDate}
        </p>

    </div>

;


/* =========================================
FOOTER YEAR
========================================= */

const year = document.querySelector("#current-year");

if (year) {

year.textContent = new Date().getFullYear();


}

 {
/* =========================================
LAST MODIFIED
========================================= */

const modified = document.querySelector("#last-modified");

if (modified) {
modified.textContent = document.lastModified;
}
}
