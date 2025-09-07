import API_URL from "./config";

// Helper function to make API requests
export async function fetchJSON(path, options = {}) {
    // Send request to backend
    const res = await fetch(`${API_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });

    // If request failed, throw an error
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || res.statusText);
    }

    // Return JSON response
    return res.json();
}
