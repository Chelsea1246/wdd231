const membersContainer = document.querySelector("#members");
const gridButton = document.querySelector("#grid");
const listButton = document.querySelector("#list");
const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#navigation");


// Load the members from the JSON file
async function getMembers() {
    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error("Could not load member data.");
        }

        const data = await response.json();

        displayMembers(data.members);
    } catch (error) {
        console.error("Error loading members:", error);
        membersContainer.innerHTML =
            "<p>Sorry, the business directory could not be loaded.</p>";
    }
}


// Display the businesses
function displayMembers(members) {
    membersContainer.innerHTML = "";

    members.forEach((member) => {
        const card = document.createElement("article");

        card.classList.add("member-card");

        card.innerHTML = `
            <img src="images/${member.image}" alt="${member.name} logo" loading="lazy">

            <div class="member-info">
                <h3>${member.name}</h3>

                <p>${member.address}</p>

                <p>${member.phone}</p>

                <p>
                    <a href="${member.website}" target="_blank" rel="noopener">
                        Visit Website
                    </a>
                </p>

                <p>
                    <strong>Membership:</strong>
                    ${getMembershipLevel(member.membershipLevel)}
                </p>
            </div>
        `;

        membersContainer.appendChild(card);
    });
}


// Convert membership number into a readable name
function getMembershipLevel(level) {
    if (level === 3) {
        return "Gold";
    } else if (level === 2) {
        return "Silver";
    } else {
        return "Member";
    }
}


// Grid view
gridButton.addEventListener("click", () => {
    membersContainer.classList.add("directory-grid");
    membersContainer.classList.remove("directory-list");
});


// List view
listButton.addEventListener("click", () => {
    membersContainer.classList.add("directory-list");
    membersContainer.classList.remove("directory-grid");
});


// Mobile navigation
menuButton.addEventListener("click", () => {
    navigation.classList.toggle("open");

    const isOpen = navigation.classList.contains("open");

    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );
});


// Copyright year
const currentYear = new Date().getFullYear();
document.querySelector("#current-year").textContent = currentYear;


// Last modified date
document.querySelector("#last-modified").textContent =
    document.lastModified;


// Load the members when the page opens
getMembers();