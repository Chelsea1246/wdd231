
const FAVOURITES_KEY = "afriway-favourites";
const DISCOVERIES_KEY = "afriway-discoveries";

function readStoredData(key, fallback = []) {
    try {
        const saved = localStorage.getItem(key);

        if (!saved) {
            return fallback;
        }

        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
        console.error(`Unable to read ${key}:`, error);
        return fallback;
    }
}

export function getFavourites() {
    return readStoredData(FAVOURITES_KEY).map(String);
}

export function isFavourite(id) {
    return getFavourites().includes(String(id));
}

export function toggleFavourite(id) {
    const key = String(id);
    const favourites = getFavourites();
    const index = favourites.indexOf(key);

    if (index === -1) {
        favourites.push(key);
    } else {
        favourites.splice(index, 1);
    }

    try {
        localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favourites));
        return favourites;
    } catch (error) {
        console.error("Unable to save favourites:", error);
        return getFavourites();
    }
}

export function clearFavourites() {
    try {
        localStorage.removeItem(FAVOURITES_KEY);
        return true;
    } catch (error) {
        console.error("Unable to clear favourites:", error);
        return false;
    }
}

export function getDiscoveries() {
    return readStoredData(DISCOVERIES_KEY);
}

export function saveDiscovery(discovery) {
    if (!discovery || typeof discovery !== "object") {
        return false;
    }

    const discoveries = getDiscoveries();

    discoveries.push({
        ...discovery,
        submittedAt: new Date().toISOString()
    });

    try {
        localStorage.setItem(
            DISCOVERIES_KEY,
            JSON.stringify(discoveries)
        );

        return true;
    } catch (error) {
        console.error("Unable to save discovery:", error);
        return false;
    }
}
