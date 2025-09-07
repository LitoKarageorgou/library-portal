// Import the API base URL from config
import API_URL from "./config";

// A helper function to make API requests
export async function fetchJSON(path, options = {}) {
    // Send request to backend
    const res = await fetch(`${API_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options, // allow method, body, etc. eg. { method: "POST", body: JSON.stringify(data) }
    });

    // If response is not OK, throw an error
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || res.statusText);
    }

    // Otherwise return the JSON
    return res.json();
}
