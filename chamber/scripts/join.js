/* =========================================
MEMBERSHIP APPLICATION TIMESTAMP
========================================= */

const timestampField = document.querySelector("#timestamp");

if (timestampField) {
timestampField.value = new Date().toISOString();
}

/* =========================================
MEMBERSHIP MODALS
========================================= */

const modalButtons = document.querySelectorAll(".modal-button");

const closeButtons = document.querySelectorAll(".close-modal");

modalButtons.forEach((button) => {

```
button.addEventListener("click", () => {

    const modalId = button.dataset.modal;

    const modal = document.getElementById(modalId);

    if (modal) {
        modal.showModal();
    }

});
```

});

closeButtons.forEach((button) => {

```
button.addEventListener("click", () => {

    const modal = button.closest("dialog");

    if (modal) {
        modal.close();
    }

});
```

});

/* =========================================
CLOSE MODAL WHEN CLICKING OUTSIDE
========================================= */

document.querySelectorAll("dialog").forEach((modal) => {

```
modal.addEventListener("click", (event) => {

    if (event.target === modal) {
        modal.close();
    }

});
```

});
