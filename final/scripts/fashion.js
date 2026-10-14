
import { getFavourites, toggleFavourite } from "./storage.js";

const fashionItems = [
    {
        id: "kente",
        title: "Kente",
        country: "Ghana",
        category: "Textiles",
        description:
            "A woven textile tradition with patterns and designs connected to identity, history and social meaning."
    },
    {
        id: "adinkra",
        title: "Adinkra Cloth",
        country: "Ghana",
        category: "Textile Art",
        description:
            "A cloth tradition featuring stamped or drawn motifs that communicate ideas and cultural meanings."
    },
    {
        id: "aso-oke",
        title: "Aso Oke",
        country: "Nigeria",
        category: "Textiles",
        description:
            "A Yoruba handwoven textile used in clothing and important celebrations."
    },
    {
        id: "bogolanfini",
        title: "Bogolanfini",
        country: "Mali",
        category: "Textile Art",
        description:
            "A textile tradition recognised for its distinctive patterns and use of natural materials and dyes."
    },
    {
        id: "shweshwe",
        title: "Shweshwe",
        country: "South Africa",
        category: "Textiles",
        description:
            "A printed cotton fabric widely used in clothing, dressmaking and contemporary design."
    },
    {
        id: "maasai-beadwork",
        title: "Maasai Beadwork",
        country: "Kenya and Tanzania",
        category: "Adornment",
        description:
            "Beadwork can communicate identity, belonging and social meaning through colour, arrangement and design."
    },
    {
        id: "basotho-blanket",
        title: "Basotho Blanket",
        country: "Lesotho",
        category: "Textiles",
        description:
            "A recognisable textile associated with Basotho identity, dress and cultural pride."
    },
    {
        id: "barkcloth",
        title: "Barkcloth",
        country: "Uganda",
        category: "Craftsmanship",
        description:
            "A traditional material made through skilled bark-beating techniques and associated with Baganda heritage."
    }
];

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

function renderFashion(items) {
    const library = document.querySelector("#fashion-library");
    const count = document.querySelector("#fashion-count");

    if (!library) {
        return;
    }

    if (count) {
        count.textContent =
            `${items.length} ${items.length === 1 ? "tradition" : "traditions"} found`;
    }

    if (items.length === 0) {
        library.innerHTML = `
            <p class="loading-message">
                No fashion traditions match your search.
                Try a different word or category.
            </p>
        `;
        return;
    }

    const favourites = getFavourites();

    library.innerHTML = items.map((item, index) => {
        const saved = favourites.includes(item.id);
        const favouriteLabel = saved
            ? "Remove from favourites"
            : "Save to favourites";

        return `
            <article class="symbol-card fashion-card">
                <div class="symbol-card-content">
                    <p class="eyebrow">
                        ${escapeHTML(item.country)}
                    </p>

                    <h3>${escapeHTML(item.title)}</h3>

                    <p class="fashion-category">
                        ${escapeHTML(item.category)}
                    </p>

                    <p>${escapeHTML(item.description)}</p>

                    <button
                        class="button button-dark favourite-button"
                        type="button"
                        data-favorite="${escapeHTML(item.id)}"
                        aria-pressed="${saved}"
                        aria-label="${favouriteLabel}: ${escapeHTML(item.title)}"
                    >
                        ${saved ? "♥ Saved" : "♡ Save"}
                    </button>
                </div>
            </article>
        `;
    }).join("");

    library.querySelectorAll("[data-favorite]").forEach((button) => {
        button.addEventListener("click", () => {
            const id = button.dataset.favorite;
            toggleFavourite(id);

            // Rerender to update the button and its saved state.
            filterFashion();
        });
    });
}

function filterFashion() {
    const searchInput = document.querySelector("#fashion-search");
    const categorySelect = document.querySelector("#fashion-category");

    if (!searchInput || !categorySelect) {
        renderFashion(fashionItems);
        return;
    }

    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategory = categorySelect.value;

    const filteredItems = fashionItems.filter((item) => {
        const searchableText = [
            item.title,
            item.country,
            item.category,
            item.description
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(searchTerm);

        const matchesCategory =
            selectedCategory === "all" ||
            item.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    renderFashion(filteredItems);
}

function initializeFashion() {
    const searchInput = document.querySelector("#fashion-search");
    const categorySelect = document.querySelector("#fashion-category");

    if (!document.querySelector("#fashion-library")) {
        return;
    }

    searchInput?.addEventListener("input", filterFashion);
    categorySelect?.addEventListener("change", filterFashion);

    filterFashion();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeFashion, {
        once: true
    });
} else {
    initializeFashion();
}
